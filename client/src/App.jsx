import { useState, useEffect, useCallback } from 'react'
import { Container, Typography, Box, Tabs, Tab } from '@mui/material'
import './App.css'
import ItemList from './components/ItemList'
import ItemChart from './components/ItemChart'

function App() {
  const [tab, setTab] = useState(0)
  const [items, setItems] = useState([])
  const [selectedItem, setSelectedItem] = useState(null)
  const [history, setHistory] = useState([])
  const [itemsLoading, setItemsLoading] = useState(false)
  const [itemsError, setItemsError] = useState(null)
  const [historyLoading, setHistoryLoading] = useState(false)
  const [historyError, setHistoryError] = useState(null)

  useEffect(() => {
    const fetchItems = async () => {
      setItemsLoading(true)
      setItemsError(null)
      try {
        const res = await fetch('http://localhost:3001/api/items')
        if (!res.ok) throw new Error('Network response was not ok')
        const data = await res.json()
        setItems(data)
        if (data.length > 0) {
          setSelectedItem(data[0].id)
        }
      } catch (err) {
        setItemsError(err.message)
      } finally {
        setItemsLoading(false)
      }
    }
    fetchItems()
  }, [])

  const fetchHistory = useCallback(async (id) => {
    setHistoryLoading(true)
    setHistoryError(null)
    try {
      const res = await fetch(`http://localhost:3001/api/items/${id}`)
      if (!res.ok) throw new Error('Network response was not ok')
      const json = await res.json()
      setHistory(json)
    } catch (err) {
      setHistoryError(err.message)
      setHistory([])
    } finally {
      setHistoryLoading(false)
    }
  }, [])

  useEffect(() => {
    if (selectedItem) {
      fetchHistory(selectedItem)
    }
  }, [selectedItem, fetchHistory])

  const variations = [...items]
    .map((it) => ({
      id: it.id,
      variation:
        (it.quick_status.sellPrice || 0) - (it.quick_status.buyPrice || 0),
    }))
    .sort((a, b) => b.variation - a.variation)
    .slice(0, 10)

  return (
    <Container className="App" maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom align="center">
        Bazaar Tracker
      </Typography>
      {itemsLoading && (
        <Typography align="center">Loading items...</Typography>
      )}
      {itemsError && (
        <Typography align="center" color="error">
          Error loading items: {itemsError}
        </Typography>
      )}
      {!itemsLoading && !itemsError && (
        <>
          <Tabs value={tab} onChange={(e, v) => setTab(v)} centered>
            <Tab label="Top Variation" />
            <Tab label="All Items" />
          </Tabs>
          {tab === 0 && (
            <Box mt={2}>
              <ItemList
                items={variations}
                onItemSelect={(id) => {
                  setSelectedItem(id)
                  setTab(1)
                }}
                getSecondary={(v) => `Variation: ${v.variation.toFixed(2)}`}
              />
            </Box>
          )}
          {tab === 1 && (
            <Box mt={2} display="flex" gap={2}>
              <Box width="30%" maxHeight={400} sx={{ overflowY: 'auto' }}>
                <ItemList
                  items={items}
                  selectedItem={selectedItem}
                  onItemSelect={setSelectedItem}
                  getSecondary={(it) =>
                    `Buy: ${(it.quick_status.buyPrice || 0).toFixed(1)} Sell: ${(it.quick_status.sellPrice || 0).toFixed(1)}`
                  }
                />
              </Box>
              <Box flexGrow={1}>
                {historyError ? (
                  <Typography color="error">
                    Error loading history: {historyError}
                  </Typography>
                ) : historyLoading ? (
                  <Typography>Loading history...</Typography>
                ) : (
                  <ItemChart selectedItem={selectedItem} history={history} />
                )}
              </Box>
            </Box>
          )}
        </>
      )}
    </Container>
  )
}

export default App
