import { useState } from 'react'
import Header from './components/Header.jsx'
import TabsNav from './components/TabsNav.jsx'
import Welcome from './components/Welcome.jsx'
import WelcomeReturning from './components/WelcomeReturning.jsx'
import ConfirmResetDialog from './components/ConfirmResetDialog.jsx'
import { useDiagnostico } from './state/DiagnosticoContext.jsx'
import { readSnapshot, hasProgress } from './state/storage.js'
import { MODULOS, buscarModulo, buscarStep } from './modules/index.js'

export default function App() {
  const { resetAll } = useDiagnostico()
  const [moduleId, setModuleId] = useState(MODULOS[0].id)
  const [stepId, setStepId] = useState(MODULOS[0].steps[0].id)
  const [started, setStarted] = useState(false)
  const [showWelcome, setShowWelcome] = useState(true)
  // 'first' (primera visita o post-reset) | 'returning' (snapshot con progreso detectado)
  const [welcomeMode, setWelcomeMode] = useState(() =>
    hasProgress(readSnapshot()) ? 'returning' : 'first',
  )
  const [showConfirmReset, setShowConfirmReset] = useState(false)

  const onChangeModule = (id) => {
    const m = buscarModulo(id)
    setModuleId(m.id)
    setStepId(m.steps[0].id)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const onChangeStep = (id) => {
    setStepId(id)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const dismissWelcome = () => {
    setStarted(true)
    setTimeout(() => setShowWelcome(false), 600)
  }

  const onRestart = () => setShowConfirmReset(true)
  const onCancelReset = () => setShowConfirmReset(false)
  const onConfirmReset = () => {
    resetAll()
    setShowConfirmReset(false)
    setWelcomeMode('first')
    setModuleId(MODULOS[0].id)
    setStepId(MODULOS[0].steps[0].id)
  }

  const moduloActivo = buscarModulo(moduleId)
  const StepComponent = buscarStep(moduleId, stepId).Component

  return (
    <div className="bg-slate-50 text-slate-900 font-sans antialiased min-h-screen">
      <div
        className={`w-full px-3 sm:px-6 lg:px-10 py-3 sm:py-6 lg:py-10 transition-opacity duration-500 ${started ? 'opacity-100' : 'opacity-0'}`}
        aria-hidden={!started}
      >
        <Header
          modulos={MODULOS}
          activeModule={moduleId}
          onChangeModule={onChangeModule}
        />
        <TabsNav
          moduloActivo={moduloActivo}
          activeStep={stepId}
          onChangeStep={onChangeStep}
        />
        <main className="min-w-0">
          <StepComponent />
        </main>
      </div>
      {showWelcome && welcomeMode === 'first' && (
        <Welcome onStart={dismissWelcome} fadingOut={started} />
      )}
      {showWelcome && welcomeMode === 'returning' && (
        <WelcomeReturning
          onContinue={dismissWelcome}
          onRestart={onRestart}
          fadingOut={started}
        />
      )}
      {showConfirmReset && (
        <ConfirmResetDialog onConfirm={onConfirmReset} onCancel={onCancelReset} />
      )}
    </div>
  )
}
