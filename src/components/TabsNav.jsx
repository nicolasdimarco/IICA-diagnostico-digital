const TABS = [
  { id: 'niveles', label: '1. Niveles' },
  { id: 'analisis', label: '2. Análisis' },
  { id: 'foda', label: '3. FODA' },
  { id: 'embudo', label: '4. Puntos críticos' },
]

export default function TabsNav({ activeTab, onChange }) {
  return (
    <nav className="flex border-b-2 border-slate-200 mb-8 overflow-x-auto bg-white sticky top-0 z-50 shadow-sm">
      {TABS.map((t) => (
        <button
          key={t.id}
          onClick={() => onChange(t.id)}
          className={`tab-button px-6 py-5 text-base uppercase tracking-widest transition-all whitespace-nowrap ${activeTab === t.id ? 'active' : ''}`}
        >
          {t.label}
        </button>
      ))}
    </nav>
  )
}
