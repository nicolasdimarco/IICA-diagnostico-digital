import { MODELOS_LIDERAZGO } from './state.js'
import { iniciativasPorTipo, generarStatementSmart, TIPOS_INICIATIVA } from './classify.js'

export function exportarModulo2(state) {
  const m2 = state?.modulo2
  if (!m2) return ''
  const { vision, iniciativas, smart, gobernanza } = m2

  let text = 'MÓDULO 2 — ESTRATEGIA DIGITAL\n'
  text += '=============================\n\n'

  text += 'VISIÓN DIGITAL:\n'
  text += `- Dolores: ${vision.dolores || '—'}\n`
  text += `- Expectativas: ${vision.expectativas || '—'}\n`
  text += `- Estado futuro: ${vision.estadoFuturo || '—'}\n`
  text += `- Habilitadores: ${vision.habilitadores || '—'}\n`
  text += `- Propósito: ${vision.proposito || '—'}\n`
  text += `\nStatement consolidado${vision.statementManual ? ' (editado manualmente)' : ''}:\n`
  text += `${vision.statement || '—'}\n\n`

  text += 'INICIATIVAS PRIORIZADAS (MATRIZ IMPACTO/ESFUERZO):\n'
  Object.values(TIPOS_INICIATIVA).forEach((tipo) => {
    const items = iniciativasPorTipo(iniciativas, tipo.id)
    if (items.length === 0) return
    text += `\n[${tipo.label}]\n`
    items.forEach((it) => {
      text += `- ${it.nombre} (Impacto: ${it.impacto}, Esfuerzo: ${it.esfuerzo})\n`
      if (it.descripcion) text += `  ${it.descripcion}\n`
    })
  })
  text += '\n'

  const quickWins = iniciativasPorTipo(iniciativas, 'quick_win')
  text += 'OBJETIVOS SMART (sobre quick wins):\n'
  if (quickWins.length === 0) {
    text += '- (Sin quick wins clasificados)\n'
  } else {
    quickWins.forEach((it) => {
      const statement = generarStatementSmart(smart[it.id])
      text += `\n* ${it.nombre}\n`
      text += `  ${statement || '(SMART incompleto)'}\n`
    })
  }
  text += '\n'

  const modelo = MODELOS_LIDERAZGO.find((x) => x.id === gobernanza.modeloLiderazgo)
  text += 'GOBERNANZA:\n'
  text += `- Responsable: ${gobernanza.responsable || '—'}\n`
  text += `- Modelo de liderazgo: ${modelo?.label || '—'}\n`
  text += `- Primera revisión trimestral: ${gobernanza.fechaRevision || '—'}\n`

  return text
}
