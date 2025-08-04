import { useEffect, useState } from 'react'
import { Line } from 'react-chartjs-2'
import 'chart.js/auto'
import './App.css'

const DEFAULT_ITEM = 'ENCHANTED_CARROT_STICK'

function App() {
  const [itemId, setItemId] = useState(DEFAULT_ITEM)
  const [history, setHistory] = useState([])
  const [prediction, setPrediction] = useState(null)

  useEffect(() => {
    const stored = localStorage.getItem(`bazaar_${itemId}`)
    if (stored) {
      setHistory(JSON.parse(stored))
    } else {
      setHistory([])
    }
  }, [itemId])

  useEffect(() => {
    fetchAndStore()
    const interval = setInterval(fetchAndStore, 60000)
    return () => clearInterval(interval)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [itemId])

  function fetchAndStore() {
    fetch('https://api.hypixel.net/v2/skyblock/bazaar')
      .then((r) => r.json())
      .then((json) => {
        const product = json.products[itemId]
        if (!product) {
          return
        }
        const price = product.quick_status.sellPrice
        const point = { time: Date.now(), price }
        const newHistory = [...history, point]
        setHistory(newHistory)
        localStorage.setItem(`bazaar_${itemId}`, JSON.stringify(newHistory))
        setPrediction(predictNextPeak(newHistory))
      })
      .catch((err) => {
        console.error('Failed to fetch bazaar data', err)
      })
  }

  function predictNextPeak(data) {
    if (data.length < 2) return null
    const n = data.length
    let sumX = 0
    let sumY = 0
    let sumXY = 0
    let sumXX = 0
    data.forEach((p, i) => {
      sumX += i
      sumY += p.price
      sumXY += i * p.price
      sumXX += i * i
    })
    const slope = (n * sumXY - sumX * sumY) / (n * sumXX - sumX * sumX)
    const intercept = (sumY - slope * sumX) / n
    const nextX = n
    return slope * nextX + intercept
  }

  const chartData = {
    labels: history.map((p) => new Date(p.time).toLocaleTimeString()),
    datasets: [
      {
        label: 'Sell Price',
        data: history.map((p) => p.price),
        borderColor: 'rgb(75, 192, 192)',
        tension: 0.1,
      },
    ],
  }

  return (
    <div className="App">
      <h1>Hypixel Bazaar Tracker</h1>
      <div className="controls">
        <input
          value={itemId}
          onChange={(e) => setItemId(e.target.value.toUpperCase())}
        />
        <button onClick={fetchAndStore}>Fetch Now</button>
      </div>
      {history.length > 0 && <Line data={chartData} />}
      {prediction && (
        <p className="prediction">
          Next predicted price: {prediction.toFixed(2)}
        </p>
      )}
    </div>
  )
}

export default App
