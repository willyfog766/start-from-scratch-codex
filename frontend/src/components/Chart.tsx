import {
  Chart as ChartJS,
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale,
} from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(LineElement, PointElement, CategoryScale, LinearScale);

interface Point {
  time: number;
  buyPrice: number;
  sellPrice: number;
}

export function Chart({ data }: { data?: Point[] }) {
  if (!data) return null;
  const chartData = {
    labels: data.map((d) => new Date(d.time).toLocaleTimeString()),
    datasets: [
      {
        label: 'Buy Price',
        data: data.map((d) => d.buyPrice),
        borderColor: 'rgb(75, 192, 192)',
        fill: false,
      },
      {
        label: 'Sell Price',
        data: data.map((d) => d.sellPrice),
        borderColor: 'rgb(255, 99, 132)',
        fill: false,
      },
    ],
  };
  return <Line data={chartData} />;
}
