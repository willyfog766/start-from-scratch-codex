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

  useEffect(() => {
    fetch('http://localhost:3001/api/items')
      .then((res) => res.json())
      .then((data) => {
        setItems(data)
        if (data.length > 0) {
          setSelectedItem(data[0].id)
        }
      })
  }, [])

  const fetchHistory = useCallback(async (id) => {
    const res = await fetch(`http://localhost:3001/api/items/${id}`)
    const json = await res.json()
    setHistory(json)
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
            <ItemChart selectedItem={selectedItem} history={history} />
          </Box>
        </Box>
      )}
    </Container>
  )
}

export default App
