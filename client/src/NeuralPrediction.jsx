import { useEffect, useState } from 'react';

export default function NeuralPrediction({ itemId }) {
  const [prediction, setPrediction] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    let mounted = true;
    const fetchPrediction = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(`/api/items/${itemId}/neural-prediction`);
        if (!res.ok) throw new Error('Network response was not ok');
        const data = await res.json();
        if (mounted) setPrediction(data.predictedPrice);
      } catch (err) {
        if (mounted) setError(err.message);
      } finally {
        if (mounted) setLoading(false);
      }
    };
    fetchPrediction();
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

  if (prediction == null) {
    return <div>No prediction available</div>;
  }

  return <div>Prediction: {prediction.toFixed(2)}</div>;
}
