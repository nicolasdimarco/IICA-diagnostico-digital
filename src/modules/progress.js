// Agrega el progreso de todos los steps registrados en MODULOS.
// Cada step puede exponer una función `progress(state) => { filled, total }`.
// Steps sin `progress` no aportan al cómputo.
// Si un step devuelve total <= 0, se omite (caso típico: SMART sin quick wins aún).
export function calcularProgreso(modulos, state) {
  let filled = 0, total = 0
  modulos.forEach((m) => {
    m.steps.forEach((s) => {
      if (typeof s.progress !== 'function') return
      const p = s.progress(state) || {}
      const t = Number(p.total) || 0
      const f = Number(p.filled) || 0
      if (t <= 0) return
      filled += Math.min(f, t)
      total += t
    })
  })
  const percent = total > 0 ? Math.round((filled / total) * 100) : 0
  return { filled, total, percent }
}
