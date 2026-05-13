const TABS = [
  { id: 'niveles', label: '1. Niveles Clave' },
  { id: 'analisis', label: '2. Análisis Cualitativo' },
  { id: 'foda', label: '3. FODA' },
  { id: 'embudo', label: '4. Puntos críticos' },
]

export default function TabsNav({ activeTab, onChange }) {
  return (
    <nav className="flex border-b-2 border-slate-200 mb-6 sm:mb-8 overflow-x-auto bg-white sticky top-0 z-50 shadow-sm scrollbar-thin">
      {TABS.map((t) => (
        <button
          key={t.id}
          onClick={() => onChange(t.id)}
          className={`tab-button px-3 py-3 sm:px-6 sm:py-5 text-xs sm:text-base uppercase tracking-wide sm:tracking-widest transition-all whitespace-nowrap ${activeTab === t.id ? 'active' : ''}`}
        >
          {t.label}
        </button>
      ))}
    </nav>
  )
}
