import { List, ListItemButton, ListItemText, useTheme } from '@mui/material'

function ItemList({ items, onItemSelect, selectedItem, getSecondary }) {
  const theme = useTheme()

  return (
    <List sx={{ bgcolor: 'background.paper' }}>
      {items.map((item) => (
        <ListItemButton
          key={item.id}
          selected={selectedItem === item.id}
          onClick={() => onItemSelect(item.id)}
          sx={{ mb: theme.spacing(0.5), borderRadius: 1 }}
        >
          <ListItemText
            primary={item.id}
            secondary={getSecondary ? getSecondary(item) : null}
          />
        </ListItemButton>
      ))}
    </List>
  )
}

export default ItemList
