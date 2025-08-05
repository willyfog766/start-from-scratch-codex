import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { Line } from 'react-chartjs-2';
import 'chart.js/auto';

interface HistoryPoint {
  time: number;
  buyPrice: number;
}

interface PredictionInfo {
  predictedPrice: number;
  interval: { low: number; high: number };
}

export default function NeuralPrediction() {
  const { id } = useParams<{ id: string }>();

  const { data: history, isLoading: hLoading } = useQuery<HistoryPoint[]>(
    ['history', id],
    async () => {
      const res = await axios.get(`/items/${id}`);
      return res.data;
    },
    { enabled: !!id }
  );

  const { data: prediction, isLoading: pLoading } = useQuery<PredictionInfo>(
    ['prediction', id],
    async () => {
      const res = await axios.get(`/items/${id}/neural-prediction`);
      return res.data;
    },
    { enabled: !!id }
  );

  if (!id) return <div>No item selected</div>;
  if (hLoading || pLoading) return <div>Loading...</div>;
  if (!history || history.length === 0) return <div>No data for {id}</div>;
  if (!prediction || prediction.predictedPrice == null)
    return <div>No prediction available</div>;

  const labels = history.map((h) => new Date(h.time).toLocaleTimeString());
  labels.push('Prediction');

  const baseNulls = Array(Math.max(history.length - 1, 0)).fill(null);
  const last = history[history.length - 1].buyPrice;
  const predicted = [...baseNulls, last, prediction.predictedPrice];
  const upper = [...baseNulls, last, prediction.interval.high];
  const lower = [...baseNulls, last, prediction.interval.low];

  const chartData = {
    labels,
    datasets: [
      {
        label: 'Buy Price',
        data: history.map((h) => h.buyPrice),
        borderColor: 'rgb(75,192,192)',
        fill: false,
      },
      {
        label: 'Upper Interval',
        data: upper,
        borderColor: 'rgba(75,192,192,0)',
        backgroundColor: 'rgba(75,192,192,0.2)',
        pointRadius: 0,
        fill: false,
      },
      {
        label: 'Lower Interval',
        data: lower,
        borderColor: 'rgba(75,192,192,0)',
        backgroundColor: 'rgba(75,192,192,0.2)',
        pointRadius: 0,
        fill: '-1',
      },
      {
        label: 'Prediction',
        data: predicted,
        borderColor: 'rgb(75,192,192)',
        fill: false,
      },
    ],
  };

  return (
    <div>
      <h1 className="text-xl font-bold mb-2">{id}</h1>
      <Line data={chartData} />
    </div>
  );
}
