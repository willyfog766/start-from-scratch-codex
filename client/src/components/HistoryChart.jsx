import { useMemo } from 'react'
import { Line } from 'react-chartjs-2'
import 'chart.js/auto'
import { useTheme } from '@mui/material/styles'

function HistoryChart({ history }) {
  const theme = useTheme()

  const data = useMemo(
    () => ({
      labels: history.map((h) => new Date(h.time).toLocaleTimeString()),
      datasets: [
        {
          label: 'Buy Price',
          data: history.map((h) => h.buyPrice),
          borderColor: theme.palette.primary.main,
          backgroundColor: theme.palette.primary.light,
          fill: false,
        },
        {
          label: 'Sell Price',
          data: history.map((h) => h.sellPrice),
          borderColor: theme.palette.error.main,
          backgroundColor: theme.palette.error.light,
          fill: false,
        },
      ],
    }),
    [history, theme]
  )

  const options = useMemo(
    () => ({
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        tooltip: {
          mode: 'index',
          intersect: false,
        },
        legend: {
          labels: {
            color: theme.palette.text.primary,
            font: {
              family: theme.typography.fontFamily,
            },
          },
        },
      },
      scales: {
        x: {
          ticks: {
            color: theme.palette.text.secondary,
            font: {
              family: theme.typography.fontFamily,
            },
          },
          grid: {
            color: theme.palette.divider,
          },
        },
        y: {
          ticks: {
            color: theme.palette.text.secondary,
            font: {
              family: theme.typography.fontFamily,
            },
          },
          grid: {
            color: theme.palette.divider,
          },
        },
      },
    }),
    [theme]
  )

  return <Line data={data} options={options} />
}

export default HistoryChart

