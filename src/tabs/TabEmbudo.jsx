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
    <div className="bg-white p-10 shadow-md border border-slate-200">
      <h2 className="text-3xl font-bold text-emerald-800 mb-4 underline">Embudo de Puntos Críticos</h2>

      <div className="bg-emerald-50 border-l-4 border-emerald-500 p-5 mb-8">
        <h3 className="font-bold text-emerald-800 mb-1">Definiendo Prioridades</h3>
        <p className="text-emerald-900 text-sm">
          El objetivo final del diagnóstico consiste en transformar el FODA en una lista breve y clara de 'puntos críticos' que requieren atención prioritaria. Valore cada problema y concéntrese en aquellas brechas de "Alto Impacto y Bajo Esfuerzo" que pueden generar victorias tempranas.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 mt-8">
        <div className="bg-slate-50 p-8 border border-slate-200 flex flex-col h-full">
          <div className="space-y-6">
            <input
              type="text"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              placeholder="Problema Prioritario..."
              className="w-full border-2 border-slate-200 p-4 text-base outline-emerald-500"
            />
            <div>
              <label className="text-xs font-black text-slate-500 uppercase">Esfuerzo (1 Fácil - 5 Difícil)</label>
              <input type="range" min="1" max="5" value={esfuerzo} onChange={(e) => setEsfuerzo(e.target.value)} className="w-full h-2 bg-slate-200 appearance-none cursor-pointer mt-2" />
            </div>
            <div>
              <label className="text-xs font-black text-slate-500 uppercase">Impacto (1 Bajo - 5 Crítico)</label>
              <input type="range" min="1" max="5" value={impacto} onChange={(e) => setImpacto(e.target.value)} className="w-full h-2 bg-slate-200 appearance-none cursor-pointer mt-2" />
            </div>
            <button type="button" onClick={onAgregar} className="w-full bg-emerald-600 text-white py-5 font-black text-lg hover:bg-emerald-700 transition-all shadow-md">Agregar</button>
          </div>

          <div className="mt-10 pt-8 border-t border-slate-300 flex-1">
            <div className="flex justify-between items-center mb-4">
              <h4 className="font-black text-slate-700 text-sm uppercase tracking-wider">Puntos Agregados</h4>
              <button type="button" onClick={onBorrarTodos} className="text-xs text-rose-600 hover:text-rose-800 font-bold underline transition-colors">Borrar Todos</button>
            </div>
            <div className="space-y-3 overflow-y-auto max-h-[300px] pr-2">
              {puntos.length === 0 ? (
                <p className="text-sm text-slate-400 italic">No hay puntos registrados aún.</p>
              ) : (
                puntos.map((p, i) => (
                  <div key={i} className="flex justify-between items-center bg-white p-4 border border-slate-200 shadow-sm">
                    <div className="flex-1 pr-4 overflow-hidden">
                      <p className="font-bold text-slate-800 text-sm truncate" title={p.n}>{p.n}</p>
                      <p className="text-xs text-slate-500 mt-1">Esfuerzo: {p.x} | Impacto: {p.y}</p>
                    </div>
                    <div className="flex gap-2">
                      <button type="button" onClick={() => onEditar(i)} className="text-blue-600 hover:bg-blue-50 p-2 transition-colors border border-transparent hover:border-blue-200" title="Editar">✏️</button>
                      <button type="button" onClick={() => eliminarPunto(i)} className="text-rose-600 hover:bg-rose-50 p-2 transition-colors border border-transparent hover:border-rose-200" title="Eliminar">🗑️</button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        <div className="lg:col-span-2 flex flex-col justify-center" style={{ minHeight: 500 }}>
          <Scatter data={data} options={options} />
        </div>
      </div>
    </div>
  )
}
