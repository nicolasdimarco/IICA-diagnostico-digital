export default function Welcome({ onStart, fadingOut = false }) {
  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="welcome-title"
      className={`fixed inset-0 z-[100] flex items-center justify-center p-6 sm:p-10 text-white transition-opacity duration-500 ${fadingOut ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}
      style={{ backgroundColor: '#083E70' }}
    >
      <div className="max-w-2xl text-center space-y-6 sm:space-y-8">
        <h1 id="welcome-title" className="text-3xl sm:text-5xl font-black leading-tight">
          Bienvenid@ a tu diagnóstico digital
        </h1>
        <p className="text-base sm:text-xl leading-relaxed text-blue-50">
          A lo largo de esta experiencia te encontrarás con diferentes ejercicios, agrupados en pasos. Síguelos en orden para obtener el mejor resultado posible.
        </p>
        <p className="text-lg sm:text-2xl font-bold">¿Estás list@?</p>
        <button
          type="button"
          onClick={onStart}
          disabled={fadingOut}
          autoFocus
          className="inline-flex items-center justify-center gap-2 bg-white text-[#083E70] px-8 py-4 text-lg sm:text-xl font-black uppercase tracking-widest hover:bg-blue-50 transition shadow-2xl min-h-[56px] disabled:opacity-60 disabled:cursor-not-allowed"
        >
          Comencemos
          <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M5 12h14" />
            <path d="m12 5 7 7-7 7" />
          </svg>
        </button>
      </div>
    </div>
  )
}
