// Persistencia de borrador en localStorage. Una sola clave versionada
// (cambiar el sufijo invalida snapshots anteriores en caso de migración).
export const STORAGE_KEY = 'iica-diagnostico:v1'

function safeStorage() {
  try {
    if (typeof window === 'undefined') return null
    return window.localStorage
  } catch { return null }
}

export function readSnapshot() {
  const s = safeStorage()
  if (!s) return null
  try {
    const raw = s.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : null
  } catch { return null }
}

export function writeSnapshot(snap) {
  const s = safeStorage()
  if (!s) return
  try { s.setItem(STORAGE_KEY, JSON.stringify(snap)) } catch { /* quota / privado */ }
}

export function clearSnapshot() {
  const s = safeStorage()
  if (!s) return
  try { s.removeItem(STORAGE_KEY) } catch { /* noop */ }
}

const nonEmpty = (v) => (v || '').toString().trim().length > 0

// Heurística: hay progreso si cualquiera de los slices tiene contenido del usuario.
export function hasProgress(snap) {
  if (!snap || typeof snap !== 'object') return false
  if (snap.respuestas && Object.keys(snap.respuestas).length > 0) return true
  if (Array.isArray(snap.hallazgos) && snap.hallazgos.length > 0) return true
  if (snap.foda && Object.values(snap.foda).some(nonEmpty)) return true
  if (snap.cruces && Object.values(snap.cruces).some(nonEmpty)) return true
  if (Array.isArray(snap.puntos) && snap.puntos.length > 0) return true
  const m2 = snap.modulo2
  if (m2) {
    const v = m2.vision || {}
    if (['dolores', 'expectativas', 'estadoFuturo', 'habilitadores', 'proposito', 'statement'].some((k) => nonEmpty(v[k]))) return true
    if (Array.isArray(m2.iniciativas) && m2.iniciativas.length > 0) return true
    if (m2.smart && Object.keys(m2.smart).length > 0) return true
    const g = m2.gobernanza || {}
    if (['responsable', 'modeloLiderazgo', 'fechaRevision'].some((k) => nonEmpty(g[k]))) return true
  }
  return false
}
