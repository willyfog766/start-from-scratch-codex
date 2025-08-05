import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import ItemSkeleton from '../components/ItemSkeleton';

export default function Item() {
  const { id } = useParams();
  const { data, isLoading, error } = useQuery(
    ['item', id],
    async () => {
      const res = await axios.get(`/items/${id}`);
      return res.data as { time: number; buyPrice: number; sellPrice: number }[];
    },
    { enabled: !!id }
  );

  if (isLoading) return <ItemSkeleton />;
  if (error) return <div>Error loading item.</div>;
  if (!data || data.length === 0) return <div>No data for {id}</div>;

  return (
    <div>
      <h1 className="text-xl font-bold mb-2">{id}</h1>
      <ul className="space-y-1">
        {data.slice(-10).map((point) => (
          <li key={point.time} className="text-sm">
            {new Date(point.time).toLocaleTimeString()}: {point.buyPrice.toFixed(1)}
          </li>
        ))}
      </ul>
    </div>
  );
}
