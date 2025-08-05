import { useState, useEffect, useCallback } from 'react'
import { Container, Typography, Box, Tabs, Tab, Select, MenuItem } from '@mui/material'
import './App.css'
import ItemList from './components/ItemList'
import ItemChart from './components/ItemChart'
import ItemDetails from './components/ItemDetails'

import NeuralPrediction from './NeuralPrediction'

function App() {
  const [tab, setTab] = useState(0)
  const [items, setItems] = useState([])
  const [selectedItem, setSelectedItem] = useState(null)
  const [history, setHistory] = useState([])
  const [itemsLoading, setItemsLoading] = useState(false)
  const [itemsError, setItemsError] = useState(null)
  const [historyLoading, setHistoryLoading] = useState(false)
  const [historyError, setHistoryError] = useState(null)
  const [variationTimeframe, setVariationTimeframe] = useState('1m')
  const [variations, setVariations] = useState([])
  const [variationsLoading, setVariationsLoading] = useState(false)
  const [variationsError, setVariationsError] = useState(null)

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
      const res = await fetch(
        `http://localhost:3001/api/items/${encodeURIComponent(id)}`
      )
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

  useEffect(() => {
    const fetchVariations = async () => {
      setVariationsLoading(true)
      setVariationsError(null)
      try {
        const res = await fetch(
          `http://localhost:3001/api/variations?timeframe=${variationTimeframe}`
        )
        if (!res.ok) throw new Error('Network response was not ok')
        const data = await res.json()
        setVariations(data.slice(0, 10))
      } catch (err) {
        setVariationsError(err.message)
        setVariations([])
      } finally {
        setVariationsLoading(false)
      }
    }
    fetchVariations()
  }, [variationTimeframe])

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
            <Tab label="Neural Tracker" />
          </Tabs>
          {tab === 0 && (
            <Box mt={2}>
              <Box mb={2} display="flex" justifyContent="center">
                <Select
                  value={variationTimeframe}
                  size="small"
                  onChange={(e) => setVariationTimeframe(e.target.value)}
                >
                  <MenuItem value="1m">1 minute</MenuItem>
                  <MenuItem value="1h">1 hour</MenuItem>
                  <MenuItem value="1d">1 day</MenuItem>
                  <MenuItem value="1mo">1 month</MenuItem>
                  <MenuItem value="1w">1 week</MenuItem>
                </Select>
              </Box>
              {variationsLoading && (
                <Typography align="center">Loading variations...</Typography>
              )}
              {variationsError && (
                <Typography align="center" color="error">
                  Error loading variations: {variationsError}
                </Typography>
              )}
              {!variationsLoading && !variationsError && (
                <ItemList
                  items={variations}
                  onItemSelect={(id) => {
                    setSelectedItem(id)
                    setTab(1)
                  }}
                  getSecondary={(v) => `Variation: ${v.variation.toFixed(2)}`}
                />
              )}
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
              <Box flexGrow={1} display="flex" flexDirection="column" gap={2}>
                <ItemDetails item={items.find((it) => it.id === selectedItem)} />
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
          {tab === 2 && (
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
                <NeuralPrediction itemId={selectedItem} />
              </Box>
            </Box>
          )}
        </>
      )}
    </Container>
  )
}

export default App
