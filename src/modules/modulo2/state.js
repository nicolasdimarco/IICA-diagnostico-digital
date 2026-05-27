import { useMemo, useState } from 'react'

export const VISION_DEFAULT = {
  dolores: '',
  expectativas: '',
  estadoFuturo: '',
  habilitadores: '',
  proposito: '',
  statement: '',
  statementManual: false,
}

export const GOBERNANZA_DEFAULT = {
  responsable: '',
  modeloLiderazgo: '',
  fechaRevision: '',
}

export const MODELOS_LIDERAZGO = [
  { id: 'comite',    label: 'Comité de Transformación Digital' },
  { id: 'campeon',   label: 'Gestor/Campeón Digital' },
  { id: 'gerencia',  label: 'Gerencia General' },
]

// El statement consolidado se compone de los 3 bloques estratégicos
// (estado futuro, habilitadores, propósito) en una redacción canónica.
// El usuario puede sobrescribirlo manualmente y a partir de ese momento
// el campo `statementManual` queda en true, congelando la auto-generación.
export function generarStatementVision(vision) {
  const ef = (vision.estadoFuturo || '').trim()
  const hb = (vision.habilitadores || '').trim()
  const pr = (vision.proposito || '').trim()
  const partes = []
  if (ef) partes.push(`Nos proyectamos hacia ${ef}`)
  if (hb) partes.push(`apoyándonos en ${hb}`)
  if (pr) partes.push(`para ${pr}`)
  return partes.join(', ') + (partes.length > 0 ? '.' : '')
}

export function useModulo2State(initial = {}) {
  const [vision, setVision] = useState(() => ({ ...VISION_DEFAULT, ...(initial.vision || {}) }))
  const [iniciativas, setIniciativas] = useState(() => initial.iniciativas || [])
  const [smart, setSmart] = useState(() => initial.smart || {})
  const [gobernanza, setGobernanza] = useState(() => ({ ...GOBERNANZA_DEFAULT, ...(initial.gobernanza || {}) }))

  const resetAll = () => {
    setVision(VISION_DEFAULT)
    setIniciativas([])
    setSmart({})
    setGobernanza(GOBERNANZA_DEFAULT)
  }

  const setVisionCampo = (key, value) =>
    setVision((prev) => {
      const next = { ...prev, [key]: value }
      if (key === 'statement') {
        next.statementManual = value.trim().length > 0
      } else if (!prev.statementManual) {
        next.statement = generarStatementVision(next)
      }
      return next
    })

  const resetVisionStatement = () =>
    setVision((prev) => ({ ...prev, statementManual: false, statement: generarStatementVision(prev) }))

  const agregarIniciativa = (data) => {
    const nombre = (data?.nombre || '').trim()
    if (!nombre) return
    const id = `ini_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`
    setIniciativas((prev) => [
      ...prev,
      {
        id,
        nombre,
        descripcion: (data.descripcion || '').trim(),
        impacto: Number(data.impacto) || 3,
        esfuerzo: Number(data.esfuerzo) || 3,
      },
    ])
  }

  const actualizarIniciativa = (id, patch) =>
    setIniciativas((prev) => prev.map((it) => (it.id === id ? { ...it, ...patch } : it)))

  const eliminarIniciativa = (id) => {
    setIniciativas((prev) => prev.filter((it) => it.id !== id))
    setSmart((prev) => {
      if (!(id in prev)) return prev
      const { [id]: _drop, ...rest } = prev
      return rest
    })
  }

  const setSmartCampo = (iniciativaId, campo, valor) =>
    setSmart((prev) => ({
      ...prev,
      [iniciativaId]: { ...(prev[iniciativaId] || {}), [campo]: valor },
    }))

  const setGobernanzaCampo = (campo, valor) =>
    setGobernanza((prev) => ({ ...prev, [campo]: valor }))

  return useMemo(
    () => ({
      vision, setVisionCampo, resetVisionStatement,
      iniciativas, agregarIniciativa, actualizarIniciativa, eliminarIniciativa,
      smart, setSmartCampo,
      gobernanza, setGobernanzaCampo,
      resetAll,
    }),
    [vision, iniciativas, smart, gobernanza],
  )
}
