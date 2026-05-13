import { useEffect, useMemo, useRef, useState } from 'react'
import { useDiagnostico } from '../state/DiagnosticoContext.jsx'
import { BLOQUES, buscarBloquePorTitulo } from '../data/bloques.js'

function ComboboxBloque({ value, onChange }) {
  const [query, setQuery] = useState(value || '')
  const [open, setOpen] = useState(false)
  const [highlight, setHighlight] = useState(0)
  const containerRef = useRef(null)

  useEffect(() => { setQuery(value || '') }, [value])

  useEffect(() => {
    function handler(e) {
      if (!containerRef.current?.contains(e.target)) setOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q || q === (value || '').toLowerCase()) return BLOQUES
    return BLOQUES.filter((b) => b.titulo.toLowerCase().includes(q))
  }, [query, value])

  const select = (bloque) => {
    onChange(bloque.titulo)
    setQuery(bloque.titulo)
    setOpen(false)
  }

  return (
    <div ref={containerRef} className="relative w-72 shrink-0">
      <input
        type="text"
        value={query}
        role="combobox"
        aria-expanded={open}
        aria-autocomplete="list"
        aria-label="Bloque"
        placeholder="Seleccione un bloque..."
        className="w-full border-2 border-slate-200 p-4 text-base outline-emerald-500"
        onChange={(e) => {
          setQuery(e.target.value)
          setOpen(true)
          setHighlight(0)
          if (value) onChange('')
        }}
        onFocus={() => setOpen(true)}
        onKeyDown={(e) => {
          if (e.key === 'ArrowDown') {
            e.preventDefault(); setOpen(true)
            setHighlight((h) => Math.min(h + 1, filtered.length - 1))
          } else if (e.key === 'ArrowUp') {
            e.preventDefault()
            setHighlight((h) => Math.max(h - 1, 0))
          } else if (e.key === 'Enter' && open && filtered[highlight]) {
            e.preventDefault(); select(filtered[highlight])
          } else if (e.key === 'Escape') {
            setOpen(false)
          }
        }}
      />
      {open && filtered.length > 0 && (
        <ul role="listbox" className="absolute z-20 mt-1 w-full bg-white border-2 border-slate-200 shadow-lg max-h-60 overflow-auto">
          {filtered.map((b, i) => (
            <li
              key={b.id}
              role="option"
              aria-selected={i === highlight}
              onMouseDown={(e) => { e.preventDefault(); select(b) }}
              onMouseEnter={() => setHighlight(i)}
              className={`p-3 cursor-pointer ${i === highlight ? 'bg-emerald-50' : ''} ${b.color} font-bold text-sm`}
            >
              {b.titulo}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

export default function TabAnalisis() {
  const { hallazgos, agregarHallazgo } = useDiagnostico()
  const [texto, setTexto] = useState('')
  const [bloque, setBloque] = useState('')

  const puedeAgregar = texto.trim().length > 0 && bloque.length > 0

  const onAgregar = () => {
    if (!puedeAgregar) return
    agregarHallazgo(texto, bloque)
    setTexto('')
  }

  const hallazgosPorBloque = useMemo(() => {
    const map = new Map()
    BLOQUES.forEach((b) => map.set(b.titulo, []))
    hallazgos.forEach((h) => {
      const key = h.bloque || '(Sin bloque)'
      if (!map.has(key)) map.set(key, [])
      map.get(key).push(h)
    })
    return Array.from(map.entries()).filter(([, lista]) => lista.length > 0)
  }, [hallazgos])

  return (
    <div className="bg-white p-10 shadow-md border border-slate-200">
      <h3 className="text-2xl font-bold text-emerald-800 mb-4">Guía de Análisis Cualitativo</h3>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        <div className="space-y-8">
          {BLOQUES.map((b) => (
            <div key={b.id} className="bg-slate-50 p-6 border border-slate-200">
              <h3 className={`font-bold text-lg mb-4 ${b.color}`}>{b.titulo}</h3>
              <ul className="space-y-4 text-base text-slate-700 list-disc ml-6">
                {b.items.map((q, j) => <li key={j}>{q}</li>)}
              </ul>
            </div>
          ))}
        </div>

        <div className="bg-white">
          <h3 className="font-black text-slate-800 uppercase mb-6 text-sm tracking-widest">Muro de Hallazgos</h3>
          <div className="flex flex-col md:flex-row gap-4 mb-8">
            <ComboboxBloque value={bloque} onChange={setBloque} />
            <input
              type="text"
              value={texto}
              onChange={(e) => setTexto(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && onAgregar()}
              placeholder="Registre la respuesta de la entrevista..."
              className="flex-1 border-2 border-slate-200 p-4 text-base outline-emerald-500"
            />
            <button
              type="button"
              onClick={onAgregar}
              disabled={!puedeAgregar}
              className="bg-emerald-600 text-white px-8 py-4 font-bold hover:bg-emerald-700 transition shadow-md disabled:bg-slate-300 disabled:cursor-not-allowed"
            >Añadir</button>
          </div>
          <div className="space-y-6 overflow-y-auto max-h-[500px] pr-2">
            {hallazgosPorBloque.map(([titulo, lista]) => {
              const b = buscarBloquePorTitulo(titulo)
              const accent = b?.accent || 'border-slate-400 bg-slate-50'
              return (
                <section key={titulo} aria-label={titulo}>
                  <h4 className={`font-bold uppercase tracking-wider text-sm mb-3 ${b?.color || 'text-slate-700'}`}>{titulo}</h4>
                  <div className="space-y-3">
                    {lista.map((h, i) => (
                      <div key={i} className={`p-4 border-l-8 shadow-sm ${accent}`}>
                        <p className="italic text-slate-700">"{h.texto}"</p>
                      </div>
                    ))}
                  </div>
                </section>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}
