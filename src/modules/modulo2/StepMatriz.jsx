import { useMemo, useState } from 'react'
import { useDiagnostico } from '../../state/DiagnosticoContext.jsx'
import { clasificarIniciativa, TIPOS_INICIATIVA } from './classify.js'

const CUADRANTES = [
  { tipo: 'quick_win',   pos: 'top-left',     subtitulo: 'Alto impacto · Bajo esfuerzo' },
  { tipo: 'estrategico', pos: 'top-right',    subtitulo: 'Alto impacto · Alto esfuerzo' },
  { tipo: 'menor',       pos: 'bottom-left',  subtitulo: 'Bajo impacto · Bajo esfuerzo' },
  { tipo: 'evitar',      pos: 'bottom-right', subtitulo: 'Bajo impacto · Alto esfuerzo' },
]

const TONE = {
  emerald: { bg: 'bg-emerald-50', border: 'border-emerald-400', text: 'text-emerald-800', chip: 'bg-emerald-600' },
  blue:    { bg: 'bg-blue-50',    border: 'border-blue-400',    text: 'text-blue-800',    chip: 'bg-blue-600' },
  amber:   { bg: 'bg-amber-50',   border: 'border-amber-400',   text: 'text-amber-800',   chip: 'bg-amber-600' },
  rose:    { bg: 'bg-rose-50',    border: 'border-rose-400',    text: 'text-rose-800',    chip: 'bg-rose-600' },
}

