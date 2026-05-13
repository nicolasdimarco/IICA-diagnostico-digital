import { useState } from 'react'
import { Scatter } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  LinearScale,
  PointElement,
  Tooltip,
  Legend,
} from 'chart.js'
import { useDiagnostico } from '../state/DiagnosticoContext.jsx'

ChartJS.register(LinearScale, PointElement, Tooltip, Legend)

export default function TabEmbudo() {
  const { puntos, agregarPunto, eliminarPunto, borrarTodosPuntos } = useDiagnostico()
  const [nombre, setNombre] = useState('')
  const [esfuerzo, setEsfuerzo] = useState(3)
  const [impacto, setImpacto] = useState(3)

  const onAgregar = () => {
    if (!nombre.trim()) return
    agregarPunto({ n: nombre.trim(), x: Number(esfuerzo), y: Number(impacto) })
    setNombre(''); setEsfuerzo(3); setImpacto(3)
  }

  const onEditar = (i) => {
    const p = puntos[i]
    setNombre(p.n); setEsfuerzo(p.x); setImpacto(p.y)
    eliminarPunto(i)
  }

  const onBorrarTodos = () => {
    if (window.confirm('¿Está seguro de que desea borrar todos los puntos priorizados? Esta acción no se puede deshacer.')) {
      borrarTodosPuntos()
    }
  }

  const data = {
    datasets: [{
      data: puntos.map((p) => ({ x: p.x, y: p.y, n: p.n })),
      backgroundColor: '#009C8F',
      pointRadius: 12,
    }],
  }
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: { title: { display: true, text: 'Esfuerzo →', font: { size: 14, weight: 'bold' } }, min: 1, max: 5, ticks: { stepSize: 1 } },
      y: { title: { display: true, text: 'Impacto ↑', font: { size: 14, weight: 'bold' } }, min: 1, max: 5, ticks: { stepSize: 1 } },
    },
    plugins: { tooltip: { callbacks: { label: (c) => c.raw.n } }, legend: { display: false } },
  }

  return (
    <div className="bg-white p-4 sm:p-6 lg:p-10 shadow-md border border-slate-200">
      <h2 className="text-2xl sm:text-3xl font-bold text-emerald-800 mb-4">Embudo de Puntos Críticos</h2>

      <div className="bg-emerald-50 border-l-4 border-emerald-500 p-4 sm:p-5 mb-6 sm:mb-8">
        <h3 className="font-bold text-emerald-800 mb-1">Definiendo Prioridades</h3>
        <p className="text-emerald-900 text-sm">
          El objetivo final del diagnóstico consiste en transformar el FODA en una lista breve y clara de 'puntos críticos' que requieren atención prioritaria. Valore cada problema y concéntrese en aquellas brechas de "Alto Impacto y Bajo Esfuerzo" que pueden generar victorias tempranas.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8 lg:gap-12 mt-6 sm:mt-8">
        <div className="bg-slate-50 p-4 sm:p-6 lg:p-8 border border-slate-200 flex flex-col h-full order-2 lg:order-1">
          <div className="space-y-5 sm:space-y-6">
            <input
              type="text"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              placeholder="Problema Prioritario..."
              className="w-full border-2 border-slate-200 p-4 text-base outline-emerald-500"
            />
            <div>
              <label className="text-xs font-black text-slate-500 uppercase">Esfuerzo: <span className="text-slate-800">{esfuerzo}</span> (1 Fácil - 5 Difícil)</label>
              <input type="range" min="1" max="5" value={esfuerzo} onChange={(e) => setEsfuerzo(e.target.value)} className="w-full h-3 bg-slate-200 appearance-none cursor-pointer mt-2 touch-manipulation" />
            </div>
            <div>
              <label className="text-xs font-black text-slate-500 uppercase">Impacto: <span className="text-slate-800">{impacto}</span> (1 Bajo - 5 Crítico)</label>
              <input type="range" min="1" max="5" value={impacto} onChange={(e) => setImpacto(e.target.value)} className="w-full h-3 bg-slate-200 appearance-none cursor-pointer mt-2 touch-manipulation" />
            </div>
            <button type="button" onClick={onAgregar} className="w-full bg-emerald-600 text-white py-4 sm:py-5 font-black text-base sm:text-lg hover:bg-emerald-700 transition-all shadow-md">Agregar</button>
          </div>

          <div className="mt-8 sm:mt-10 pt-6 sm:pt-8 border-t border-slate-300 flex-1">
            <div className="flex justify-between items-center mb-4 gap-2">
              <h4 className="font-black text-slate-700 text-sm uppercase tracking-wider">Puntos Agregados</h4>
              <button type="button" onClick={onBorrarTodos} className="text-xs text-rose-600 hover:text-rose-800 font-bold underline transition-colors shrink-0">Borrar Todos</button>
            </div>
            <div className="space-y-3 overflow-y-auto max-h-[300px] pr-1 sm:pr-2">
              {puntos.length === 0 ? (
                <p className="text-sm text-slate-400 italic">No hay puntos registrados aún.</p>
              ) : (
                puntos.map((p, i) => (
                  <div key={i} className="flex justify-between items-center bg-white p-3 sm:p-4 border border-slate-200 shadow-sm gap-2">
                    <div className="flex-1 min-w-0 overflow-hidden">
                      <p className="font-bold text-slate-800 text-sm truncate" title={p.n}>{p.n}</p>
                      <p className="text-xs text-slate-500 mt-1">Esfuerzo: {p.x} | Impacto: {p.y}</p>
                    </div>
                    <div className="flex gap-1 shrink-0">
                      <button type="button" onClick={() => onEditar(i)} aria-label={`Editar ${p.n}`} className="text-blue-600 hover:bg-blue-50 w-11 h-11 flex items-center justify-center transition-colors border border-transparent hover:border-blue-200" title="Editar">✏️</button>
                      <button type="button" onClick={() => eliminarPunto(i)} aria-label={`Eliminar ${p.n}`} className="text-rose-600 hover:bg-rose-50 w-11 h-11 flex items-center justify-center transition-colors border border-transparent hover:border-rose-200" title="Eliminar">🗑️</button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        <div className="lg:col-span-2 flex flex-col justify-center order-1 lg:order-2 min-h-[340px] sm:min-h-[420px] lg:min-h-[500px]">
          <Scatter data={data} options={options} />
        </div>
      </div>
    </div>
  )
}
