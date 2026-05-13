export const BLOQUES = [
  {
    id: 'b1',
    titulo: 'Bloque 1: Exploración de Procesos',
    color: 'text-emerald-700',
    accent: 'border-emerald-500 bg-emerald-50',
    items: [
      'Si pudiera tener una "varita mágica" para eliminar una tarea, ¿cuál sería y por qué?',
      'En el pico de cosecha, ¿dónde se genera el principal cuello de botella?',
      'Cuando hay un reclamo, ¿cuánto tiempo toma encontrar la información?',
    ],
  },
  {
    id: 'b2',
    titulo: 'Bloque 2: Experiencia Tecnológica',
    color: 'text-blue-700',
    accent: 'border-blue-500 bg-blue-50',
    items: [
      'De los sistemas actuales, ¿cuál es más útil y cuál da más dolores de cabeza?',
      'Si se invirtiera en un nuevo sistema, ¿cuál es su mayor temor?',
      '¿Cuál cree que es la principal barrera para que los socios usen el celular?',
    ],
  },
  {
    id: 'b3',
    titulo: 'Bloque 3: Visión de Futuro y Cultura',
    color: 'text-rose-700',
    accent: 'border-rose-500 bg-rose-50',
    items: [
      'Ante una nueva tecnología, ¿quiénes la apoyarían y quiénes pondrían resistencia?',
      '¿Qué significaría que la cooperativa fuera "más moderna"?',
      '¿Qué es lo mínimo que se debe garantizar antes de exigir el uso de una herramienta?',
    ],
  },
]

export function buscarBloquePorTitulo(titulo) {
  return BLOQUES.find((b) => b.titulo === titulo) || null
}