function CuadranteCard({ cuadrante, items, onEdit, onDelete }) {
  const tipo = TIPOS_INICIATIVA[cuadrante.tipo]
  const t = TONE[tipo.color]
  return (
    <div className={`${t.bg} border-2 ${t.border} p-3 sm:p-4 min-h-[160px] flex flex-col`}>
      <div className="flex justify-between items-baseline gap-2 mb-3">
        <h3 className={`font-black uppercase text-sm sm:text-base ${t.text}`}>{tipo.label}</h3>
        <span className="text-xs text-slate-500">{items.length}</span>
      </div>
      <p className="text-xs text-slate-600 italic mb-3">{cuadrante.subtitulo}</p>
      <div className="space-y-2 flex-1">
        {items.length === 0 ? (
          <p className="text-xs text-slate-400 italic">Sin iniciativas en este cuadrante.</p>
        ) : items.map((it) => (
          <div key={it.id} className="bg-white border border-slate-200 p-3 shadow-sm">
            <div className="flex justify-between items-start gap-2">
              <p className="font-bold text-slate-800 text-sm flex-1 min-w-0 break-words">{it.nombre}</p>
              <div className="flex gap-1 shrink-0">
                <button type="button" onClick={() => onEdit(it)} aria-label={`Editar ${it.nombre}`} title="Editar" className="text-blue-600 hover:bg-blue-50 w-9 h-9 flex items-center justify-center border border-transparent hover:border-blue-200">✏️</button>
                <button type="button" onClick={() => onDelete(it.id)} aria-label={`Eliminar ${it.nombre}`} title="Eliminar" className="text-rose-600 hover:bg-rose-50 w-9 h-9 flex items-center justify-center border border-transparent hover:border-rose-200">🗑️</button>
              </div>
            </div>
            <p className="text-xs text-slate-500 mt-1">Impacto: {it.impacto} · Esfuerzo: {it.esfuerzo}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

export default function StepMatriz() {
  const { modulo2 } = useDiagnostico()
  const { iniciativas, agregarIniciativa, actualizarIniciativa, eliminarIniciativa } = modulo2

  const [editandoId, setEditandoId] = useState(null)
  const [nombre, setNombre] = useState('')
  const [descripcion, setDescripcion] = useState('')
  const [impacto, setImpacto] = useState(3)
  const [esfuerzo, setEsfuerzo] = useState(3)

  const reset = () => { setEditandoId(null); setNombre(''); setDescripcion(''); setImpacto(3); setEsfuerzo(3) }

  const onGuardar = () => {
    if (!nombre.trim()) return
    if (editandoId) {
      actualizarIniciativa(editandoId, { nombre: nombre.trim(), descripcion: descripcion.trim(), impacto: Number(impacto), esfuerzo: Number(esfuerzo) })
    } else {
      agregarIniciativa({ nombre, descripcion, impacto: Number(impacto), esfuerzo: Number(esfuerzo) })
    }
    reset()
  }

  const onEditar = (it) => {
    setEditandoId(it.id); setNombre(it.nombre); setDescripcion(it.descripcion || '')
    setImpacto(it.impacto); setEsfuerzo(it.esfuerzo)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const cuadrantes = useMemo(() => {
    const map = { quick_win: [], estrategico: [], menor: [], evitar: [] }
    iniciativas.forEach((it) => { map[clasificarIniciativa(it).id].push(it) })
    return map
  }, [iniciativas])

  const tipoPreview = clasificarIniciativa({ impacto, esfuerzo })

  return (
    <div className="bg-white p-4 sm:p-6 lg:p-10 shadow-md border border-slate-200 space-y-6 sm:space-y-8">
      <div>
        <h2 className="text-xl sm:text-2xl font-bold text-emerald-800 mb-2">Matriz Impacto vs Esfuerzo</h2>
        <p className="text-slate-600 text-sm">
          Cargue las iniciativas candidatas y clasifíquelas según impacto y esfuerzo (escala 1-5). El cuadrante se asigna automáticamente.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-slate-50 p-4 sm:p-6 border border-slate-200 space-y-4">
          <h3 className="font-black text-slate-700 text-sm uppercase tracking-wider">
            {editandoId ? 'Editar iniciativa' : 'Nueva iniciativa'}
          </h3>
          <input
            type="text"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            placeholder="Nombre de la iniciativa..."
            className="w-full border-2 border-slate-200 p-3 sm:p-4 text-base outline-emerald-500"
          />
          <textarea
            value={descripcion}
            onChange={(e) => setDescripcion(e.target.value)}
            rows={2}
            placeholder="Descripción breve (opcional)..."
            className="w-full border-2 border-slate-200 p-3 text-base outline-emerald-500 resize-y"
          />
          <div>
            <label className="text-xs font-black text-slate-500 uppercase">Impacto: <span className="text-slate-800">{impacto}</span> (1 Bajo - 5 Alto)</label>
            <input type="range" min="1" max="5" value={impacto} onChange={(e) => setImpacto(e.target.value)} className="w-full h-3 bg-slate-200 appearance-none cursor-pointer mt-2 touch-manipulation" />
          </div>
          <div>
            <label className="text-xs font-black text-slate-500 uppercase">Esfuerzo: <span className="text-slate-800">{esfuerzo}</span> (1 Bajo - 5 Alto)</label>
            <input type="range" min="1" max="5" value={esfuerzo} onChange={(e) => setEsfuerzo(e.target.value)} className="w-full h-3 bg-slate-200 appearance-none cursor-pointer mt-2 touch-manipulation" />
          </div>
          <div className={`p-3 border-l-4 text-sm ${TONE[tipoPreview.color].border} ${TONE[tipoPreview.color].bg} ${TONE[tipoPreview.color].text}`}>
            Se clasificará como: <strong>{tipoPreview.label}</strong>
          </div>
          <div className="flex gap-2">
            <button type="button" onClick={onGuardar} disabled={!nombre.trim()} className="flex-1 bg-emerald-600 text-white py-3 sm:py-4 font-bold hover:bg-emerald-700 transition shadow-md disabled:bg-slate-300 disabled:cursor-not-allowed">
              {editandoId ? 'Guardar' : 'Agregar'}
            </button>
            {editandoId && (
              <button type="button" onClick={reset} className="px-4 py-3 sm:py-4 font-bold text-slate-700 border-2 border-slate-300 hover:bg-slate-100">Cancelar</button>
            )}
          </div>
        </div>

        <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
          {CUADRANTES.map((c) => (
            <CuadranteCard key={c.tipo} cuadrante={c} items={cuadrantes[c.tipo]} onEdit={onEditar} onDelete={eliminarIniciativa} />
          ))}
        </div>
      </div>
    </div>
  )
}
