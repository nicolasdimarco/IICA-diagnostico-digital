export const TIPOS_INICIATIVA = {
  quick_win:    { id: 'quick_win',    label: 'Quick Win',             color: 'emerald', short: 'Quick Win' },
  estrategico:  { id: 'estrategico',  label: 'Proyecto Estratégico',  color: 'blue',    short: 'Estratégico' },
  menor:        { id: 'menor',        label: 'Mejora Menor',          color: 'amber',   short: 'Mejora Menor' },
  evitar:       { id: 'evitar',       label: 'Proyecto a Evitar',     color: 'rose',    short: 'A Evitar' },
}

// Escala 1-5: alto = >= 4, bajo = <= 3 (umbral simétrico explícito).
export function clasificarIniciativa({ impacto, esfuerzo }) {
  const altoImpacto = Number(impacto) >= 4
  const altoEsfuerzo = Number(esfuerzo) >= 4
  if (altoImpacto && !altoEsfuerzo) return TIPOS_INICIATIVA.quick_win
  if (altoImpacto && altoEsfuerzo)  return TIPOS_INICIATIVA.estrategico
  if (!altoImpacto && !altoEsfuerzo) return TIPOS_INICIATIVA.menor
  return TIPOS_INICIATIVA.evitar
}

export function iniciativasPorTipo(iniciativas, tipoId) {
  return iniciativas.filter((it) => clasificarIniciativa(it).id === tipoId)
}

// Genera un statement SMART consolidado a partir de los 5 campos.
export function generarStatementSmart(smart) {
  if (!smart) return ''
  const e = (smart.especifico || '').trim()
  const m = (smart.medible || '').trim()
  const a = (smart.alcanzable || '').trim()
  const r = (smart.relevante || '').trim()
  const t = (smart.temporal || '').trim()
  if (!e && !m && !a && !r && !t) return ''
  const partes = []
  if (e) partes.push(e)
  if (m) partes.push(`medido por ${m}`)
  if (a) partes.push(`apalancando ${a}`)
  if (r) partes.push(`con el fin de ${r}`)
  if (t) partes.push(`en ${t}`)
  return partes.join(', ') + '.'
}
