import { useEffect } from 'react'

export default function ConfirmResetDialog({ onConfirm, onCancel }) {
  useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') onCancel() }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [onCancel])

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="confirm-reset-title"
      aria-describedby="confirm-reset-desc"
      className="fixed inset-0 z-[110] flex items-center justify-center p-4 sm:p-6 bg-slate-900/70"
      onClick={(e) => { if (e.target === e.currentTarget) onCancel() }}
    >
      <div className="bg-white shadow-2xl max-w-md w-full p-6 sm:p-8 border-l-8 border-amber-500">
        <div className="flex items-start gap-3 sm:gap-4 mb-4 sm:mb-6">
          <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8 sm:w-10 sm:h-10 text-amber-500 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
            <path d="M12 9v4" />
            <path d="M12 17h.01" />
          </svg>
          <div className="min-w-0">
            <h2 id="confirm-reset-title" className="text-xl sm:text-2xl font-black text-slate-900">
              ¿Comenzar desde cero?
            </h2>
            <p id="confirm-reset-desc" className="text-sm sm:text-base text-slate-700 mt-2 leading-relaxed">
              Al confirmar, todas las respuestas y resultados guardados se eliminarán de forma permanente. Esta acción no se puede deshacer.
            </p>
          </div>
        </div>
        <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-3">
          <button
            type="button"
            onClick={onCancel}
            autoFocus
            className="bg-white border-2 border-slate-300 text-slate-700 px-5 py-3 font-bold hover:bg-slate-50 transition min-h-[44px]"
          >
            No, volver
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="bg-rose-600 text-white px-5 py-3 font-bold hover:bg-rose-700 transition shadow-md min-h-[44px]"
          >
            Sí, comenzar de nuevo
          </button>
        </div>
      </div>
    </div>
  )
}
