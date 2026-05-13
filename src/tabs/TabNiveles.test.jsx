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
    // Tomamos el radio "1" del grupo d1_q3.
    const radio = document.querySelector('input[name="d1_q3"][value="1"]')
    await user.click(radio)
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
    // Marcar las 4 preguntas visibles de Tecnología en 5 (sin tocar d1_q3 -> d1_q4 queda oculta).
    for (const id of ['d1_q1', 'd1_q2']) {
      await user.click(document.querySelector(`input[name="${id}"][value="5"]`))
    }
    await user.click(screen.getByRole('button', { name: /VER RESULTADOS/i }))
    // Sólo d1_q1 y d1_q2 cuentan -> promedio tec = 5
    expect(screen.getByTestId('tabla-mock')).toHaveTextContent('5.00')
  })
})
