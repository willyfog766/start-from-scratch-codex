import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import VariationListSkeleton from '../components/VariationListSkeleton';

interface Variation {
  id: string;
  variation: number;
}

export default function Analytics() {
  const { data, isLoading, error } = useQuery<Variation[]>([
    'variations',
  ], async () => {
    const res = await axios.get('/variations?timeframe=1h');
    return res.data;
  });

  if (isLoading) return <VariationListSkeleton />;
  if (error) return <div>Error loading analytics.</div>;

  return (
    <div className="space-y-2">
      {data?.slice(0, 10).map((v) => (
        <div key={v.id} className="flex justify-between border-b pb-1">
          <span>{v.id}</span>
          <span className={v.variation >= 0 ? 'text-green-600' : 'text-red-600'}>
            {v.variation.toFixed(1)}
          </span>
        </div>
      ))}
    </div>
  );
}
