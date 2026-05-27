import { DIMENSIONES } from '../../data/preguntas.js'
import { BLOQUES } from '../../data/bloques.js'

const isAnswered = (v) => v !== undefined && v !== null && v !== ''
const isFilled = (v) => (v || '').toString().trim().length > 0

// Niveles: total = preguntas activas (respetando dependsOn); filled = preguntas respondidas.
export function progressNiveles(state) {
  const r = state?.respuestas || {}
  let filled = 0, total = 0
  DIMENSIONES.forEach((dim) => {
    dim.preguntas.forEach((p) => {
      if (p.dependsOn) {
        const depV = r[p.dependsOn.id]
        if (!isAnswered(depV) || parseInt(depV, 10) < p.dependsOn.minValue) return
      }
      total += 1
      if (isAnswered(r[p.id])) filled += 1
    })
  })
  return { filled, total }
}

// Análisis cualitativo: total = N bloques; filled = bloques con al menos 1 hallazgo.
export function progressAnalisis(state) {
  const hs = state?.hallazgos || []
  const filled = BLOQUES.reduce(
    (acc, b) => acc + (hs.some((h) => h.bloque === b.titulo) ? 1 : 0),
    0,
  )
  return { filled, total: BLOQUES.length }
}

// FODA + cruces: 8 campos de texto.
export function progressFoda(state) {
  const f = state?.foda || {}, c = state?.cruces || {}
  const fields = [f.f, f.o, f.d, f.a, c.fo, c.do, c.fa, c.da]
  return { filled: fields.filter(isFilled).length, total: fields.length }
}

// Embudo de puntos críticos: al menos 1 punto cargado.
export function progressEmbudo(state) {
  return { filled: (state?.puntos || []).length > 0 ? 1 : 0, total: 1 }
}
