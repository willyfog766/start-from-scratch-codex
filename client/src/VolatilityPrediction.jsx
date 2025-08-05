import { useEffect, useState } from 'react';

export default function VolatilityPrediction({ itemId }) {
  const [volatility, setVolatility] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    let mounted = true;
    const fetchVolatility = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(`/api/items/${itemId}/volatility-prediction`);
        if (!res.ok) throw new Error('Network response was not ok');
        const data = await res.json();
        if (mounted) setVolatility(data.predictedVolatility);
      } catch (err) {
        if (mounted) setError(err.message);
      } finally {
        if (mounted) setLoading(false);
      }
    };
    fetchVolatility();
    return () => {
      mounted = false;
    };
  }, [itemId]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (volatility == null) {
    return <div>No prediction available</div>;
  }

  return <div>Volatility: {volatility.toFixed(2)}</div>;
}
