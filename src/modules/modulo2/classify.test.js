import { describe, it, expect } from 'vitest'
import { clasificarIniciativa, iniciativasPorTipo, generarStatementSmart } from './classify.js'

describe('clasificarIniciativa', () => {
  it('alto impacto + bajo esfuerzo => quick_win', () => {
    expect(clasificarIniciativa({ impacto: 5, esfuerzo: 1 }).id).toBe('quick_win')
    expect(clasificarIniciativa({ impacto: 4, esfuerzo: 3 }).id).toBe('quick_win')
  })

  it('alto impacto + alto esfuerzo => estrategico', () => {
    expect(clasificarIniciativa({ impacto: 5, esfuerzo: 5 }).id).toBe('estrategico')
    expect(clasificarIniciativa({ impacto: 4, esfuerzo: 4 }).id).toBe('estrategico')
  })

  it('bajo impacto + bajo esfuerzo => menor', () => {
    expect(clasificarIniciativa({ impacto: 3, esfuerzo: 1 }).id).toBe('menor')
    expect(clasificarIniciativa({ impacto: 1, esfuerzo: 3 }).id).toBe('menor')
  })

  it('bajo impacto + alto esfuerzo => evitar', () => {
    expect(clasificarIniciativa({ impacto: 2, esfuerzo: 5 }).id).toBe('evitar')
    expect(clasificarIniciativa({ impacto: 3, esfuerzo: 4 }).id).toBe('evitar')
  })

  it('tolera valores como string (vienen de inputs HTML)', () => {
    expect(clasificarIniciativa({ impacto: '5', esfuerzo: '2' }).id).toBe('quick_win')
  })
})

describe('iniciativasPorTipo', () => {
  const items = [
    { id: 'a', impacto: 5, esfuerzo: 2 }, // quick_win
    { id: 'b', impacto: 5, esfuerzo: 5 }, // estrategico
    { id: 'c', impacto: 4, esfuerzo: 1 }, // quick_win
    { id: 'd', impacto: 2, esfuerzo: 2 }, // menor
  ]

  it('filtra correctamente por tipo', () => {
    expect(iniciativasPorTipo(items, 'quick_win').map((x) => x.id)).toEqual(['a', 'c'])
    expect(iniciativasPorTipo(items, 'estrategico').map((x) => x.id)).toEqual(['b'])
    expect(iniciativasPorTipo(items, 'menor').map((x) => x.id)).toEqual(['d'])
    expect(iniciativasPorTipo(items, 'evitar')).toEqual([])
  })
})

describe('generarStatementSmart', () => {
  it('devuelve string vacío si no hay datos', () => {
    expect(generarStatementSmart(null)).toBe('')
    expect(generarStatementSmart({})).toBe('')
  })

  it('compone el statement con los 5 campos', () => {
    const out = generarStatementSmart({
      especifico: 'Implementar canal WhatsApp',
      medible: '80% socios activos',
      alcanzable: 'plantilla de respuestas',
      relevante: 'descomprimir atención',
      temporal: '60 días',
    })
    expect(out).toContain('Implementar canal WhatsApp')
    expect(out).toContain('medido por 80% socios activos')
    expect(out).toContain('apalancando plantilla de respuestas')
    expect(out).toContain('con el fin de descomprimir atención')
    expect(out).toContain('en 60 días')
    expect(out.endsWith('.')).toBe(true)
  })

  it('omite campos vacíos sin generar separadores huérfanos', () => {
    const out = generarStatementSmart({ especifico: 'X', temporal: 'Q1' })
    expect(out).toBe('X, en Q1.')
  })
})
