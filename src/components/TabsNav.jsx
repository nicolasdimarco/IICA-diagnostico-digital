export default function TabsNav({ moduloActivo, activeStep, onChangeStep }) {
  if (!moduloActivo) return null

  return (
    <nav
      aria-label={`Ejercicios de ${moduloActivo.subtitle}`}
      className="flex flex-col sm:flex-row gap-2 sm:gap-0 mb-4 sm:mb-6"
    >
      {moduloActivo.steps.map((s, i) => {
        const isActive = activeStep === s.id
        return (
          <button
            key={s.id}
            type="button"
            onClick={() => onChangeStep(s.id)}
            aria-current={isActive ? 'step' : undefined}
            className={`step-pill ${isActive ? 'active' : ''}`}
          >
            <span className="num" aria-hidden="true">{i + 1}</span>
            <span className="text-xs sm:text-sm uppercase tracking-wider font-bold truncate">
              {s.label}
            </span>
          </button>
        )
      })}
    </nav>
  )
}
