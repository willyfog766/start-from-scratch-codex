import { useEffect, useState } from 'react'

export default function NeuralPrediction({ itemId }) {
  const [info, setInfo] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!itemId || typeof itemId !== 'string') {
      setError('Invalid item ID')
      setInfo(null)
      return
    }
    let mounted = true
    const fetchPrediction = async () => {
      setLoading(true)
      setError(null)
      try {
        const res = await fetch(
          `/api/items/${encodeURIComponent(itemId)}/neural-prediction`
        )
        if (!res.ok) {
          let message = 'Failed to load prediction'
          if (res.status === 404) message = 'Prediction not found'
          throw new Error(message)
        }
        const data = await res.json()
        if (mounted) setInfo(data)
      } catch (err) {
        if (mounted) setError(err.message || 'Unknown error')
      } finally {
        if (mounted) setLoading(false)
      }
    }
    fetchPrediction()
    return () => {
      mounted = false
    }
  }, [itemId])

  if (!itemId) {
    return <div>No item selected</div>
  }

  if (loading) {
    return <div>Loading...</div>
  }

  if (error) {
    return <div>Error: {error}</div>
  }

  if (!info) {
    return <div>No prediction available</div>
  }

  return (
    <div>
      {info.predictedPrice != null ? (
        <div>Prediction: {info.predictedPrice.toFixed(2)}</div>
      ) : (
        <div>No prediction available</div>
      )}
      {info.normalizedPrediction != null && (
        <div>Normalized: {info.normalizedPrediction.toFixed(4)}</div>
      )}
      <div>Model Exists: {info.modelExists ? 'Yes' : 'No'}</div>
      <div>Trained Now: {info.trained ? 'Yes' : 'No'}</div>
      <div>Data Points: {info.dataPoints}</div>
    </div>
  )
}
