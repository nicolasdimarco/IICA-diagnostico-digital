import { useState } from 'react'
import { useDiagnostico } from '../state/DiagnosticoContext.jsx'
import RadarMadurez from '../components/RadarMadurez.jsx'
import TablaPromedios from '../components/TablaPromedios.jsx'

const BLOQUES = [
  {
    titulo: 'Bloque 1: Exploración de Procesos',
    color: 'text-emerald-700',
    items: [
      'Si pudiera tener una "varita mágica" para eliminar una tarea, ¿cuál sería y por qué?',
      'En el pico de cosecha, ¿dónde se genera el principal cuello de botella?',
      'Cuando hay un reclamo, ¿cuánto tiempo toma encontrar la información?',
    ],
  },
  {
    titulo: 'Bloque 2: Experiencia Tecnológica',
    color: 'text-blue-700',
    items: [
      'De los sistemas actuales, ¿cuál es más útil y cuál da más dolores de cabeza?',
      'Si se invirtiera en un nuevo sistema, ¿cuál es su mayor temor?',
      '¿Cuál cree que es la principal barrera para que los socios usen el celular?',
    ],
  },
  {
    titulo: 'Bloque 3: Visión de Futuro y Cultura',
    color: 'text-rose-700',
    items: [
      'Ante una nueva tecnología, ¿quiénes la apoyarían y quiénes pondrían resistencia?',
      '¿Qué significaría que la cooperativa fuera "más moderna"?',
      '¿Qué es lo mínimo que se debe garantizar antes de exigir el uso de una herramienta?',
    ],
  },
]

export default function TabAnalisis() {
  const { promedios, hallazgos, agregarHallazgo } = useDiagnostico()
  const [texto, setTexto] = useState('')

  const onAgregar = () => {
    if (!texto.trim()) return
    agregarHallazgo(texto)
    setTexto('')
  }

  return (
    <div className="bg-white p-10 shadow-md border border-slate-200">
      <h2 className="text-3xl font-bold text-emerald-800 mb-4 underline">Gráfico de Resultados y Análisis</h2>

      <div className="bg-emerald-50 border-l-4 border-emerald-500 p-5 mb-10 max-w-full">
        <h3 className="font-bold text-emerald-800 mb-1">Visualizando el Equilibrio</h3>
        <p className="text-emerald-900 text-sm">
          El Gráfico de Radar conecta los promedios obtenidos en las cuatro dimensiones. Revise esta imagen de su realidad institucional para responder a la guía de exploración cualitativa en la parte inferior.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center mb-16 border-b-2 border-slate-200 pb-12">
        <div className="flex flex-col items-center">
          <RadarMadurez promedios={promedios} />
        </div>
        <div className="space-y-8">
          <TablaPromedios promedios={promedios} />
        </div>
      </div>

      <h3 className="text-2xl font-bold text-emerald-800 mb-4">Guía de Análisis Cualitativo</h3>

      <div className="bg-emerald-50 border-l-4 border-emerald-500 p-5 mb-8">
        <h3 className="font-bold text-emerald-800 mb-1">Descubriendo el "Porqué"</h3>
        <p className="text-emerald-900 text-sm">
          Los números por sí solos no revelan la historia completa. Esta guía utiliza preguntas abiertas diseñadas para generar un diálogo honesto y descubrir los verdaderos cuellos de botella operativos y los temores del equipo. Lea las preguntas y registre en el "Muro" los testimonios más reveladores.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        <div className="space-y-8">
          {BLOQUES.map((b, i) => (
            <div key={i} className="bg-slate-50 p-6 border border-slate-200">
              <h3 className={`font-bold text-lg mb-4 ${b.color}`}>{b.titulo}</h3>
              <ul className="space-y-4 text-base text-slate-700 list-disc ml-6">
                {b.items.map((q, j) => <li key={j}>{q}</li>)}
              </ul>
            </div>
          ))}
        </div>

        <div className="bg-white">
          <h3 className="font-black text-slate-800 uppercase mb-6 text-sm tracking-widest">Muro de Hallazgos</h3>
          <div className="flex gap-4 mb-8">
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
              className="bg-emerald-600 text-white px-8 py-4 font-bold hover:bg-emerald-700 transition shadow-md"
            >Añadir</button>
          </div>
          <div className="space-y-4 overflow-y-auto max-h-[500px] pr-2">
            {hallazgos.map((h, i) => (
              <div key={i} className="p-5 bg-emerald-50 border-l-8 border-emerald-500 shadow-sm">
                <p className="italic text-slate-700">"{h}"</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
