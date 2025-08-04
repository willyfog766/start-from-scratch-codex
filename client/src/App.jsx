import { useState, useEffect } from 'react';
import { Line } from 'react-chartjs-2';
import 'chart.js/auto';
import './App.css';

function App() {
  const [itemId, setItemId] = useState('ENCHANTED_COBBLESTONE');
  const [data, setData] = useState([]);
  const [prediction, setPrediction] = useState(null);

  const fetchData = async () => {
    const res = await fetch(`http://localhost:3001/api/items/${itemId}`);
    const json = await res.json();
    setData(json);
    const predRes = await fetch(`http://localhost:3001/api/items/${itemId}/prediction`);
    const predJson = await predRes.json();
    setPrediction(predJson);
  };

  useEffect(() => {
    fetchData();
    const id = setInterval(fetchData, 60000);
    return () => clearInterval(id);
  }, [itemId]);

  const chartData = {
    labels: data.map(d => new Date(d.time).toLocaleTimeString()),
    datasets: [
      {
        label: 'Buy Price',
        data: data.map(d => d.price),
        borderColor: 'rgb(75,192,192)',
        fill: false,
      },
    ],
  };

  return (
    <div className="App">
      <h1>Bazaar Tracker</h1>
      <input value={itemId} onChange={e => setItemId(e.target.value.toUpperCase())} />
      <button onClick={fetchData}>Load</button>
      <div style={{height: '400px'}}>
        <Line data={chartData} />
      </div>
      {prediction && prediction.predictedPrice && (
        <p>
          Predicted next peak: {prediction.predictedPrice.toFixed(2)} at{' '}
          {new Date(prediction.predictedTime).toLocaleTimeString()}
        </p>
      )}
    </div>
  );
}

export default App;
