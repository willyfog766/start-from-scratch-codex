import { useState, useEffect, useCallback } from 'react'
import { Line } from 'react-chartjs-2'
import 'chart.js/auto'
import { Container, Typography, TextField, Button, Box, Paper } from '@mui/material'
import './App.css'

function App() {
  const [itemId, setItemId] = useState('ENCHANTED_COBBLESTONE');
  const [data, setData] = useState([]);
  const [prediction, setPrediction] = useState(null);

  const fetchData = useCallback(async () => {
    const res = await fetch(`http://localhost:3001/api/items/${itemId}`);
    const json = await res.json();
    setData(json);
    const predRes = await fetch(`http://localhost:3001/api/items/${itemId}/prediction`);
    const predJson = await predRes.json();
    setPrediction(predJson);
  }, [itemId]);

  useEffect(() => {
    fetchData();
    const id = setInterval(fetchData, 60000);
    return () => clearInterval(id);
  }, [fetchData]);

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
    <Container className="App" maxWidth="md" sx={{ py: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom align="center">
        Bazaar Tracker
      </Typography>
      <Box display="flex" justifyContent="center" gap={2} mb={3}>
        <TextField
          label="Item ID"
          value={itemId}
          onChange={e => setItemId(e.target.value.toUpperCase())}
          size="small"
        />
        <Button variant="contained" onClick={fetchData}>Load</Button>
      </Box>
      <Paper sx={{ p: 2 }}>
        <Box height={400}>
          <Line data={chartData} />
        </Box>
      </Paper>
      {prediction && prediction.predictedPrice && (
        <Box mt={2}>
          <Typography variant="body1" align="center">
            Predicted next peak: {prediction.predictedPrice.toFixed(2)} at{' '}
            {new Date(prediction.predictedTime).toLocaleTimeString()}
          </Typography>
        </Box>
      )}
    </Container>
  )
}

export default App
