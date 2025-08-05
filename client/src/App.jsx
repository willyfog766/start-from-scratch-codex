import { useState, useEffect } from 'react'
import { Container, Typography, Box, Tabs, Tab } from '@mui/material'
import VariationList from './components/VariationList'
import ItemList from './components/ItemList'
import HistoryChart from './components/HistoryChart'
import useHistory from './hooks/useHistory'
import './App.css'

function App() {
  const [tab, setTab] = useState(0)
  const [items, setItems] = useState([])
  const [selectedItem, setSelectedItem] = useState(null)
  const { history } = useHistory(selectedItem)

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

  const handleVariationSelect = (id) => {
    setSelectedItem(id)
    setTab(1)
  }

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
          <VariationList items={items} onSelect={handleVariationSelect} />
        </Box>
      )}
      {tab === 1 && (
        <Box mt={2} display="flex" gap={2}>
          <Box width="30%" maxHeight={400} sx={{ overflowY: 'auto' }}>
            <ItemList
              items={items}
              selectedItem={selectedItem}
              onSelect={setSelectedItem}
            />
          </Box>
          <Box flexGrow={1}>
            <HistoryChart history={history} selectedItem={selectedItem} />
          </Box>
        </Box>
      )}
    </Container>
  )
}

export default App
