import StepVision from './StepVision.jsx'
import StepMatriz from './StepMatriz.jsx'
import StepSmart from './StepSmart.jsx'
import StepGobernanza from './StepGobernanza.jsx'
import { exportarModulo2 } from './export.js'
import { progressVision, progressMatriz, progressSmart, progressGobernanza } from './progress.js'

export const modulo2 = {
  id: 'm2',
  label: 'Paso 2',
  subtitle: 'Estrategia Digital',
  steps: [
    { id: 'vision',      label: '2.1 Visión Digital',     Component: StepVision,      progress: progressVision },
    { id: 'matriz',      label: '2.2 Matriz I/E',         Component: StepMatriz,      progress: progressMatriz },
    { id: 'smart',       label: '2.3 SMART',              Component: StepSmart,       progress: progressSmart },
    { id: 'gobernanza',  label: '2.4 Gobernanza',         Component: StepGobernanza,  progress: progressGobernanza },
  ],
  exportSection: exportarModulo2,
}
