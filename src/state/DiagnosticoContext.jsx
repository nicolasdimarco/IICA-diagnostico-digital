import { createContext, useContext, useEffect, useMemo, useRef, useState } from 'react'
import { promediosDimensiones } from '../data/preguntas.js'
import { useModulo2State } from '../modules/modulo2/state.js'
import { readSnapshot, writeSnapshot, clearSnapshot } from './storage.js'

const DiagnosticoContext = createContext(null)

const FODA_DEFAULT = { f: '', o: '', d: '', a: '' }
const CRUCES_DEFAULT = { fo: '', do: '', fa: '', da: '' }

export function DiagnosticoProvider({ children }) {
  // Snapshot persistido se lee una sola vez al montar para hidratar cada slice.
  const initialRef = useRef(readSnapshot() || {})
  const initial = initialRef.current

  // Cuestionario: { d1_q1: '3', d1_q2: '4', ... }
  const [respuestas, setRespuestas] = useState(() => initial.respuestas || {})
  // Muro de hallazgos
  const [hallazgos, setHallazgos] = useState(() => initial.hallazgos || [])
  // FODA + cruces
  const [foda, setFoda] = useState(() => ({ ...FODA_DEFAULT, ...(initial.foda || {}) }))
  const [cruces, setCruces] = useState(() => ({ ...CRUCES_DEFAULT, ...(initial.cruces || {}) }))
  // Embudo de puntos críticos: [{ n, x, y }]
  const [puntos, setPuntos] = useState(() => initial.puntos || [])

  const promedios = useMemo(() => promediosDimensiones(respuestas), [respuestas])

  const setRespuesta = (id, value) =>
    setRespuestas((prev) => {
      const next = { ...prev, [id]: value }
      // Si 1.3 cae por debajo de 1, limpiar 1.4
      if (id === 'd1_q3' && (value === '' || parseInt(value, 10) < 1)) {
        delete next.d1_q4
      }
      return next
    })

  const agregarHallazgo = (texto, bloque = '') => {
    const v = (texto || '').trim()
    if (!v) return
    setHallazgos((prev) => [{ texto: v, bloque: (bloque || '').trim() }, ...prev])
  }
  const borrarHallazgos = () => setHallazgos([])

  const setFodaCampo = (k, v) => setFoda((prev) => ({ ...prev, [k]: v }))
  const setCruceCampo = (k, v) => setCruces((prev) => ({ ...prev, [k]: v }))

  const agregarPunto = (p) => setPuntos((prev) => [...prev, p])
  const eliminarPunto = (i) =>
    setPuntos((prev) => prev.filter((_, idx) => idx !== i))
  const borrarTodosPuntos = () => setPuntos([])

  const modulo2 = useModulo2State(initial.modulo2)

  // Persistencia: cada cambio de cualquier slice escribe el snapshot completo.
  // La primera escritura ocurre tras el primer render (después de la hidratación).
  const skipFirstWrite = useRef(true)
  useEffect(() => {
    if (skipFirstWrite.current) { skipFirstWrite.current = false; return }
    writeSnapshot({
      respuestas, hallazgos, foda, cruces, puntos,
      modulo2: {
        vision: modulo2.vision,
        iniciativas: modulo2.iniciativas,
        smart: modulo2.smart,
        gobernanza: modulo2.gobernanza,
      },
    })
  }, [respuestas, hallazgos, foda, cruces, puntos, modulo2.vision, modulo2.iniciativas, modulo2.smart, modulo2.gobernanza])

  // Reset global: limpia todos los slices y borra el snapshot persistido.
  const resetAll = () => {
    setRespuestas({})
    setHallazgos([])
    setFoda(FODA_DEFAULT)
    setCruces(CRUCES_DEFAULT)
    setPuntos([])
    modulo2.resetAll()
    clearSnapshot()
    // Evita que el effect de persistencia vuelva a escribir el estado por defecto.
    skipFirstWrite.current = true
  }

  const value = {
    respuestas, setRespuesta,
    hallazgos, agregarHallazgo, borrarHallazgos,
    foda, setFodaCampo,
    cruces, setCruceCampo,
    puntos, agregarPunto, eliminarPunto, borrarTodosPuntos,
    promedios,
    modulo2,
    resetAll,
  }

  return <DiagnosticoContext.Provider value={value}>{children}</DiagnosticoContext.Provider>
}

export function useDiagnostico() {
  const ctx = useContext(DiagnosticoContext)
  if (!ctx) throw new Error('useDiagnostico debe usarse dentro de DiagnosticoProvider')
  return ctx
}
