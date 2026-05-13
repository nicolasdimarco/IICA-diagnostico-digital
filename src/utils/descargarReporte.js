export function descargarReporte({ promedios, hallazgos, foda, cruces, puntos }) {
  const fmt = (v) => (typeof v === 'number' ? v.toFixed(2) : v)
  let text = 'REPORTE DE DIAGNÓSTICO DIGITAL - MÓDULO 1\n'
  text += '========================================\n\n'
  text += 'PROMEDIOS DE MADUREZ:\n'
  text += `- Tecnología: ${fmt(promedios.tec)}\n`
  text += `- Procesos: ${fmt(promedios.pro)}\n`
  text += `- Personas: ${fmt(promedios.per)}\n`
  text += `- Cultura: ${fmt(promedios.cul)}\n\n`

  text += 'REFLEXIONES CUALITATIVAS:\n'
  const grupos = new Map()
  hallazgos.forEach((h) => {
    const item = typeof h === 'string' ? { texto: h, bloque: '' } : h
    const key = item.bloque || '(Sin bloque)'
    if (!grupos.has(key)) grupos.set(key, [])
    grupos.get(key).push(item.texto)
  })
  for (const [bloque, lista] of grupos) {
    text += `\n[${bloque}]\n`
    lista.forEach((t) => { text += `- ${t}\n` })
  }

  text += '\nMATRIZ FODA BASE:\n'
  text += `- Fortalezas: ${foda.f}\n`
  text += `- Oportunidades: ${foda.o}\n`
  text += `- Debilidades: ${foda.d}\n`
  text += `- Amenazas: ${foda.a}\n\n`

  text += 'CRUCES ESTRATÉGICOS (FAMILIAS DE PROBLEMAS):\n'
  text += `- Potencialidades (F+O): ${cruces.fo}\n`
  text += `- Desafíos (D+O): ${cruces.do}\n`
  text += `- Riesgos (F+A): ${cruces.fa}\n`
  text += `- Puntos Críticos (D+A): ${cruces.da}\n\n`

  text += 'PUNTOS CRÍTICOS PRIORIZADOS (EMBUDO):\n'
  puntos.forEach((p) => { text += `- ${p.n} (Esfuerzo: ${p.x}, Impacto: ${p.y})\n` })

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
