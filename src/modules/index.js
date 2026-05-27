import { modulo1 } from './modulo1/index.js'
import { modulo2 } from './modulo2/index.js'

export const MODULOS = [modulo1, modulo2]

export function buscarModulo(moduleId) {
  return MODULOS.find((m) => m.id === moduleId) || MODULOS[0]
}

export function buscarStep(moduleId, stepId) {
  const m = buscarModulo(moduleId)
  return m.steps.find((s) => s.id === stepId) || m.steps[0]
}
