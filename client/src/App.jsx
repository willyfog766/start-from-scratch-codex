import { useState, useEffect, useCallback } from 'react'
import { Line } from 'react-chartjs-2'
import 'chart.js/auto'
import {
  AppBar,
  Box,
  Container,
  IconButton,
  InputAdornment,
  List,
  ListItemButton,
  ListItemText,
  Paper,
  Tab,
  Tabs,
  TextField,
  Toolbar,
  Typography,
} from '@mui/material'
import { Brightness4, Brightness7, Search } from '@mui/icons-material'
import './App.css'

function App({ mode, setMode }) {
  const [tab, setTab] = useState(0)
  const [items, setItems] = useState([])
  const [selectedItem, setSelectedItem] = useState(null)
  const [history, setHistory] = useState([])
  const [search, setSearch] = useState('')

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

  const filteredItems = items.filter((it) =>
    it.id.toLowerCase().includes(search.toLowerCase()),
  )

  const variations = [...items]
    .map((it) => ({
      id: it.id,
      variation:
        (it.quick_status.sellPrice || 0) - (it.quick_status.buyPrice || 0),
    }))
    .sort((a, b) => b.variation - a.variation)
    .slice(0, 10)

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
    <>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            Bazaar Tracker
          </Typography>
          <IconButton
            color="inherit"
            onClick={() => setMode(mode === 'light' ? 'dark' : 'light')}
          >
            {mode === 'light' ? <Brightness4 /> : <Brightness7 />}
          </IconButton>
        </Toolbar>
      </AppBar>
      <Container className="App" maxWidth="lg" sx={{ py: 4 }}>
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
              <TextField
                fullWidth
                size="small"
                placeholder="Search items..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Search />
                    </InputAdornment>
                  ),
                }}
              />
              <List>
                {filteredItems.map((it) => (
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
                    <Line data={chartData} />
                  </Box>
                </Paper>
              )}
            </Box>
          </Box>
        )}
      </Container>
    </>
  )
}

export default App
