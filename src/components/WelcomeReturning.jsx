export default function WelcomeReturning({ onContinue, onRestart, fadingOut = false }) {
  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="welcome-returning-title"
      className={`fixed inset-0 z-[100] flex items-center justify-center p-6 sm:p-10 text-white transition-opacity duration-500 ${fadingOut ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}
      style={{ backgroundColor: '#083E70' }}
    >
      <div className="max-w-2xl text-center space-y-6 sm:space-y-8">
        <h1 id="welcome-returning-title" className="text-3xl sm:text-5xl font-black leading-tight">
          ¡Bienvenid@ nuevamente!
        </h1>
        <p className="text-base sm:text-xl leading-relaxed text-blue-50">
          Hemos detectado que ya has comenzado el diagnóstico con anterioridad. ¿Quieres continuar respondiendo donde lo dejaste o deseas comenzar nuevamente desde cero?
        </p>
        <div className="flex flex-col-reverse sm:flex-row gap-3 sm:gap-4 justify-center pt-2">
          <button
            type="button"
            onClick={onRestart}
            disabled={fadingOut}
            className="inline-flex items-center justify-center bg-transparent border-2 border-white text-white px-6 py-4 text-base sm:text-lg font-black uppercase tracking-widest hover:bg-white/10 transition min-h-[56px] disabled:opacity-60 disabled:cursor-not-allowed"
          >
            Comenzar nuevamente
          </button>
          <button
            type="button"
            onClick={onContinue}
            disabled={fadingOut}
            autoFocus
            className="inline-flex items-center justify-center gap-2 bg-white text-[#083E70] px-8 py-4 text-base sm:text-lg font-black uppercase tracking-widest hover:bg-blue-50 transition shadow-2xl min-h-[56px] disabled:opacity-60 disabled:cursor-not-allowed"
          >
            Continuar
            <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M5 12h14" />
              <path d="m12 5 7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  )
}
