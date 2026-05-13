import { Radar } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend,
} from 'chart.js'

ChartJS.register(RadialLinearScale, PointElement, LineElement, Filler, Tooltip, Legend)

export default function RadarMadurez({ promedios }) {
  const data = {
    labels: ['Tecnología', 'Procesos', 'Personas', 'Cultura'],
    datasets: [{
      data: [promedios.tec, promedios.pro, promedios.per, promedios.cul],
      backgroundColor: 'rgba(0, 156, 143, 0.25)',
      borderColor: '#009C8F',
      borderWidth: 4,
      pointBackgroundColor: '#083E70',
      pointRadius: 6,
    }],
  }
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      r: {
        min: 0, max: 5,
        ticks: { stepSize: 1, font: { size: 14 } },
        pointLabels: { font: { size: 16, weight: 'bold' } },
      },
    },
    plugins: { legend: { display: false } },
  }
  return (
    <div style={{ width: '100%', maxWidth: 500, height: 450 }}>
      <Radar data={data} options={options} />
    </div>
  )
}
