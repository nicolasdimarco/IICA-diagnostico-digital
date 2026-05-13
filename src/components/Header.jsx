import { useDiagnostico } from '../state/DiagnosticoContext.jsx'
import { descargarReporte } from '../utils/descargarReporte.js'

export default function Header() {
  const { promedios, hallazgos, foda, cruces, puntos } = useDiagnostico()
  const onDownload = () =>
    descargarReporte({ promedios, hallazgos, foda, cruces, puntos })

  return (
    <header className="bg-emerald-900 text-white p-5 sm:p-8 mb-6 sm:mb-10 shadow-xl flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
      <div className="min-w-0">
        <h1 className="text-2xl sm:text-4xl font-black mb-1 sm:mb-2">Diagnóstico Digital</h1>
        <p className="text-emerald-100 text-sm sm:text-lg">Módulo 1: Línea Base de Madurez para la Agricultura Familiar</p>
      </div>
      <button
        onClick={onDownload}
        className="bg-white text-emerald-900 px-5 py-3 font-bold hover:bg-emerald-50 transition shadow-lg flex items-center justify-center gap-2 w-full sm:w-auto shrink-0"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M12 3v12" />
          <path d="m7 10 5 5 5-5" />
          <path d="M5 21h14" />
        </svg>
        <span className="sm:hidden">Descargar</span>
        <span className="hidden sm:inline">Descargar Resultados</span>
      </button>
    </header>
  )
}
