import { describe, it, expect } from 'vitest'
import { MODULOS } from './index.js'
import { calcularProgreso } from './progress.js'
import {
  progressNiveles, progressAnalisis, progressFoda, progressEmbudo,
} from './modulo1/progress.js'
import {
  progressVision, progressMatriz, progressSmart, progressGobernanza,
} from './modulo2/progress.js'

const emptyM2 = {
  vision: { dolores: '', expectativas: '', estadoFuturo: '', habilitadores: '', proposito: '', statement: '', statementManual: false },
  iniciativas: [],
  smart: {},
  gobernanza: { responsable: '', modeloLiderazgo: '', fechaRevision: '' },
}

const emptyState = {
  respuestas: {},
  hallazgos: [],
  foda: { f: '', o: '', d: '', a: '' },
  cruces: { fo: '', do: '', fa: '', da: '' },
  puntos: [],
  modulo2: emptyM2,
}

describe('progressNiveles', () => {
  it('arranca en 0/13 con respuestas vacías (d1_q4 oculto por dependsOn)', () => {
    expect(progressNiveles(emptyState)).toEqual({ filled: 0, total: 13 })
  })

  it('cuenta sólo las preguntas con respuesta válida', () => {
    const state = { respuestas: { d1_q1: '3', d2_q2: '0' } }
    // d2_q2 = '0' es respuesta válida (no vacía)
    expect(progressNiveles(state)).toEqual({ filled: 2, total: 13 })
  })

  it('activa d1_q4 al total cuando d1_q3 >= 1', () => {
    const state = { respuestas: { d1_q3: '2' } }
    const r = progressNiveles(state)
    expect(r.total).toBe(14)
    expect(r.filled).toBe(1)
  })
})

describe('progressAnalisis', () => {
  it('cuenta bloques con al menos 1 hallazgo', () => {
    const state = { hallazgos: [
      { texto: 'a', bloque: 'Bloque 1: Exploración de Procesos' },
      { texto: 'b', bloque: 'Bloque 1: Exploración de Procesos' },
      { texto: 'c', bloque: 'Bloque 3: Visión de Futuro y Cultura' },
    ] }
    expect(progressAnalisis(state)).toEqual({ filled: 2, total: 3 })
  })

  it('total siempre 3 incluso sin hallazgos', () => {
    expect(progressAnalisis({ hallazgos: [] })).toEqual({ filled: 0, total: 3 })
  })
})

describe('progressFoda', () => {
  it('cuenta 8 campos entre foda y cruces', () => {
    const state = {
      foda: { f: 'x', o: '', d: ' ', a: 'y' },
      cruces: { fo: 'z', do: '', fa: '', da: '' },
    }
    expect(progressFoda(state)).toEqual({ filled: 3, total: 8 })
  })
})

describe('progressEmbudo', () => {
  it('0/1 sin puntos, 1/1 con al menos uno', () => {
    expect(progressEmbudo({ puntos: [] })).toEqual({ filled: 0, total: 1 })
    expect(progressEmbudo({ puntos: [{ n: '1', x: 5, y: 5 }] })).toEqual({ filled: 1, total: 1 })
  })
})

describe('progressVision (m2)', () => {
  it('5 campos de entrada (el statement no cuenta)', () => {
    const state = { modulo2: { ...emptyM2, vision: { ...emptyM2.vision, dolores: 'X', proposito: 'Y' } } }
    expect(progressVision(state)).toEqual({ filled: 2, total: 5 })
  })
})

describe('progressMatriz (m2)', () => {
  it('0/1 sin iniciativas, 1/1 con al menos una', () => {
    expect(progressMatriz({ modulo2: emptyM2 })).toEqual({ filled: 0, total: 1 })
    const con = { modulo2: { ...emptyM2, iniciativas: [{ id: 'a', impacto: 5, esfuerzo: 2 }] } }
    expect(progressMatriz(con)).toEqual({ filled: 1, total: 1 })
  })
})

describe('progressSmart (m2)', () => {
  it('total = 0 cuando no hay quick wins (no aporta al cómputo)', () => {
    expect(progressSmart({ modulo2: emptyM2 })).toEqual({ filled: 0, total: 0 })
    const noQw = { modulo2: { ...emptyM2, iniciativas: [{ id: 'a', impacto: 5, esfuerzo: 5 }] } }
    expect(progressSmart(noQw)).toEqual({ filled: 0, total: 0 })
  })

  it('5 campos por cada quick win', () => {
    const state = {
      modulo2: {
        ...emptyM2,
        iniciativas: [{ id: 'a', impacto: 5, esfuerzo: 2 }, { id: 'b', impacto: 4, esfuerzo: 1 }],
        smart: { a: { especifico: 'X', medible: 'Y' } },
      },
    }
    expect(progressSmart(state)).toEqual({ filled: 2, total: 10 })
  })
})

describe('progressGobernanza (m2)', () => {
  it('3 campos', () => {
    const state = { modulo2: { ...emptyM2, gobernanza: { responsable: 'Ana', modeloLiderazgo: '', fechaRevision: '2026-09-30' } } }
    expect(progressGobernanza(state)).toEqual({ filled: 2, total: 3 })
  })
})

describe('calcularProgreso (aggregator)', () => {
  it('percent = 0 con estado vacío', () => {
    const r = calcularProgreso(MODULOS, emptyState)
    expect(r.percent).toBe(0)
    expect(r.filled).toBe(0)
    // M1: 13 (niveles) + 3 (analisis) + 8 (foda) + 1 (embudo) = 25
    // M2: 5 (vision) + 1 (matriz) + 0 (smart, sin qw) + 3 (gobernanza) = 9
    expect(r.total).toBe(34)
  })

  it('percent crece a medida que se completan respuestas', () => {
    const state = {
      ...emptyState,
      respuestas: { d1_q1: '3', d1_q2: '4' },
      hallazgos: [{ texto: 'a', bloque: 'Bloque 1: Exploración de Procesos' }],
      foda: { f: 'x', o: '', d: '', a: '' },
    }
    const r = calcularProgreso(MODULOS, state)
    expect(r.filled).toBe(2 + 1 + 1)
    expect(r.total).toBe(34)
    expect(r.percent).toBe(Math.round((4 / 34) * 100))
  })

  it('clampa filled a total por step para evitar > 100%', () => {
    const fake = [{ steps: [{ progress: () => ({ filled: 50, total: 10 }) }] }]
    expect(calcularProgreso(fake, {}).percent).toBe(100)
  })

  it('ignora steps sin progress o con total <= 0', () => {
    const fake = [{ steps: [
      { /* sin progress */ },
      { progress: () => ({ filled: 0, total: 0 }) },
      { progress: () => ({ filled: 2, total: 4 }) },
    ] }]
    expect(calcularProgreso(fake, {})).toEqual({ filled: 2, total: 4, percent: 50 })
  })
})
