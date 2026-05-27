import TabNiveles from '../../tabs/TabNiveles.jsx'
import TabAnalisis from '../../tabs/TabAnalisis.jsx'
import TabFoda from '../../tabs/TabFoda.jsx'
import TabEmbudo from '../../tabs/TabEmbudo.jsx'
import { exportarModulo1 } from './export.js'
import { progressNiveles, progressAnalisis, progressFoda, progressEmbudo } from './progress.js'

export const modulo1 = {
  id: 'm1',
  label: 'Paso 1',
  subtitle: 'Línea Base de Madurez',
  steps: [
    { id: 'niveles',  label: '1.1 Niveles Clave',         Component: TabNiveles,  progress: progressNiveles },
    { id: 'analisis', label: '1.2 Análisis Cualitativo',  Component: TabAnalisis, progress: progressAnalisis },
    { id: 'foda',     label: '1.3 FODA',                  Component: TabFoda,     progress: progressFoda },
    { id: 'embudo',   label: '1.4 Puntos Críticos',       Component: TabEmbudo,   progress: progressEmbudo },
  ],
  exportSection: exportarModulo1,
}
