import { Paper, Typography } from '@mui/material'

function ItemDetails({ item }) {
  if (!item) return null

  return (
    <Paper sx={{ p: 2 }}>
      <Typography variant="h6" gutterBottom>
        Item Data
      </Typography>
      <pre>{JSON.stringify(item, null, 2)}</pre>
    </Paper>
  )
}

export default ItemDetails
