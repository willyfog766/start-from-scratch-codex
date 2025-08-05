import { List, ListItemButton, ListItemText } from '@mui/material'

function ItemList({ items, selectedItem, onSelect }) {
  return (
    <List>
      {items.map((it) => (
        <ListItemButton
          key={it.id}
          selected={it.id === selectedItem}
          onClick={() => onSelect(it.id)}
        >
          <ListItemText
            primary={it.id}
            secondary={`Buy: ${(it.quick_status.buyPrice || 0).toFixed(1)} Sell: ${(it.quick_status.sellPrice || 0).toFixed(1)}`}
          />
        </ListItemButton>
      ))}
    </List>
  )
}

export default ItemList
