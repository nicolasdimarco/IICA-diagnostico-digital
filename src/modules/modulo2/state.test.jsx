import { describe, it, expect } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { DiagnosticoProvider, useDiagnostico } from '../../state/DiagnosticoContext.jsx'
import { generarStatementVision } from './state.js'

const wrapper = ({ children }) => <DiagnosticoProvider>{children}</DiagnosticoProvider>

describe('modulo2 state slice', () => {
  it('inicializa con visión vacía, sin iniciativas, smart vacío y gobernanza vacía', () => {
    const { result } = renderHook(() => useDiagnostico(), { wrapper })
    const m2 = result.current.modulo2
    expect(m2.vision.dolores).toBe('')
    expect(m2.vision.statementManual).toBe(false)
    expect(m2.iniciativas).toEqual([])
    expect(m2.smart).toEqual({})
    expect(m2.gobernanza).toEqual({ responsable: '', modeloLiderazgo: '', fechaRevision: '' })
  })

  it('setVisionCampo regenera el statement automáticamente con los 3 bloques estratégicos', () => {
    const { result } = renderHook(() => useDiagnostico(), { wrapper })
    act(() => {
      result.current.modulo2.setVisionCampo('estadoFuturo', 'una cooperativa digital')
      result.current.modulo2.setVisionCampo('habilitadores', 'datos + capacitación')
      result.current.modulo2.setVisionCampo('proposito', 'mejorar atención')
    })
    const { statement, statementManual } = result.current.modulo2.vision
    expect(statementManual).toBe(false)
    expect(statement).toContain('una cooperativa digital')
    expect(statement).toContain('datos + capacitación')
    expect(statement).toContain('mejorar atención')
  })

  it('editar el statement manualmente congela la auto-generación', () => {
    const { result } = renderHook(() => useDiagnostico(), { wrapper })
    act(() => {
      result.current.modulo2.setVisionCampo('estadoFuturo', 'EF inicial')
      result.current.modulo2.setVisionCampo('statement', 'Mi statement manual')
    })
    expect(result.current.modulo2.vision.statementManual).toBe(true)
    expect(result.current.modulo2.vision.statement).toBe('Mi statement manual')

    act(() => { result.current.modulo2.setVisionCampo('estadoFuturo', 'cambio posterior') })
    expect(result.current.modulo2.vision.statement).toBe('Mi statement manual')
  })

  it('resetVisionStatement vuelve a la auto-generación', () => {
    const { result } = renderHook(() => useDiagnostico(), { wrapper })
    act(() => {
      result.current.modulo2.setVisionCampo('estadoFuturo', 'EF auto')
      result.current.modulo2.setVisionCampo('statement', 'manual')
    })
    expect(result.current.modulo2.vision.statementManual).toBe(true)
    act(() => { result.current.modulo2.resetVisionStatement() })
    expect(result.current.modulo2.vision.statementManual).toBe(false)
    expect(result.current.modulo2.vision.statement).toContain('EF auto')
  })

  it('agregarIniciativa ignora nombres vacíos y normaliza impacto/esfuerzo', () => {
    const { result } = renderHook(() => useDiagnostico(), { wrapper })
    act(() => {
      result.current.modulo2.agregarIniciativa({ nombre: '   ', impacto: 5, esfuerzo: 1 })
      result.current.modulo2.agregarIniciativa({ nombre: 'A', impacto: '4', esfuerzo: '2', descripcion: '  desc  ' })
    })
    expect(result.current.modulo2.iniciativas).toHaveLength(1)
    expect(result.current.modulo2.iniciativas[0]).toMatchObject({ nombre: 'A', impacto: 4, esfuerzo: 2, descripcion: 'desc' })
  })

  it('eliminarIniciativa también limpia su entrada SMART asociada', () => {
    const { result } = renderHook(() => useDiagnostico(), { wrapper })
    act(() => { result.current.modulo2.agregarIniciativa({ nombre: 'A', impacto: 5, esfuerzo: 2 }) })
    const id = result.current.modulo2.iniciativas[0].id
    act(() => { result.current.modulo2.setSmartCampo(id, 'especifico', 'X') })
    expect(result.current.modulo2.smart[id]).toEqual({ especifico: 'X' })
    act(() => { result.current.modulo2.eliminarIniciativa(id) })
    expect(result.current.modulo2.iniciativas).toEqual([])
    expect(result.current.modulo2.smart[id]).toBeUndefined()
  })

  it('setGobernanzaCampo actualiza solo la clave indicada', () => {
    const { result } = renderHook(() => useDiagnostico(), { wrapper })
    act(() => {
      result.current.modulo2.setGobernanzaCampo('responsable', 'Ana')
      result.current.modulo2.setGobernanzaCampo('modeloLiderazgo', 'comite')
    })
    expect(result.current.modulo2.gobernanza).toEqual({ responsable: 'Ana', modeloLiderazgo: 'comite', fechaRevision: '' })
  })
})

describe('generarStatementVision', () => {
  it('devuelve string vacío si no hay datos estratégicos', () => {
    expect(generarStatementVision({})).toBe('')
  })

  it('arma la frase con los 3 bloques estratégicos', () => {
    const out = generarStatementVision({ estadoFuturo: 'EF', habilitadores: 'HB', proposito: 'PR' })
    expect(out).toContain('Nos proyectamos hacia EF')
    expect(out).toContain('apoyándonos en HB')
    expect(out).toContain('para PR')
    expect(out.endsWith('.')).toBe(true)
  })
})
