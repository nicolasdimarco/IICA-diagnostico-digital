import { useMemo } from 'react'
import { useDiagnostico } from '../state/DiagnosticoContext.jsx'
import { descargarReporte } from '../utils/descargarReporte.js'
import { MODULOS } from '../modules/index.js'
import { calcularProgreso } from '../modules/progress.js'

export default function Header({ modulos, activeModule, onChangeModule }) {
  const state = useDiagnostico()
  const onDownload = () => descargarReporte({ modulos: MODULOS, state })

  const { percent, filled, total } = useMemo(
    () => calcularProgreso(modulos || [], state),
    [modulos, state],
  )

  return (
    <header className="bg-emerald-900 text-white p-5 sm:p-8 mb-6 sm:mb-10 shadow-xl flex flex-col gap-4 sm:gap-6">
      <div className="flex flex-col sm:flex-row sm:items-center gap-4">
        <div className="flex items-center gap-2 sm:gap-3 min-w-0">
          <h1 className="text-2xl sm:text-4xl font-black">Diagnóstico Digital</h1>
          <button
            onClick={onDownload}
            title="Descargar resultados"
            aria-label="Descargar resultados"
            className="bg-white text-emerald-900 p-2 sm:p-2.5 hover:bg-emerald-50 transition shadow-lg shrink-0"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 sm:w-6 sm:h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M12 3v12" />
              <path d="m7 10 5 5 5-5" />
              <path d="M5 21h14" />
            </svg>
          </button>
        </div>

        <div
          className="flex items-center gap-3 sm:gap-4 sm:w-1/2 sm:ml-auto"
          role="progressbar"
          aria-label="Progreso del diagnóstico"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={percent}
          aria-valuetext={`${percent}% completado (${filled} de ${total} respuestas)`}
        >
          <div className="flex-1 h-2 sm:h-2.5 bg-white/15 overflow-hidden">
            <div
              className="h-full bg-emerald-300 transition-all duration-500 ease-out"
              style={{ width: `${percent}%` }}
            />
          </div>
          <span aria-live="polite" className="font-bold text-white text-sm sm:text-base whitespace-nowrap tabular-nums">
            {percent}% <span className="font-normal text-emerald-100 hidden sm:inline">completado</span>
          </span>
        </div>
      </div>

      {modulos && modulos.length > 1 && (
        <nav aria-label="Pasos" className="flex flex-col sm:flex-row gap-2 sm:gap-0">
          {modulos.map((m, i) => {
            const isActive = m.id === activeModule
            return (
              <button
                key={m.id}
                type="button"
                onClick={() => onChangeModule(m.id)}
                aria-current={isActive ? 'step' : undefined}
                className={`module-pill ${isActive ? 'active' : ''}`}
              >
                <span className="num" aria-hidden="true">{i + 1}</span>
                <span className="min-w-0 flex flex-col leading-tight">
                  <span className="text-xs uppercase tracking-wider font-bold truncate">{m.label}</span>
                  <span className="text-xs sm:text-sm truncate opacity-90">{m.subtitle}</span>
                </span>
              </button>
            )
          })}
        </nav>
      )}
    </header>
  )
}
