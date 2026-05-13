import { describe, it, expect } from 'vitest'
import { calcularPromedio, promediosDimensiones, DIMENSIONES } from './preguntas.js'

describe('calcularPromedio', () => {
  it('devuelve 1 cuando no hay respuestas válidas', () => {
    expect(calcularPromedio({}, ['d1_q1', 'd1_q2'])).toBe(1)
  })

  it('ignora valores undefined, null y string vacío', () => {
    const resp = { d1_q1: '4', d1_q2: '', d1_q3: undefined, d1_q4: null }
    expect(calcularPromedio(resp, ['d1_q1', 'd1_q2', 'd1_q3', 'd1_q4'])).toBe(4)
  })

  it('parsea valores string a int y promedia', () => {
    const resp = { d1_q1: '2', d1_q2: '4' }
    expect(calcularPromedio(resp, ['d1_q1', 'd1_q2'])).toBe(3)
  })

  it('promedia el 0 como respuesta válida', () => {
    const resp = { d1_q1: '0', d1_q2: '4' }
    expect(calcularPromedio(resp, ['d1_q1', 'd1_q2'])).toBe(2)
  })
})

describe('promediosDimensiones', () => {
  it('expone las 4 claves de dimensión', () => {
    const out = promediosDimensiones({})
    expect(Object.keys(out).sort()).toEqual(['cul', 'per', 'pro', 'tec'])
  })

  it('devuelve 1 en todas las dimensiones sin respuestas', () => {
    const out = promediosDimensiones({})
    expect(out).toEqual({ tec: 1, pro: 1, per: 1, cul: 1 })
  })

  it('calcula correctamente con respuestas completas', () => {
    const resp = {
      d1_q1: '5', d1_q2: '5', d1_q3: '5', d1_q4: '5',
      d2_q1: '2', d2_q2: '4', d2_q3: '3',
      d3_q1: '1', d3_q2: '1', d3_q3: '1',
      d4_q1: '0', d4_q2: '0', d4_q3: '0', d4_q4: '0',
    }
    const out = promediosDimensiones(resp)
    expect(out.tec).toBe(5)
    expect(out.pro).toBe(3)
    expect(out.per).toBe(1)
    expect(out.cul).toBe(0)
  })

  it('excluye d1_q4 del promedio si d1_q3 < 1 (dependsOn no satisfecho)', () => {
    const resp = { d1_q1: '2', d1_q2: '2', d1_q3: '0', d1_q4: '5' }
    // d1_q4 no debe contar; promedio = (2+2+0)/3
    expect(promediosDimensiones(resp).tec).toBeCloseTo(4 / 3)
  })

  it('incluye d1_q4 cuando d1_q3 >= 1', () => {
    const resp = { d1_q1: '2', d1_q2: '2', d1_q3: '1', d1_q4: '5' }
    expect(promediosDimensiones(resp).tec).toBeCloseTo((2 + 2 + 1 + 5) / 4)
  })

  it('excluye d1_q4 cuando d1_q3 no existe', () => {
    const resp = { d1_q1: '3', d1_q2: '3', d1_q4: '5' }
    expect(promediosDimensiones(resp).tec).toBe(3)
  })
})

describe('DIMENSIONES (estructura)', () => {
  it('contiene exactamente 4 dimensiones con ids únicos', () => {
    expect(DIMENSIONES).toHaveLength(4)
    const ids = DIMENSIONES.map((d) => d.promedioId)
    expect(new Set(ids).size).toBe(4)
  })

  it('cada pregunta tiene un id único en el conjunto', () => {
    const allIds = DIMENSIONES.flatMap((d) => d.preguntas.map((p) => p.id))
    expect(new Set(allIds).size).toBe(allIds.length)
  })
})
