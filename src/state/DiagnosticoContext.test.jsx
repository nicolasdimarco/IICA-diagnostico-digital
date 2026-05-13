import { describe, it, expect } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { DiagnosticoProvider, useDiagnostico } from './DiagnosticoContext.jsx'

const wrapper = ({ children }) => <DiagnosticoProvider>{children}</DiagnosticoProvider>

describe('DiagnosticoContext', () => {
  it('inicializa con estado vacío y promedios en 1', () => {
    const { result } = renderHook(() => useDiagnostico(), { wrapper })
    expect(result.current.respuestas).toEqual({})
    expect(result.current.hallazgos).toEqual([])
    expect(result.current.foda).toEqual({ f: '', o: '', d: '', a: '' })
    expect(result.current.puntos).toEqual([])
    expect(result.current.promedios).toEqual({ tec: 1, pro: 1, per: 1, cul: 1 })
  })

  it('setRespuesta actualiza los promedios reactivamente', () => {
    const { result } = renderHook(() => useDiagnostico(), { wrapper })
    act(() => {
      result.current.setRespuesta('d2_q1', '5')
      result.current.setRespuesta('d2_q2', '5')
      result.current.setRespuesta('d2_q3', '5')
    })
    expect(result.current.promedios.pro).toBe(5)
  })

  it('al bajar d1_q3 por debajo de 1, limpia d1_q4', () => {
    const { result } = renderHook(() => useDiagnostico(), { wrapper })
    act(() => {
      result.current.setRespuesta('d1_q3', '3')
      result.current.setRespuesta('d1_q4', '4')
    })
    expect(result.current.respuestas.d1_q4).toBe('4')
    act(() => { result.current.setRespuesta('d1_q3', '0') })
    expect(result.current.respuestas.d1_q4).toBeUndefined()
  })

  it('agregarHallazgo descarta entradas vacías y agrega al principio con su bloque', () => {
    const { result } = renderHook(() => useDiagnostico(), { wrapper })
    act(() => { result.current.agregarHallazgo('   ', 'Bloque 1') })
    expect(result.current.hallazgos).toEqual([])
    act(() => {
      result.current.agregarHallazgo('uno', 'Bloque 1: Exploración de Procesos')
      result.current.agregarHallazgo('dos', 'Bloque 2: Experiencia Tecnológica')
    })
    expect(result.current.hallazgos).toEqual([
      { texto: 'dos', bloque: 'Bloque 2: Experiencia Tecnológica' },
      { texto: 'uno', bloque: 'Bloque 1: Exploración de Procesos' },
    ])
  })

  it('agregarHallazgo sin bloque guarda bloque vacío', () => {
    const { result } = renderHook(() => useDiagnostico(), { wrapper })
    act(() => { result.current.agregarHallazgo('libre') })
    expect(result.current.hallazgos).toEqual([{ texto: 'libre', bloque: '' }])
  })

  it('borrarHallazgos vacía la lista', () => {
    const { result } = renderHook(() => useDiagnostico(), { wrapper })
    act(() => {
      result.current.agregarHallazgo('x', 'b')
      result.current.borrarHallazgos()
    })
    expect(result.current.hallazgos).toEqual([])
  })

  it('setFodaCampo y setCruceCampo actualizan sólo la clave indicada', () => {
    const { result } = renderHook(() => useDiagnostico(), { wrapper })
    act(() => {
      result.current.setFodaCampo('f', 'Fortaleza X')
      result.current.setCruceCampo('da', 'Punto crítico Y')
    })
    expect(result.current.foda).toEqual({ f: 'Fortaleza X', o: '', d: '', a: '' })
    expect(result.current.cruces.da).toBe('Punto crítico Y')
  })

  it('agregar/eliminar/borrar puntos del embudo', () => {
    const { result } = renderHook(() => useDiagnostico(), { wrapper })
    act(() => {
      result.current.agregarPunto({ n: 'A', x: 1, y: 2 })
      result.current.agregarPunto({ n: 'B', x: 3, y: 4 })
    })
    expect(result.current.puntos).toHaveLength(2)
    act(() => { result.current.eliminarPunto(0) })
    expect(result.current.puntos).toEqual([{ n: 'B', x: 3, y: 4 }])
    act(() => { result.current.borrarTodosPuntos() })
    expect(result.current.puntos).toEqual([])
  })
})
