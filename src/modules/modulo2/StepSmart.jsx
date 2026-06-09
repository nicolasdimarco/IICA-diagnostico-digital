import { useState } from 'react'
import { useDiagnostico } from '../../state/DiagnosticoContext.jsx'
import { iniciativasPorTipo, generarStatementSmart } from './classify.js'

const CAMPOS_SMART = [
  { key: 'especifico', label: 'Específico',  hint: '¿Qué se hará exactamente? Describa la acción concreta.',                placeholder: 'Ej: implementar un canal único de pedidos por WhatsApp Business...' },
  { key: 'medible',    label: 'Medible',     hint: '¿Cómo se medirá el avance? Indique métrica + valor objetivo.',           placeholder: 'Ej: 80% de los socios usando el canal en 6 meses; tiempo medio de respuesta < 4 h...' },
  { key: 'alcanzable', label: 'Alcanzable',  hint: 'Recursos, capacidades y dependencias que lo hacen viable.',              placeholder: 'Ej: capacitación del equipo administrativo + plantilla de respuestas + soporte IT...' },
  { key: 'relevante',  label: 'Relevante',   hint: 'Por qué importa: link con la visión digital y con el quick win origen.', placeholder: 'Ej: descomprime atención telefónica; libera horas del equipo para tareas de mayor valor...' },
  { key: 'temporal',   label: 'Temporal',    hint: 'Plazo concreto (mes, trimestre, fecha) y revisiones intermedias.',       placeholder: 'Ej: piloto a 60 días, despliegue total al cierre del trimestre...' },
]

const REQ_MEDIBLE_MIN = 20

function validarSmart(s) {
  if (!s) return { ok: false, faltantes: CAMPOS_SMART.map((c) => c.key), medibleOk: false, temporalOk: false }
  const faltantes = CAMPOS_SMART.filter((c) => !(s[c.key] || '').trim()).map((c) => c.key)
  const medibleOk = (s.medible || '').trim().length >= REQ_MEDIBLE_MIN
  const temporalOk = (s.temporal || '').trim().length > 0
  return { ok: faltantes.length === 0 && medibleOk && temporalOk, faltantes, medibleOk, temporalOk }
}

function QuickWinItem({ iniciativa, smart, onChange, isOpen, onToggle }) {
  const v = validarSmart(smart)
  const statement = generarStatementSmart(smart)
  const panelId = `qw-panel-${iniciativa.id}`
  return (
    <div className="bg-white border-2 border-emerald-200">
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={isOpen}
        aria-controls={panelId}
        className="w-full flex items-center gap-3 p-4 sm:p-5 text-left hover:bg-emerald-50 transition"
      >
        <h3 className="font-black text-emerald-800 text-base sm:text-lg flex-1 min-w-0 truncate">
          {iniciativa.nombre}
        </h3>
        <span
          className={`inline-flex items-center px-3 py-1 text-xs font-black uppercase tracking-wider shrink-0 ${
            v.ok
              ? 'bg-emerald-600 text-white'
              : 'bg-amber-100 text-amber-800 border border-amber-300'
          }`}
        >
          {v.ok ? 'Completo' : 'Incompleto'}
        </span>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className={`w-5 h-5 text-slate-500 transition-transform shrink-0 ${isOpen ? 'rotate-180' : ''}`}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="m6 9 6 6 6-6" />
        </svg>
      </button>
      {isOpen && (
        <div id={panelId} className="border-t border-slate-200 p-4 sm:p-6 space-y-4">
          {iniciativa.descripcion && <p className="text-sm text-slate-600 italic">{iniciativa.descripcion}</p>}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {CAMPOS_SMART.map((c) => {
              const val = (smart && smart[c.key]) || ''
              const requiereLongitud = c.key === 'medible'
              const longitudOk = !requiereLongitud || val.trim().length >= REQ_MEDIBLE_MIN
              return (
                <div key={c.key}>
                  <div className="flex justify-between items-baseline gap-2 mb-1">
                    <label className="font-bold text-sm text-slate-800">{c.label}</label>
                    {requiereLongitud && (
                      <span className={`text-xs tabular-nums ${longitudOk ? 'text-emerald-700' : 'text-slate-400'}`}>
                        {val.trim().length} / {REQ_MEDIBLE_MIN}
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-500 mb-1">{c.hint}</p>
                  <textarea
                    value={val}
                    onChange={(e) => onChange(iniciativa.id, c.key, e.target.value)}
                    rows={2}
                    placeholder={c.placeholder}
                    className="w-full border-2 border-slate-200 p-2 sm:p-3 text-base outline-emerald-500 resize-y"
                  />
                </div>
              )
            })}
          </div>

          <div className="p-3 sm:p-4 bg-slate-50 border border-slate-200">
            <h4 className="font-black text-slate-700 text-xs uppercase tracking-wider mb-2">Objetivo SMART consolidado</h4>
            <p className="text-slate-800 italic min-h-[2.5rem]">
              {statement || <span className="text-slate-400">Complete los campos para ver el objetivo consolidado.</span>}
            </p>
          </div>
        </div>
      )}
    </div>
  )
}

export default function StepSmart() {
  const { modulo2 } = useDiagnostico()
  const { iniciativas, smart, setSmartCampo } = modulo2
  const [openIds, setOpenIds] = useState(() => new Set())

  const quickWins = iniciativasPorTipo(iniciativas, 'quick_win')

  const toggle = (id) =>
    setOpenIds((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })

  return (
    <div className="bg-white p-4 sm:p-6 lg:p-10 shadow-md border border-slate-200 space-y-6">
      <div>
        <h2 className="text-xl sm:text-2xl font-bold text-emerald-800 mb-2">Constructor SMART</h2>
        <p className="text-slate-600 text-sm">
          Solo se transforman en objetivos SMART las iniciativas clasificadas como <strong>Quick Win</strong> en la matriz anterior.
          Las iniciativas estratégicas, menores o descartadas no aparecen acá.
        </p>
      </div>

      {quickWins.length === 0 ? (
        <div className="bg-amber-50 border-l-4 border-amber-500 p-4 sm:p-5 text-amber-900 text-sm">
          Todavía no hay iniciativas clasificadas como Quick Win. Vuelva al paso anterior y ajuste impacto/esfuerzo de al menos una iniciativa para activarla acá (impacto ≥ 4 y esfuerzo ≤ 3).
        </div>
      ) : (
        <div className="space-y-3 sm:space-y-4">
          {quickWins.map((it) => (
            <QuickWinItem
              key={it.id}
              iniciativa={it}
              smart={smart[it.id]}
              onChange={setSmartCampo}
              isOpen={openIds.has(it.id)}
              onToggle={() => toggle(it.id)}
            />
          ))}
        </div>
      )}
    </div>
  )
}
