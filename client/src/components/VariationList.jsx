import { List, ListItemButton, ListItemText } from '@mui/material'

function VariationList({ items, onSelect }) {
  const variations = [...items]
    .map((it) => ({
      id: it.id,
      variation:
        (it.quick_status.sellPrice || 0) - (it.quick_status.buyPrice || 0),
    }))
    .sort((a, b) => b.variation - a.variation)
    .slice(0, 10)

  return (
    <List>
      {variations.map((v) => (
        <ListItemButton key={v.id} onClick={() => onSelect(v.id)}>
          <ListItemText
            primary={v.id}
            secondary={`Variation: ${v.variation.toFixed(2)}`}
          />
        </ListItemButton>
      ))}
    </List>
  )
}

export default VariationList
