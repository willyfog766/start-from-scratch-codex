import { List, ListItemButton, ListItemText } from '@mui/material'

function ItemList({ items, onItemSelect, selectedItem, getSecondary }) {
  return (
    <List>
      {items.map((item) => (
        <ListItemButton
          key={item.id}
          selected={selectedItem === item.id}
          onClick={() => onItemSelect(item.id)}
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
