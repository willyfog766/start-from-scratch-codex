import { render, screen } from '@testing-library/react'
import ItemDetails from './components/ItemDetails'

test('renders item JSON data', () => {
  const item = { id: 'FOO', foo: 'bar' }
  render(<ItemDetails item={item} />)
  expect(screen.getByText(/Item Data/i)).toBeInTheDocument()
  expect(screen.getByText(/"id": "FOO"/)).toBeInTheDocument()
})

