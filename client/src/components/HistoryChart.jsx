import { Line } from 'react-chartjs-2'
import 'chart.js/auto'
import { Paper, Typography, Box } from '@mui/material'

function HistoryChart({ history, selectedItem }) {
  if (!selectedItem) return null

  const chartData = {
    labels: history.map((h) => new Date(h.time).toLocaleTimeString()),
    datasets: [
      {
        label: 'Buy Price',
        data: history.map((h) => h.buyPrice),
        borderColor: 'rgb(75,192,192)',
        fill: false,
      },
      {
        label: 'Sell Price',
        data: history.map((h) => h.sellPrice),
        borderColor: 'rgb(192,75,75)',
        fill: false,
      },
    ],
  }

  return (
    <Paper sx={{ p: 2 }}>
      <Typography variant="h6" align="center" gutterBottom>
        {selectedItem}
      </Typography>
      <Box height={400}>
        <Line data={chartData} />
      </Box>
    </Paper>
  )
}

export default HistoryChart
