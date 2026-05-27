export default function TabsNav({ moduloActivo, activeStep, onChangeStep }) {
  if (!moduloActivo) return null

  return (
    <aside className="w-full lg:w-60 xl:w-64 lg:shrink-0 lg:self-start sticky top-0 lg:top-4 z-40 bg-white shadow-sm">
      <nav
        aria-label={`Ejercicios de ${moduloActivo.subtitle}`}
        className="tabs-vertical flex border-b-2 lg:border-b-0 border-slate-200 overflow-x-auto lg:overflow-x-visible scrollbar-thin"
      >
        {moduloActivo.steps.map((s) => (
          <button
            key={s.id}
            type="button"
            onClick={() => onChangeStep(s.id)}
            className={`tab-button px-3 py-3 sm:px-6 sm:py-5 lg:px-5 lg:py-4 text-xs sm:text-base lg:text-sm uppercase tracking-wide sm:tracking-widest lg:tracking-wider transition-all whitespace-nowrap ${activeStep === s.id ? 'active' : ''}`}
          >
            {s.label}
          </button>
        ))}
      </nav>
    </aside>
  )
}
