import { useState, useEffect } from 'react'
import { Paper, Typography } from '@mui/material'

function ItemData({ itemId }) {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!itemId) return
    const fetchData = async () => {
      setLoading(true)
      setError(null)
      try {
        const res = await fetch(`http://localhost:3001/api/items/${itemId}/full`)
        if (!res.ok) throw new Error('Network response was not ok')
        const json = await res.json()
        setData(json)
      } catch (err) {
        setError(err.message)
        setData(null)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [itemId])

  if (!itemId) return null
  if (loading) return <Typography>Loading item data...</Typography>
  if (error) return <Typography color="error">Error loading item data: {error}</Typography>

  return (
    <Paper sx={{ p: 2, mt: 2 }}>
      <Typography variant="h6" gutterBottom>
        Item Data
      </Typography>
      <pre style={{ whiteSpace: 'pre-wrap' }}>
        {JSON.stringify(data, null, 2)}
      </pre>
    </Paper>
  )
}

export default ItemData
