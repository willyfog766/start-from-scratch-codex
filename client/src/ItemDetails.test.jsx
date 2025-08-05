import { render, screen } from '@testing-library/react'
import ItemDetails from './components/ItemDetails'

test('renders item details', () => {
  const item = { id: 'FOO', foo: 'bar' }
  render(<ItemDetails item={item} />)
  expect(screen.getByText(/Item Data/i)).toBeInTheDocument()
  expect(screen.getByText(/id:/i)).toBeInTheDocument()
  expect(screen.getByText('FOO')).toBeInTheDocument()
})

