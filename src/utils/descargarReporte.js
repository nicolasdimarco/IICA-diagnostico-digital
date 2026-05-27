export function descargarReporte({ modulos, state }) {
  let text = 'REPORTE DE DIAGNÓSTICO DIGITAL\n'
  text += '==============================\n\n'

  modulos.forEach((m) => {
    if (typeof m.exportSection !== 'function') return
    const section = m.exportSection(state)
    if (section && section.trim().length > 0) {
      text += section
      if (!text.endsWith('\n\n')) text += '\n\n'
    }
  })

  const blob = new Blob([text], { type: 'text/plain' })
  const anchor = document.createElement('a')
  anchor.download = 'Diagnostico_Digital.txt'
  anchor.href = window.URL.createObjectURL(blob)
  anchor.target = '_blank'
  anchor.style.display = 'none'
  document.body.appendChild(anchor)
  anchor.click()
  document.body.removeChild(anchor)
}
