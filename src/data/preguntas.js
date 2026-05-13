export const DIMENSIONES = [
  {
    key: 'd1',
    titulo: 'Tecnología y Conectividad',
    colorTone: 'emerald',
    promedioId: 'tec',
    preguntas: [
      { id: 'd1_q1', label: '1.1 Equipamiento e Infraestructura Física' },
      { id: 'd1_q2', label: '1.2 Conectividad y Acceso a Internet' },
      { id: 'd1_q3', label: '1.3 Sistemas de Gestión (Software)' },
      { id: 'd1_q4', label: '1.4 Integración de Sistemas', dependsOn: { id: 'd1_q3', minValue: 1 } },
    ],
  },
  {
    key: 'd2',
    titulo: 'Procesos y Operaciones',
    colorTone: 'blue',
    promedioId: 'pro',
    preguntas: [
      { id: 'd2_q1', label: '2.1 Documentación y Estandarización' },
      { id: 'd2_q2', label: '2.2 Eficiencia y Reducción de Reprocesos' },
      { id: 'd2_q3', label: '2.3 Digitalización de Servicios al Socio' },
    ],
  },
  {
    key: 'd3',
    titulo: 'Personas y Competencias',
    colorTone: 'amber',
    promedioId: 'per',
    preguntas: [
      { id: 'd3_q1', label: '3.1 Habilidades Digitales del Equipo' },
      { id: 'd3_q2', label: '3.2 Distribución del Conocimiento' },
      { id: 'd3_q3', label: '3.3 Adopción Digital en la Base Asociativa' },
    ],
  },
  {
    key: 'd4',
    titulo: 'Cultura y Gobernanza',
    colorTone: 'rose',
    promedioId: 'cul',
    preguntas: [
      { id: 'd4_q1', label: '4.1 Apertura al Cambio y Tolerancia al Error' },
      { id: 'd4_q2', label: '4.2 Transparencia y Flujo de Información' },
      { id: 'd4_q3', label: '4.3 Ciberseguridad Básica' },
      { id: 'd4_q4', label: '4.4 Visión Estratégica del Liderazgo' },
    ],
  },
]

export function calcularPromedio(respuestas, ids) {
  let sum = 0, count = 0
  ids.forEach((id) => {
    const v = respuestas[id]
    if (v !== undefined && v !== null && v !== '') {
      sum += parseInt(v, 10)
      count++
    }
  })
  return count > 0 ? sum / count : 1
}

export function promediosDimensiones(respuestas) {
  return DIMENSIONES.reduce((acc, dim) => {
    let ids = dim.preguntas.map((p) => p.id)
    // Respeta dependencia: si la dependencia no se cumple, esa pregunta no cuenta.
    ids = ids.filter((id) => {
      const preg = dim.preguntas.find((p) => p.id === id)
      if (!preg.dependsOn) return true
      const depVal = respuestas[preg.dependsOn.id]
      return depVal !== undefined && depVal !== '' && parseInt(depVal, 10) >= preg.dependsOn.minValue
    })
    acc[dim.promedioId] = calcularPromedio(respuestas, ids)
    return acc
  }, {})
}
