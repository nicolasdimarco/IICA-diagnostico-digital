import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import TabNiveles from './TabNiveles.jsx'
import { DiagnosticoProvider } from '../state/DiagnosticoContext.jsx'

// Mocks de componentes con canvas (Chart.js) — no aportan al test de flujo.
vi.mock('../components/RadarMadurez.jsx', () => ({
  default: () => <div data-testid="radar-mock">radar</div>,
}))
vi.mock('../components/TablaPromedios.jsx', () => ({
  default: ({ promedios }) => (
    <table data-testid="tabla-mock">
      <tbody>
        <tr><td>tec</td><td>{promedios.tec.toFixed(2)}</td></tr>
      </tbody>
    </table>
  ),
}))

function renderTab() {
  return render(
    <DiagnosticoProvider>
      <TabNiveles />
    </DiagnosticoProvider>,
  )
}

const pillByLabel = (label) =>
  Array.from(document.querySelectorAll('.wizard-pill')).find((el) => el.textContent.includes(label))

describe('TabNiveles (wizard)', () => {
  it('arranca en el paso 1 con la pill correspondiente activa', () => {
    renderTab()
    expect(pillByLabel('Completar cuestionario')).toHaveClass('active')
    expect(pillByLabel('Ver resultados')).not.toHaveClass('active')
    expect(screen.getByRole('button', { name: /VER RESULTADOS/i })).toBeInTheDocument()
    expect(screen.queryByTestId('radar-mock')).not.toBeInTheDocument()
  })

  it('renderiza la pregunta condicional 1.4 sólo si 1.3 >= 1', async () => {
    const user = userEvent.setup()
    renderTab()
    expect(screen.queryByText(/1\.4 Integración de Sistemas/i)).not.toBeInTheDocument()
    // Tomamos el segmento "1" del grupo d1_q3 en la barra de progreso.
    const seg = document.querySelector('button[data-name="d1_q3"][data-value="1"]')
    await user.click(seg)
    expect(screen.getByText(/1\.4 Integración de Sistemas/i)).toBeInTheDocument()
  })

  it('al clickear "VER RESULTADOS" pasa al paso 2 (radar + tabla visibles)', async () => {
    const user = userEvent.setup()
    window.scrollTo = vi.fn()
    renderTab()
    await user.click(screen.getByRole('button', { name: /VER RESULTADOS/i }))
    expect(screen.getByTestId('radar-mock')).toBeInTheDocument()
    expect(screen.getByTestId('tabla-mock')).toBeInTheDocument()
    expect(pillByLabel('Ver resultados')).toHaveClass('active')
    expect(screen.getByRole('button', { name: /Volver al cuestionario/i })).toBeInTheDocument()
  })

  it('"Volver al cuestionario" regresa al paso 1', async () => {
    const user = userEvent.setup()
    window.scrollTo = vi.fn()
    renderTab()
    await user.click(screen.getByRole('button', { name: /VER RESULTADOS/i }))
    await user.click(screen.getByRole('button', { name: /Volver al cuestionario/i }))
    expect(screen.getByRole('button', { name: /VER RESULTADOS/i })).toBeInTheDocument()
    expect(screen.queryByTestId('radar-mock')).not.toBeInTheDocument()
  })

  it('refleja respuestas del paso 1 en la tabla del paso 2', async () => {
    const user = userEvent.setup()
    window.scrollTo = vi.fn()
    renderTab()
    // Marcar las 2 preguntas visibles de Tecnología en 5 (sin tocar d1_q3 -> d1_q4 queda oculta).
    for (const id of ['d1_q1', 'd1_q2']) {
      await user.click(document.querySelector(`button[data-name="${id}"][data-value="5"]`))
    }
    await user.click(screen.getByRole('button', { name: /VER RESULTADOS/i }))
    // Sólo d1_q1 y d1_q2 cuentan -> promedio tec = 5
    expect(screen.getByTestId('tabla-mock')).toHaveTextContent('5.00')
  })
})

describe('TabNiveles - barra de progreso', () => {
  const segs = (id) => Array.from(document.querySelectorAll(`button[data-name="${id}"]`))

  it('arranca con todos los segmentos sin presionar y display en "— / 5"', () => {
    renderTab()
    const grupo = screen.getByRole('group', { name: /1\.1 Equipamiento/i })
    expect(grupo).toBeInTheDocument()
    segs('d1_q1').forEach((b) => expect(b).toHaveAttribute('aria-pressed', 'false'))
    expect(grupo.parentElement).toHaveTextContent('— / 5')
  })

  it('al clickear el segmento N, marca como pressed los segmentos 0..N y muestra "N / 5"', async () => {
    const user = userEvent.setup()
    renderTab()
    await user.click(document.querySelector('button[data-name="d2_q1"][data-value="3"]'))
    const buttons = segs('d2_q1')
    buttons.forEach((b, i) => {
      // aria-pressed indica el seleccionado exacto; el "fill" se evalúa por estilo (no se testea acá).
      expect(b).toHaveAttribute('aria-pressed', i === 3 ? 'true' : 'false')
    })
    const grupo = screen.getByRole('group', { name: /2\.1 Documentación/i })
    expect(grupo.parentElement).toHaveTextContent('3 / 5')
  })

  it('flecha derecha desde un valor incrementa en 1 (saturado en 5)', async () => {
    const user = userEvent.setup()
    renderTab()
    const seg2 = document.querySelector('button[data-name="d3_q1"][data-value="2"]')
    await user.click(seg2)
    seg2.focus()
    await user.keyboard('{ArrowRight}')
    expect(screen.getByRole('group', { name: /3\.1 Habilidades/i }).parentElement).toHaveTextContent('3 / 5')
    // saturación
    await user.keyboard('{ArrowRight}{ArrowRight}{ArrowRight}{ArrowRight}')
    expect(screen.getByRole('group', { name: /3\.1 Habilidades/i }).parentElement).toHaveTextContent('5 / 5')
  })

  it('tecla numérica 0-5 fija el valor', async () => {
    const user = userEvent.setup()
    renderTab()
    const seg = document.querySelector('button[data-name="d4_q1"][data-value="0"]')
    seg.focus()
    await user.keyboard('4')
    expect(screen.getByRole('group', { name: /4\.1 Apertura/i }).parentElement).toHaveTextContent('4 / 5')
  })
})
