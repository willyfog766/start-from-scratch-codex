import { Box, Paper, Typography } from '@mui/material'

function ItemDetails({ item }) {
  if (!item) return null

  const renderObject = (obj, indent = 0) => (
    Object.entries(obj).map(([key, value]) =>
      typeof value === 'object' && value !== null ? (
        <Box key={key} sx={{ pl: indent }}>
          <Typography sx={{ fontWeight: 'bold' }}>{key}</Typography>
          {renderObject(value, indent + 2)}
        </Box>
      ) : (
        <Box key={key} sx={{ pl: indent }}>
          <Typography>
            <strong>{key}:</strong> {String(value)}
          </Typography>
        </Box>
      )
    )
  )

  return (
    <Paper sx={{ p: 2 }}>
      <Typography variant="h6" gutterBottom>
        Item Data
      </Typography>
      {renderObject(item)}
    </Paper>
  )
}

export default ItemDetails
