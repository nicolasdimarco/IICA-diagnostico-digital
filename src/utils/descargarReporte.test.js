import { describe, it, expect, beforeEach, vi } from 'vitest'
import { descargarReporte } from './descargarReporte.js'

const datos = {
  promedios: { tec: 4.5, pro: 3, per: 2.25, cul: 1 },
  hallazgos: ['Hallazgo A', 'Hallazgo B'],
  foda: { f: 'F-text', o: 'O-text', d: 'D-text', a: 'A-text' },
  cruces: { fo: 'FO', do: 'DO', fa: 'FA', da: 'DA' },
  puntos: [
    { n: 'P1', x: 2, y: 4 },
    { n: 'P2', x: 5, y: 5 },
  ],
}

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
    descargarReporte(datos)
    expect(global.Blob).toHaveBeenCalledTimes(1)
    expect(blobCapturado.opts).toEqual({ type: 'text/plain' })
    expect(blobCapturado.text).toContain('REPORTE DE DIAGNÓSTICO DIGITAL - MÓDULO 1')
  })

  it('formatea los promedios con 2 decimales', () => {
    descargarReporte(datos)
    expect(blobCapturado.text).toContain('- Tecnología: 4.50')
    expect(blobCapturado.text).toContain('- Procesos: 3.00')
    expect(blobCapturado.text).toContain('- Personas: 2.25')
    expect(blobCapturado.text).toContain('- Cultura: 1.00')
  })

  it('incluye hallazgos, FODA, cruces y puntos críticos', () => {
    descargarReporte(datos)
    const t = blobCapturado.text
    expect(t).toContain('- Hallazgo A')
    expect(t).toContain('- Hallazgo B')
    expect(t).toContain('- Fortalezas: F-text')
    expect(t).toContain('- Oportunidades: O-text')
    expect(t).toContain('- Puntos Críticos (D+A): DA')
    expect(t).toContain('- P1 (Esfuerzo: 2, Impacto: 4)')
    expect(t).toContain('- P2 (Esfuerzo: 5, Impacto: 5)')
  })

  it('dispara click sobre el anchor para iniciar la descarga', () => {
    descargarReporte(datos)
    expect(clickSpy).toHaveBeenCalledTimes(1)
  })

  it('tolera arrays vacíos sin romper', () => {
    expect(() =>
      descargarReporte({
        promedios: { tec: 1, pro: 1, per: 1, cul: 1 },
        hallazgos: [],
        foda: { f: '', o: '', d: '', a: '' },
        cruces: { fo: '', do: '', fa: '', da: '' },
        puntos: [],
      }),
    ).not.toThrow()
  })
})
