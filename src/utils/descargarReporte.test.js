import { describe, it, expect, beforeEach, vi } from 'vitest'
import { descargarReporte } from './descargarReporte.js'
import { modulo1 } from '../modules/modulo1/index.js'
import { modulo2 } from '../modules/modulo2/index.js'

const state = {
  promedios: { tec: 4.5, pro: 3, per: 2.25, cul: 1 },
  hallazgos: [
    { texto: 'Hallazgo A', bloque: 'Bloque 1: Exploración de Procesos' },
    { texto: 'Hallazgo B', bloque: 'Bloque 2: Experiencia Tecnológica' },
    { texto: 'Hallazgo C', bloque: 'Bloque 1: Exploración de Procesos' },
  ],
  foda: { f: 'F-text', o: 'O-text', d: 'D-text', a: 'A-text' },
  cruces: { fo: 'FO', do: 'DO', fa: 'FA', da: 'DA' },
  puntos: [
    { n: 'P1', x: 2, y: 4 },
    { n: 'P2', x: 5, y: 5 },
  ],
  modulo2: {
    vision: { dolores: '', expectativas: '', estadoFuturo: 'una cooperativa digital', habilitadores: 'datos + capacitación', proposito: 'mejorar la atención al socio', statement: 'Visión X', statementManual: false },
    iniciativas: [
      { id: 'a', nombre: 'QW-1', impacto: 5, esfuerzo: 2, descripcion: '' },
      { id: 'b', nombre: 'Est-1', impacto: 5, esfuerzo: 5, descripcion: '' },
    ],
    smart: { a: { especifico: 'X', medible: 'Y', alcanzable: 'Z', relevante: 'W', temporal: '30 días' } },
    gobernanza: { responsable: 'Juan Pérez', modeloLiderazgo: 'campeon', fechaRevision: '2026-09-30' },
  },
}

const callDescargar = (s = state, modulos = [modulo1, modulo2]) =>
  descargarReporte({ modulos, state: s })

describe('descargarReporte', () => {
  let blobCapturado
  let clickSpy

  beforeEach(() => {
    blobCapturado = null
    const OriginalBlob = global.Blob
    global.Blob = vi.fn((parts, opts) => {
      blobCapturado = { parts, opts, text: parts.join('') }
      return new OriginalBlob(parts, opts)
    })
    window.URL.createObjectURL = vi.fn(() => 'blob:fake')
    clickSpy = vi.spyOn(HTMLAnchorElement.prototype, 'click').mockImplementation(() => {})
  })

  it('genera blob de tipo text/plain con encabezado del reporte', () => {
    callDescargar()
    expect(global.Blob).toHaveBeenCalledTimes(1)
    expect(blobCapturado.opts).toEqual({ type: 'text/plain' })
    expect(blobCapturado.text).toContain('REPORTE DE DIAGNÓSTICO DIGITAL')
    expect(blobCapturado.text).toContain('MÓDULO 1 — DIAGNÓSTICO DIGITAL')
  })

  it('formatea los promedios con 2 decimales', () => {
    callDescargar()
    expect(blobCapturado.text).toContain('- Tecnología: 4.50')
    expect(blobCapturado.text).toContain('- Procesos: 3.00')
    expect(blobCapturado.text).toContain('- Personas: 2.25')
    expect(blobCapturado.text).toContain('- Cultura: 1.00')
  })

  it('incluye hallazgos agrupados por bloque, FODA, cruces y puntos críticos', () => {
    callDescargar()
    const t = blobCapturado.text
    expect(t).toContain('[Bloque 1: Exploración de Procesos]')
    expect(t).toContain('[Bloque 2: Experiencia Tecnológica]')
    expect(t).toContain('- Hallazgo A')
    expect(t).toContain('- Hallazgo B')
    expect(t).toContain('- Hallazgo C')
    const idxA = t.indexOf('- Hallazgo A')
    const idxC = t.indexOf('- Hallazgo C')
    const idxB = t.indexOf('- Hallazgo B')
    expect(idxA).toBeLessThan(idxC)
    expect(idxC).toBeLessThan(idxB)
    expect(t).toContain('- Fortalezas: F-text')
    expect(t).toContain('- Oportunidades: O-text')
    expect(t).toContain('- Puntos Críticos (D+A): DA')
    expect(t).toContain('- P1 (Esfuerzo: 2, Impacto: 4)')
    expect(t).toContain('- P2 (Esfuerzo: 5, Impacto: 5)')
  })

  it('soporta hallazgos como strings (compatibilidad hacia atrás)', () => {
    callDescargar({ ...state, hallazgos: ['Sin bloque uno', 'Sin bloque dos'] })
    const t = blobCapturado.text
    expect(t).toContain('[(Sin bloque)]')
    expect(t).toContain('- Sin bloque uno')
    expect(t).toContain('- Sin bloque dos')
  })

  it('dispara click sobre el anchor para iniciar la descarga', () => {
    callDescargar()
    expect(clickSpy).toHaveBeenCalledTimes(1)
  })

  it('tolera arrays vacíos sin romper', () => {
    expect(() =>
      callDescargar({
        promedios: { tec: 1, pro: 1, per: 1, cul: 1 },
        hallazgos: [],
        foda: { f: '', o: '', d: '', a: '' },
        cruces: { fo: '', do: '', fa: '', da: '' },
        puntos: [],
        modulo2: {
          vision: { dolores: '', expectativas: '', estadoFuturo: '', habilitadores: '', proposito: '', statement: '', statementManual: false },
          iniciativas: [],
          smart: {},
          gobernanza: { responsable: '', modeloLiderazgo: '', fechaRevision: '' },
        },
      }),
    ).not.toThrow()
  })

  it('incluye la sección de Módulo 2 con visión, iniciativas, SMART y gobernanza', () => {
    callDescargar()
    const t = blobCapturado.text
    expect(t).toContain('MÓDULO 2 — ESTRATEGIA DIGITAL')
    expect(t).toContain('Statement consolidado')
    expect(t).toContain('Visión X')
    expect(t).toContain('[Quick Win]')
    expect(t).toContain('- QW-1 (Impacto: 5, Esfuerzo: 2)')
    expect(t).toContain('[Proyecto Estratégico]')
    expect(t).toContain('- Est-1 (Impacto: 5, Esfuerzo: 5)')
    expect(t).toContain('* QW-1')
    expect(t).toContain('- Responsable: Juan Pérez')
    expect(t).toContain('- Modelo de liderazgo: Gestor/Campeón Digital')
    expect(t).toContain('- Primera revisión trimestral: 2026-09-30')
  })

  it('respeta el orden de los módulos en la salida', () => {
    callDescargar()
    const t = blobCapturado.text
    expect(t.indexOf('MÓDULO 1')).toBeLessThan(t.indexOf('MÓDULO 2'))
  })
})
