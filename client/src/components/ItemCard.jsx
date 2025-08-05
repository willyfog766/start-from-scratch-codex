import { Card, CardActionArea, CardContent, Typography, Box } from '@mui/material'

function formatName(id) {
  return id
    .split('_')
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ')
}

function ItemCard({ item, selected, onClick }) {
  const buy = item.quick_status?.buyPrice ?? 0
  const sell = item.quick_status?.sellPrice ?? 0
  const variation = item.variation ?? sell - buy
  const variationColor =
    variation > 0 ? 'success.main' : variation < 0 ? 'error.main' : 'text.primary'

  return (
    <Card
      variant={selected ? 'outlined' : 'elevation'}
      sx={{
        borderColor: selected ? 'primary.main' : 'transparent',
        backgroundColor: selected ? 'action.selected' : 'background.paper',
      }}
    >
      <CardActionArea onClick={onClick}>
        <CardContent sx={{ '&:last-child': { pb: 2 } }}>
          <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
            {formatName(item.id)}
          </Typography>
          <Box display="flex" justifyContent="space-between" mb={1}>
            <Typography variant="body2">Buy: {buy.toFixed(1)}</Typography>
            <Typography variant="body2">Sell: {sell.toFixed(1)}</Typography>
          </Box>
          <Typography variant="body2" color={variationColor}>
            Variation: {variation.toFixed(2)}
          </Typography>
        </CardContent>
      </CardActionArea>
    </Card>
  )
}

export default ItemCard
