import { useState } from 'react'
import { DIMENSIONES } from '../data/preguntas.js'
import { useDiagnostico } from '../state/DiagnosticoContext.jsx'
import RadarMadurez from '../components/RadarMadurez.jsx'
import TablaPromedios from '../components/TablaPromedios.jsx'

const TONE_BG = { emerald: 'bg-emerald-50', blue: 'bg-blue-50', amber: 'bg-amber-50', rose: 'bg-rose-50' }
const TONE_H3 = {
  emerald: 'text-emerald-700 border-emerald-200',
  blue: 'text-blue-700 border-blue-200',
  amber: 'text-amber-700 border-amber-200',
  rose: 'text-rose-700 border-rose-200',
}

function PreguntaRadios({ id, label, valor, onChange }) {
  return (
    <div>
      <p className="font-bold text-base mb-2">{label}</p>
      <div className="flex justify-between max-w-sm px-2">
        {[0, 1, 2, 3, 4, 5].map((v) => (
          <label key={v}>
            {v}{' '}
            <input
              type="radio"
              name={id}
              value={v}
              checked={String(valor) === String(v)}
              onChange={(e) => onChange(id, e.target.value)}
            />
          </label>
        ))}
      </div>
    </div>
  )
}

export default function TabNiveles() {
  const { respuestas, setRespuesta, promedios } = useDiagnostico()
  const [step, setStep] = useState(1)

  const verPregunta = (preg) => {
    if (!preg.dependsOn) return true
    const v = respuestas[preg.dependsOn.id]
    return v !== undefined && v !== '' && parseInt(v, 10) >= preg.dependsOn.minValue
  }

  return (
    <div className="space-y-10">
      <div className="bg-white p-10 shadow-md border border-slate-200">
        <div className="bg-emerald-50 border-l-4 border-emerald-500 p-5 mb-8">
          <h3 className="font-bold text-emerald-800 mb-1">¿Qué es esto y cómo usarlo?</h3>
          <p className="text-emerald-900 text-sm">
            Este primer instrumento es una herramienta cuantitativa diseñada para valorar el nivel de madurez en las cuatro dimensiones clave y obtener un puntaje inicial que revele "dónde están" las principales fortalezas y debilidades. Evalúe cada variable utilizando una escala donde 1 significa "Inexistente" (no tenemos esto en absoluto) y 5 significa "Optimizado" (está completamente integrado).
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 sm:gap-0 mb-10">
          <div className={`wizard-pill ${step === 1 ? 'active' : ''}`}>
            <span className="num">1</span>
            <span className="font-bold uppercase tracking-wider text-sm">Completar cuestionario</span>
          </div>
          <div className={`wizard-pill ${step === 2 ? 'active' : ''}`}>
            <span className="num">2</span>
            <span className="font-bold uppercase tracking-wider text-sm">Ver resultados</span>
          </div>
        </div>

        {step === 1 && (
          <div>
            <form className="grid grid-cols-1 md:grid-cols-2 gap-12">
              {DIMENSIONES.map((dim) => (
                <div key={dim.key} className={`space-y-8 ${TONE_BG[dim.colorTone]} p-6`}>
                  <h3 className={`font-black uppercase text-lg border-b pb-2 ${TONE_H3[dim.colorTone]}`}>{dim.titulo}</h3>
                  <div className="space-y-4">
                    {dim.preguntas.map((p) =>
                      verPregunta(p) ? (
                        <PreguntaRadios key={p.id} id={p.id} label={p.label} valor={respuestas[p.id]} onChange={setRespuesta} />
                      ) : null
                    )}
                  </div>
                </div>
              ))}
            </form>

            <div className="mt-10 flex justify-end">
              <button
                type="button"
                onClick={() => { setStep(2); window.scrollTo({ top: 0, behavior: 'smooth' }) }}
                className="bg-emerald-600 text-white px-8 py-4 font-bold hover:bg-emerald-700 transition shadow-md flex items-center gap-2"
              >
                VER RESULTADOS
                <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M5 12h14" /><path d="m12 5 7 7-7 7" /></svg>
              </button>
            </div>
          </div>
        )}

        {step === 2 && (
          <div>
            <div className="mb-8 flex justify-start">
              <button
                type="button"
                onClick={() => { setStep(1); window.scrollTo({ top: 0, behavior: 'smooth' }) }}
                className="bg-white text-emerald-800 border-2 border-emerald-600 px-6 py-3 font-bold hover:bg-emerald-50 transition flex items-center gap-2"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M19 12H5" /><path d="m12 19-7-7 7-7" /></svg>
                Volver al cuestionario
              </button>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              <div className="flex flex-col items-center">
                <RadarMadurez promedios={promedios} />
              </div>
              <div className="space-y-8">
                <TablaPromedios promedios={promedios} />
                <div className="p-6 bg-slate-50 border border-slate-200 text-slate-700 shadow-inner">
                  <h4 className="font-bold text-emerald-800 mb-3 uppercase text-sm tracking-widest">¿Cómo interpretar estos resultados?</h4>
                  <ul className="list-disc ml-5 space-y-3 text-sm">
                    <li><strong>El Principio del Equilibrio:</strong> Un proceso de digitalización saludable debe crecer de forma pareja; idealmente, la figura debería asemejarse a un cuadrado equilibrado.</li>
                    <li><strong>El Peligro de la Asimetría:</strong> Si su gráfico tiene un pico pronunciado en "Tecnología" pero está hundido en "Personas" o "Cultura", existe un alto riesgo de fracaso por resistencia al cambio.</li>
                    <li><strong>Su Cuello de Botella:</strong> Observe qué punta de la figura está más cerca del centro (el cero). Esa dimensión con el puntaje más bajo es el eslabón más débil que frena el avance general y señala dónde debe concentrar sus primeros esfuerzos de mejora.</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
