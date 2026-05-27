import { useDiagnostico } from '../../state/DiagnosticoContext.jsx'
import { MODELOS_LIDERAZGO } from './state.js'
import { iniciativasPorTipo, generarStatementSmart } from './classify.js'

function Tarjeta({ titulo, vacioMsg, children }) {
  return (
    <div className="bg-slate-50 border border-slate-200 p-4 sm:p-6">
      <h3 className="font-black text-slate-700 text-sm uppercase tracking-wider mb-3">{titulo}</h3>
      {children || <p className="text-sm text-slate-400 italic">{vacioMsg}</p>}
    </div>
  )
}

export default function StepGobernanza() {
  const { modulo2 } = useDiagnostico()
  const { vision, iniciativas, smart, gobernanza, setGobernanzaCampo } = modulo2

  const quickWins = iniciativasPorTipo(iniciativas, 'quick_win')
  const visionStatement = (vision.statement || '').trim()

  return (
    <div className="bg-white p-4 sm:p-6 lg:p-10 shadow-md border border-slate-200 space-y-6 sm:space-y-8">
      <div>
        <h2 className="text-xl sm:text-2xl font-bold text-emerald-800 mb-2">Gobernanza y Hoja de Ruta</h2>
        <p className="text-slate-600 text-sm">
          Tablero ejecutivo del módulo: consolida la visión digital, los quick wins clasificados y los objetivos SMART, y los amarra a un responsable, modelo de liderazgo y fecha de primera revisión trimestral.
        </p>
      </div>

      <Tarjeta titulo="Visión Digital" vacioMsg="Pendiente: complete el paso 'Generador de Visión Digital'.">
        {visionStatement && <p className="text-slate-800 italic leading-relaxed">"{visionStatement}"</p>}
      </Tarjeta>

      <Tarjeta titulo={`Quick Wins (${quickWins.length})`} vacioMsg="Sin iniciativas clasificadas como Quick Win en la matriz.">
        {quickWins.length > 0 && (
          <ul className="space-y-2">
            {quickWins.map((it) => (
              <li key={it.id} className="bg-white border border-slate-200 p-3 text-sm">
                <p className="font-bold text-slate-800">{it.nombre}</p>
                {it.descripcion && <p className="text-xs text-slate-600 italic mt-1">{it.descripcion}</p>}
                <p className="text-xs text-slate-500 mt-1">Impacto: {it.impacto} · Esfuerzo: {it.esfuerzo}</p>
              </li>
            ))}
          </ul>
        )}
      </Tarjeta>

      <Tarjeta titulo="Objetivos SMART" vacioMsg="Sin objetivos SMART registrados todavía.">
        {(() => {
          const objetivos = quickWins
            .map((it) => ({ it, statement: generarStatementSmart(smart[it.id]) }))
            .filter(({ statement }) => statement.length > 0)
          if (objetivos.length === 0) return null
          return (
            <ul className="space-y-3">
              {objetivos.map(({ it, statement }) => (
                <li key={it.id} className="bg-white border-l-4 border-emerald-500 p-3 text-sm">
                  <p className="font-bold text-emerald-800 text-xs uppercase tracking-wider mb-1">{it.nombre}</p>
                  <p className="text-slate-800 italic">{statement}</p>
                </li>
              ))}
            </ul>
          )
        })()}
      </Tarjeta>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
        <div>
          <label className="block text-xs font-black text-slate-500 uppercase mb-2">Responsable</label>
          <input
            type="text"
            value={gobernanza.responsable}
            onChange={(e) => setGobernanzaCampo('responsable', e.target.value)}
            placeholder="Nombre y rol..."
            className="w-full border-2 border-slate-200 p-3 sm:p-4 text-base outline-emerald-500"
          />
        </div>

        <div>
          <label className="block text-xs font-black text-slate-500 uppercase mb-2">Modelo de liderazgo</label>
          <select
            value={gobernanza.modeloLiderazgo}
            onChange={(e) => setGobernanzaCampo('modeloLiderazgo', e.target.value)}
            className="w-full border-2 border-slate-200 p-3 sm:p-4 text-base outline-emerald-500 bg-white"
          >
            <option value="">Seleccione un modelo...</option>
            {MODELOS_LIDERAZGO.map((m) => (
              <option key={m.id} value={m.id}>{m.label}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-xs font-black text-slate-500 uppercase mb-2">Primera revisión trimestral</label>
          <input
            type="date"
            value={gobernanza.fechaRevision}
            onChange={(e) => setGobernanzaCampo('fechaRevision', e.target.value)}
            className="w-full border-2 border-slate-200 p-3 sm:p-4 text-base outline-emerald-500"
          />
        </div>
      </div>

      <div className="bg-emerald-50 border-l-4 border-emerald-500 p-4 sm:p-5 text-sm text-emerald-900">
        Use el botón <strong>Descargar Resultados</strong> de la cabecera para exportar el reporte consolidado, que incluye visión, quick wins, objetivos SMART y gobernanza.
      </div>
    </div>
  )
}
