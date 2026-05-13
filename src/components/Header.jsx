import { useDiagnostico } from '../state/DiagnosticoContext.jsx'
import { descargarReporte } from '../utils/descargarReporte.js'

export default function Header() {
  const { promedios, hallazgos, foda, cruces, puntos } = useDiagnostico()
  const onDownload = () =>
    descargarReporte({ promedios, hallazgos, foda, cruces, puntos })

  return (
    <header className="bg-emerald-900 text-white p-8 mb-10 shadow-xl flex justify-between items-center">
      <div>
        <h1 className="text-4xl font-black mb-2">Diagnóstico Digital</h1>
        <p className="text-emerald-100 text-lg">Módulo 1: Línea Base de Madurez para la Agricultura Familiar</p>
      </div>
      <button
        onClick={onDownload}
        className="bg-white text-emerald-900 px-6 py-3 font-bold hover:bg-emerald-50 transition shadow-lg flex items-center gap-2"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M12 3v12" />
          <path d="m7 10 5 5 5-5" />
          <path d="M5 21h14" />
        </svg>
        Descargar Resultados
      </button>
    </header>
  )
}
