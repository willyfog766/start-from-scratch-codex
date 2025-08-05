import { useState, useEffect, useCallback } from 'react'
import {
  Container,
  Typography,
  Box,
  Paper,
  Tabs,
  Tab,
  List,
  ListItemButton,
  ListItemText,
} from '@mui/material'
import HistoryChart from './components/HistoryChart'
import './App.css'

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
          <List>
            {variations.map((v) => (
              <ListItemButton
                key={v.id}
                onClick={() => {
                  setSelectedItem(v.id)
                  setTab(1)
                }}
              >
                <ListItemText
                  primary={v.id}
                  secondary={`Variation: ${v.variation.toFixed(2)}`}
                />
              </ListItemButton>
            ))}
          </List>
        </Box>
      )}
      {tab === 1 && (
        <Box mt={2} display="flex" gap={2}>
          <Box width="30%" maxHeight={400} sx={{ overflowY: 'auto' }}>
            <List>
              {items.map((it) => (
                <ListItemButton
                  key={it.id}
                  selected={it.id === selectedItem}
                  onClick={() => setSelectedItem(it.id)}
                >
                  <ListItemText
                    primary={it.id}
                    secondary={`Buy: ${(it.quick_status.buyPrice || 0).toFixed(1)} Sell: ${(it.quick_status.sellPrice || 0).toFixed(1)}`}
                  />
                </ListItemButton>
              ))}
            </List>
          </Box>
          <Box flexGrow={1}>
            {selectedItem && (
              <Paper sx={{ p: 2 }}>
                <Typography variant="h6" align="center" gutterBottom>
                  {selectedItem}
                </Typography>
                <Box height={400}>
                  <HistoryChart history={history} />
                </Box>
              </Paper>
            )}
          </Box>
        </Box>
      )}
    </Container>
  )
}

export default App
