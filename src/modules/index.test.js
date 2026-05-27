import { describe, it, expect } from 'vitest'
import { MODULOS, buscarModulo, buscarStep } from './index.js'

describe('registro de módulos', () => {
  it('expone módulo 1 y módulo 2 en orden', () => {
    expect(MODULOS.map((m) => m.id)).toEqual(['m1', 'm2'])
  })

  it('cada módulo declara id, label, subtitle, steps y exportSection', () => {
    MODULOS.forEach((m) => {
      expect(typeof m.id).toBe('string')
      expect(typeof m.label).toBe('string')
      expect(typeof m.subtitle).toBe('string')
      expect(Array.isArray(m.steps)).toBe(true)
      expect(m.steps.length).toBeGreaterThan(0)
      m.steps.forEach((s) => {
        expect(typeof s.id).toBe('string')
        expect(typeof s.label).toBe('string')
        expect(typeof s.Component).toBe('function')
      })
      expect(typeof m.exportSection).toBe('function')
    })
  })

  it('los ids de step son únicos dentro de cada módulo', () => {
    MODULOS.forEach((m) => {
      const ids = m.steps.map((s) => s.id)
      expect(new Set(ids).size).toBe(ids.length)
    })
  })

  it('buscarModulo cae al primer módulo si el id no existe', () => {
    expect(buscarModulo('inexistente').id).toBe('m1')
    expect(buscarModulo('m2').id).toBe('m2')
  })

  it('buscarStep cae al primer step del módulo si el id no existe', () => {
    expect(buscarStep('m2', 'inexistente').id).toBe('vision')
    expect(buscarStep('m2', 'smart').id).toBe('smart')
  })
})
