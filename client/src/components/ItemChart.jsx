import { Card, Typography, Box, useTheme } from '@mui/material'
import { Line } from 'react-chartjs-2'
import 'chart.js/auto'
import NeuralPrediction from '../NeuralPrediction'

function ItemChart({ selectedItem, history, sx = {} }) {
  const theme = useTheme()
  if (!selectedItem) return null

  const chartData = {
    labels: history.map((h) => new Date(h.time).toLocaleTimeString()),
    datasets: [
      {
        label: 'Buy Price',
        data: history.map((h) => h.buyPrice),
        borderColor: theme.palette.success.main,
        fill: false,
      },
      {
        label: 'Sell Price',
        data: history.map((h) => h.sellPrice),
        borderColor: theme.palette.error.main,
        fill: false,
      },
    ],
  }

  return (
    <Card sx={{ p: 2, ...sx }}>
      <Typography variant="h6" align="center" gutterBottom>
        {selectedItem}
      </Typography>
      <Box height={400}>
        <Line data={chartData} />
      </Box>
      <Box mt={2}>
        <NeuralPrediction itemId={selectedItem} />
      </Box>
    </Card>
  )
}

export default ItemChart
