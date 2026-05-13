export default function TablaPromedios({ promedios }) {
  const filas = [
    { label: 'Tecnología y Conectividad', val: promedios.tec, cls: 'bg-emerald-50 text-emerald-900', border: 'border-emerald-100' },
    { label: 'Procesos y Operaciones',   val: promedios.pro, cls: 'bg-blue-50 text-blue-900',       border: 'border-blue-100' },
    { label: 'Personas y Competencias',  val: promedios.per, cls: 'bg-amber-50 text-amber-900',     border: 'border-amber-100' },
    { label: 'Cultura y Gobernanza',     val: promedios.cul, cls: 'bg-rose-50 text-rose-900',       border: '' },
  ]
  return (
    <table className="w-full text-left border-collapse overflow-hidden shadow-sm">
      <thead>
        <tr className="bg-emerald-900 text-white uppercase text-sm tracking-widest">
          <th className="p-5">Dimensión Clave</th>
          <th className="p-5 text-center">Promedio</th>
        </tr>
      </thead>
      <tbody className="text-lg font-medium">
        {filas.map((f, i) => (
          <tr key={i} className={f.cls}>
            <td className={`p-5 ${f.border ? 'border-b ' + f.border : ''}`}>{f.label}</td>
            <td className="p-5 text-center font-black">{f.val.toFixed(2)}</td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}
