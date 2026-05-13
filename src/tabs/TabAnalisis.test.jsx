import { describe, it, expect } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import TabAnalisis from './TabAnalisis.jsx'
import { DiagnosticoProvider } from '../state/DiagnosticoContext.jsx'

function renderTab() {
  return render(
    <DiagnosticoProvider>
      <TabAnalisis />
    </DiagnosticoProvider>,
  )
}

describe('TabAnalisis - muro de hallazgos con bloque', () => {
  it('el botón Añadir arranca deshabilitado y se habilita con bloque + texto', async () => {
    const user = userEvent.setup()
    renderTab()
    const btn = screen.getByRole('button', { name: /Añadir/i })
    expect(btn).toBeDisabled()

    // Sólo texto: sigue deshabilitado
    await user.type(screen.getByPlaceholderText(/Registre la respuesta/i), 'Algo')
    expect(btn).toBeDisabled()

    // Seleccionar bloque desde el combobox
    const combo = screen.getByRole('combobox', { name: /Bloque/i })
    await user.click(combo)
    await user.click(screen.getByRole('option', { name: /Bloque 1:/i }))
    expect(btn).toBeEnabled()
  })

  it('el combobox filtra opciones al tipear', async () => {
    const user = userEvent.setup()
    renderTab()
    const combo = screen.getByRole('combobox', { name: /Bloque/i })
    await user.click(combo)
    expect(screen.getAllByRole('option')).toHaveLength(3)
    await user.type(combo, 'tecno')
    const opts = screen.getAllByRole('option')
    expect(opts).toHaveLength(1)
    expect(opts[0]).toHaveTextContent(/Bloque 2/i)
  })

  it('agrupa hallazgos por bloque en el orden de BLOQUES', async () => {
    const user = userEvent.setup()
    renderTab()
    const combo = screen.getByRole('combobox', { name: /Bloque/i })
    const input = screen.getByPlaceholderText(/Registre la respuesta/i)

    // Primero agrega un hallazgo al Bloque 2
    await user.click(combo)
    await user.click(screen.getByRole('option', { name: /Bloque 2:/i }))
    await user.type(input, 'Respuesta B2-1')
    await user.click(screen.getByRole('button', { name: /Añadir/i }))

    // Después dos hallazgos al Bloque 1
    await user.click(combo)
    await user.click(screen.getByRole('option', { name: /Bloque 1:/i }))
    await user.type(input, 'Respuesta B1-1')
    await user.click(screen.getByRole('button', { name: /Añadir/i }))
    await user.type(input, 'Respuesta B1-2')
    await user.click(screen.getByRole('button', { name: /Añadir/i }))

    // Las dos secciones se muestran en el orden de BLOQUES (B1 antes que B2)
    const secciones = screen.getAllByRole('region')
    expect(secciones).toHaveLength(2)
    expect(secciones[0]).toHaveAccessibleName(/Bloque 1:/i)
    expect(secciones[1]).toHaveAccessibleName(/Bloque 2:/i)

    // B1 contiene ambas respuestas; B2 sólo la suya
    expect(within(secciones[0]).getByText(/Respuesta B1-1/)).toBeInTheDocument()
    expect(within(secciones[0]).getByText(/Respuesta B1-2/)).toBeInTheDocument()
    expect(within(secciones[1]).getByText(/Respuesta B2-1/)).toBeInTheDocument()
    expect(within(secciones[0]).queryByText(/Respuesta B2-1/)).not.toBeInTheDocument()
  })

  it('limpia el texto pero conserva el bloque para agregar más al mismo bloque', async () => {
    const user = userEvent.setup()
    renderTab()
    const combo = screen.getByRole('combobox', { name: /Bloque/i })
    await user.click(combo)
    await user.click(screen.getByRole('option', { name: /Bloque 3:/i }))
    const input = screen.getByPlaceholderText(/Registre la respuesta/i)
    await user.type(input, 'Uno')
    await user.click(screen.getByRole('button', { name: /Añadir/i }))
    expect(input).toHaveValue('')
    expect(combo.value).toMatch(/Bloque 3/)
    // Tipeando nuevo texto, sin reseleccionar bloque, se vuelve a habilitar
    await user.type(input, 'Dos')
    expect(screen.getByRole('button', { name: /Añadir/i })).toBeEnabled()
  })
})
