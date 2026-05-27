import { iniciativasPorTipo } from './classify.js'

const isFilled = (v) => (v || '').toString().trim().length > 0

// Visión Digital: 5 bloques de entrada (el statement consolidado se deriva).
export function progressVision(state) {
  const v = state?.modulo2?.vision || {}
  const fields = ['dolores', 'expectativas', 'estadoFuturo', 'habilitadores', 'proposito']
  return { filled: fields.filter((k) => isFilled(v[k])).length, total: fields.length }
}

// Matriz Impacto/Esfuerzo: al menos 1 iniciativa creada.
export function progressMatriz(state) {
  const ini = state?.modulo2?.iniciativas || []
  return { filled: ini.length > 0 ? 1 : 0, total: 1 }
}

// SMART: 5 campos por cada quick win. Si todavía no hay quick wins,
// no aporta al cómputo (total = 0) para no penalizar antes de tiempo.
export function progressSmart(state) {
  const ini = state?.modulo2?.iniciativas || []
  const smart = state?.modulo2?.smart || {}
  const qw = iniciativasPorTipo(ini, 'quick_win')
  if (qw.length === 0) return { filled: 0, total: 0 }
  const fields = ['especifico', 'medible', 'alcanzable', 'relevante', 'temporal']
  let filled = 0
  qw.forEach((it) => {
    const s = smart[it.id] || {}
    fields.forEach((k) => { if (isFilled(s[k])) filled += 1 })
  })
  return { filled, total: qw.length * fields.length }
}

// Gobernanza: 3 campos (responsable, modelo de liderazgo, fecha de revisión).
export function progressGobernanza(state) {
  const g = state?.modulo2?.gobernanza || {}
  const fields = ['responsable', 'modeloLiderazgo', 'fechaRevision']
  return { filled: fields.filter((k) => isFilled(g[k])).length, total: fields.length }
}
