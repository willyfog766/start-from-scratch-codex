import { Grid } from '@mui/material'
import ItemCard from './ItemCard'

function ItemList({ items, onItemSelect, selectedItem }) {
  return (
    <Grid container spacing={2}>
      {items.map((item) => (
        <Grid item xs={12} sm={6} md={4} key={item.id}>
          <ItemCard
            item={item}
            selected={selectedItem === item.id}
            onClick={() => onItemSelect(item.id)}
          />
        </Grid>
      ))}
    </Grid>
  )
}

export default ItemList
