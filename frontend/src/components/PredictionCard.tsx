import { useQuery } from '@tanstack/react-query';

export function PredictionCard({ itemId }: { itemId: string }) {
  const { data } = useQuery({
    queryKey: ['prediction', itemId],
    queryFn: async () => {
      const [price, volatility] = await Promise.all([
        fetch(`/api/items/${itemId}/neural-prediction`).then((r) => r.json()),
        fetch(`/api/items/${itemId}/volatility-prediction`).then((r) => r.json()),
      ]);
      return { price, volatility };
    },
    enabled: !!itemId,
  });

  if (!data) return null;

  return (
    <div className="rounded-lg border p-4 bg-surface">
      <h3 className="text-lg font-semibold mb-4">Predictions</h3>

      <div className="space-y-4">
        <div>
          <div className="text-sm text-gray-500">Price</div>
          <div className="text-2xl font-bold">
            {data.price.predictedPrice.toFixed(2)}
          </div>
          <div className="text-sm">
            Confidence: {(data.price.confidence * 100).toFixed(1)}%
          </div>
        </div>

        <div>
          <div className="text-sm text-gray-500">Volatility</div>
          <div className="text-2xl font-bold">
            {data.volatility.predictedVolatility.toFixed(2)}
          </div>
        </div>
      </div>
    </div>
  );
}
