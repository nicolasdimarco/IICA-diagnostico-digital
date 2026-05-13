import { createContext, useContext, useMemo, useState } from 'react'
import { promediosDimensiones } from '../data/preguntas.js'

const DiagnosticoContext = createContext(null)

export function DiagnosticoProvider({ children }) {
  // Cuestionario: { d1_q1: '3', d1_q2: '4', ... }
  const [respuestas, setRespuestas] = useState({})
  // Muro de hallazgos
  const [hallazgos, setHallazgos] = useState([])
  // FODA + cruces
  const [foda, setFoda] = useState({ f: '', o: '', d: '', a: '' })
  const [cruces, setCruces] = useState({ fo: '', do: '', fa: '', da: '' })
  // Embudo de puntos críticos: [{ n, x, y }]
  const [puntos, setPuntos] = useState([])

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

  const value = {
    respuestas, setRespuesta,
    hallazgos, agregarHallazgo, borrarHallazgos,
    foda, setFodaCampo,
    cruces, setCruceCampo,
    puntos, agregarPunto, eliminarPunto, borrarTodosPuntos,
    promedios,
  }

  return <DiagnosticoContext.Provider value={value}>{children}</DiagnosticoContext.Provider>
}

export function useDiagnostico() {
  const ctx = useContext(DiagnosticoContext)
  if (!ctx) throw new Error('useDiagnostico debe usarse dentro de DiagnosticoProvider')
  return ctx
}
