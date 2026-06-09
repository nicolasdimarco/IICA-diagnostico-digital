import { useDiagnostico } from '../../state/DiagnosticoContext.jsx'

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
  const { vision, setVisionCampo } = modulo2

  return (
    <div className="bg-white p-4 sm:p-6 lg:p-10 shadow-md border border-slate-200 space-y-6">
      <div>
        <h2 className="text-xl sm:text-2xl font-bold text-emerald-800 mb-2">Generador de Visión Digital</h2>
        <p className="text-slate-600 text-sm">
          A partir del diagnóstico previo, articule la visión digital de la cooperativa completando los cinco bloques siguientes.
        </p>
      </div>

      <div className="space-y-5">
        {CAMPOS.map((c) => (
          <CampoVision key={c.key} campo={c} value={vision[c.key]} onChange={setVisionCampo} />
        ))}
      </div>
    </div>
  )
}
