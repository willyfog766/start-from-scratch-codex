import { useEffect, useState } from 'react';

export default function NeuralPrediction({ itemId }) {
  const [prediction, setPrediction] = useState(null);

  useEffect(() => {
    let mounted = true;
    fetch(`/api/items/${itemId}/neural-prediction`)
      .then((res) => res.json())
      .then((data) => {
        if (mounted) setPrediction(data.predictedPrice);
      });
    return () => {
      mounted = false;
    };
  }, [itemId]);

  if (prediction == null) {
    return <div>Loading...</div>;
  }

  return <div>Prediction: {prediction.toFixed(2)}</div>;
}
