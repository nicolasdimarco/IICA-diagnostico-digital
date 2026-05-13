import { useDiagnostico } from '../state/DiagnosticoContext.jsx'

const FODA_FIELDS = [
  { key: 'f', titulo: 'Fortalezas',    placeholder: 'Capacidades internas...', bg: 'bg-emerald-50', text: 'text-emerald-800', border: 'border-emerald-200' },
  { key: 'o', titulo: 'Oportunidades', placeholder: 'Mercado / Entorno...',    bg: 'bg-blue-50',    text: 'text-blue-800',    border: 'border-blue-200' },
  { key: 'd', titulo: 'Debilidades',   placeholder: 'Brechas críticas...',     bg: 'bg-orange-50',  text: 'text-orange-800',  border: 'border-orange-200' },
  { key: 'a', titulo: 'Amenazas',      placeholder: 'Riesgos externos...',     bg: 'bg-rose-50',    text: 'text-rose-800',    border: 'border-rose-200' },
]

const CRUCES_FIELDS = [
  { key: 'fo', titulo: 'Potencialidades (F + O)', hint: '¿Cómo usar sus fortalezas para aprovechar las oportunidades?', color: 'text-emerald-700', bg: 'bg-slate-50', borderInput: 'border-slate-300', ring: 'focus:ring-emerald-500', textHint: 'text-slate-500', placeholder: 'Escriba su estrategia u oportunidad clave...' },
  { key: 'do', titulo: 'Desafíos (D + O)',         hint: '¿Cómo superar debilidades apoyándose en las oportunidades?',  color: 'text-blue-700',    bg: 'bg-slate-50', borderInput: 'border-slate-300', ring: 'focus:ring-emerald-500', textHint: 'text-slate-500', placeholder: 'Escriba su estrategia de mejora...' },
  { key: 'fa', titulo: 'Riesgos (F + A)',           hint: '¿Cómo usar sus fortalezas para mitigar y defenderse de las amenazas?', color: 'text-orange-700', bg: 'bg-slate-50', borderInput: 'border-slate-300', ring: 'focus:ring-emerald-500', textHint: 'text-slate-500', placeholder: 'Escriba su estrategia defensiva...' },
  { key: 'da', titulo: 'Puntos Críticos (D + A)',  hint: 'Riesgo máximo. ¿Qué debe solucionar urgentemente para sobrevivir?', color: 'text-rose-700', bg: 'bg-rose-50', borderInput: 'border-rose-300', ring: 'focus:ring-rose-500', textHint: 'text-rose-600 font-bold', placeholder: 'Escriba la familia de problemas a resolver (Candidato para el embudo)...' },
]

export default function TabFoda() {
  const { foda, setFodaCampo, cruces, setCruceCampo } = useDiagnostico()
  return (
    <div className="bg-white p-10 shadow-md border border-slate-200 space-y-8 text-base">
      <div className="bg-emerald-50 border-l-4 border-emerald-500 p-5 mb-8">
        <h3 className="font-bold text-emerald-800 mb-1">Paso 1: Organice y Paso 2: Analice</h3>
        <p className="text-emerald-900 text-sm">
          Primero, organice sus hallazgos en los 4 cuadrantes del FODA. Luego, descienda a la sección de "Cruces Estratégicos" para agrupar problemas y oportunidades combinando factores (Ej: usar una Fortaleza para mitigar una Amenaza).
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {FODA_FIELDS.map((f) => (
          <div key={f.key} className={`${f.bg} p-6 border-2 ${f.border} min-h-[200px] flex flex-col`}>
            <h3 className={`font-black uppercase mb-4 ${f.text}`}>{f.titulo}</h3>
            <textarea
              value={foda[f.key]}
              onChange={(e) => setFodaCampo(f.key, e.target.value)}
              placeholder={f.placeholder}
              className="flex-1 bg-transparent border-none resize-none focus:ring-0 outline-none"
            />
          </div>
        ))}
      </div>

      <div className="border-t-2 border-slate-200 pt-10 mt-10">
        <h3 className="text-2xl font-bold text-emerald-800 mb-6">Cruces Estratégicos (Familias de Problemas)</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {CRUCES_FIELDS.map((c) => (
            <div key={c.key} className={`${c.bg} p-6 border border-slate-200 shadow-sm`}>
              <h4 className={`font-black text-sm mb-1 uppercase tracking-wider ${c.color}`}>{c.titulo}</h4>
              <p className={`text-xs mb-4 italic ${c.textHint}`}>{c.hint}</p>
              <textarea
                value={cruces[c.key]}
                onChange={(e) => setCruceCampo(c.key, e.target.value)}
                rows={3}
                placeholder={c.placeholder}
                className={`w-full bg-white border ${c.borderInput} p-4 resize-none focus:ring-2 ${c.ring} outline-none text-sm`}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
