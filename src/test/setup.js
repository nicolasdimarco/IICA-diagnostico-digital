import '@testing-library/jest-dom/vitest'
import { beforeEach } from 'vitest'

// Evita filtraciones de estado entre tests cuando el provider persiste en localStorage.
beforeEach(() => {
  try { window.localStorage.clear() } catch { /* noop */ }
})
