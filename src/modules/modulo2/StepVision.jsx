import { useDiagnostico } from '../../state/DiagnosticoContext.jsx'
import { generarStatementVision } from './state.js'

const CAMPOS = [
  { key: 'dolores',       titulo: '¿Qué duele hoy?',                       placeholder: 'Procesos manuales, errores recurrentes, pérdida de tiempo...', minLen: 20, estrategico: false },
  { key: 'expectativas',  titulo: 'Expectativas de mejora',                placeholder: 'Qué cambio concreto esperaríamos lograr...',                  minLen: 20, estrategico: false },
  { key: 'estadoFuturo',  titulo: 'Estado futuro deseado',                 placeholder: 'Cómo nos veríamos operando dentro de 2-3 años...',           minLen: 30, estrategico: true },
  { key: 'habilitadores', titulo: 'Mecanismos / habilitadores digitales',  placeholder: 'Herramientas, datos, capacidades, alianzas...',              minLen: 20, estrategico: true },
  { key: 'proposito',     titulo: 'Propósito / beneficio esperado',        placeholder: 'A quién y cómo beneficia esta transformación...',            minLen: 20, estrategico: true },
]

function CampoVision({ campo, value, onChange }) {
  const longitudOk = (value || '').trim().length >= campo.minLen
  return (
    <div>
      <div className="flex justify-between items-baseline gap-2 mb-2">
        <label className="font-bold text-sm sm:text-base text-slate-800">
          {campo.titulo}
          {campo.estrategico && <span className="ml-2 text-xs uppercase tracking-wider text-emerald-700">estratégico</span>}
        </label>
        <span className={`text-xs tabular-nums shrink-0 ${longitudOk ? 'text-emerald-700' : 'text-slate-400'}`}>
          {(value || '').trim().length} / {campo.minLen}
        </span>
      </div>
      <textarea
        value={value || ''}
        onChange={(e) => onChange(campo.key, e.target.value)}
        rows={3}
        placeholder={campo.placeholder}
        className="w-full border-2 border-slate-200 p-3 sm:p-4 text-base outline-emerald-500 resize-y"
      />
    </div>
  )
}

export default function StepVision() {
  const { modulo2 } = useDiagnostico()
  const { vision, setVisionCampo, resetVisionStatement } = modulo2

  const estrategicosOk = CAMPOS.filter((c) => c.estrategico)
    .every((c) => (vision[c.key] || '').trim().length >= c.minLen)
  const statementPreview = vision.statementManual ? vision.statement : generarStatementVision(vision)

  return (
    <div className="bg-white p-4 sm:p-6 lg:p-10 shadow-md border border-slate-200 space-y-6">
      <div>
        <h2 className="text-xl sm:text-2xl font-bold text-emerald-800 mb-2">Generador de Visión Digital</h2>
        <p className="text-slate-600 text-sm">
          A partir del diagnóstico previo, articule la visión digital de la cooperativa.
          El statement consolidado se actualiza automáticamente con los tres bloques estratégicos y puede editarse manualmente al final.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-5">
          {CAMPOS.map((c) => (
            <CampoVision key={c.key} campo={c} value={vision[c.key]} onChange={setVisionCampo} />
          ))}
        </div>

        <div className="space-y-5">
          <div className="bg-emerald-50 border-l-4 border-emerald-500 p-4 sm:p-5">
            <h3 className="font-bold text-emerald-800 mb-1 uppercase text-xs tracking-widest">Statement de visión</h3>
            <p className="text-emerald-900 text-sm">
              Esta redacción es la salida del instrumento. Si la generación automática no lo refleja con precisión, edítela manualmente.
            </p>
          </div>

          <div className="p-4 sm:p-6 bg-slate-50 border border-slate-200">
            <div className="flex justify-between items-baseline gap-2 mb-3">
              <h4 className="font-black text-slate-700 text-sm uppercase tracking-wider">
                {vision.statementManual ? 'Statement (editado manualmente)' : 'Statement (auto)'}
              </h4>
              {vision.statementManual && (
                <button
                  type="button"
                  onClick={resetVisionStatement}
                  className="text-xs text-emerald-700 hover:text-emerald-900 font-bold underline shrink-0"
                >Restaurar automático</button>
              )}
            </div>

            {!vision.statementManual ? (
              <p className="text-slate-800 italic min-h-[3rem]">
                {statementPreview || <span className="text-slate-400">Complete los tres bloques estratégicos para ver el statement consolidado.</span>}
              </p>
            ) : (
              <textarea
                value={vision.statement}
                onChange={(e) => setVisionCampo('statement', e.target.value)}
                rows={5}
                className="w-full bg-white border-2 border-emerald-300 p-3 sm:p-4 text-base outline-emerald-500 resize-y"
              />
            )}

            {!vision.statementManual && statementPreview && (
              <button
                type="button"
                onClick={() => setVisionCampo('statement', statementPreview)}
                className="mt-4 text-xs font-bold text-emerald-700 hover:text-emerald-900 underline"
              >Editar manualmente</button>
            )}
          </div>

          <div className={`p-4 border-l-4 text-sm ${estrategicosOk ? 'border-emerald-500 bg-emerald-50 text-emerald-900' : 'border-amber-500 bg-amber-50 text-amber-900'}`}>
            {estrategicosOk
              ? 'Listo: los tres bloques estratégicos cumplen la longitud mínima. Puede avanzar al siguiente paso.'
              : 'Complete los tres bloques estratégicos (estado futuro, habilitadores y propósito) con la longitud mínima para habilitar un statement sólido.'}
          </div>
        </div>
      </div>
    </div>
  )
}
