import { render, screen, fireEvent } from '@testing-library/react';
import ItemList from './ItemList';
import { vi } from 'vitest';

test('renders items and handles selection', () => {
  const items = [
    { id: 'ITEM1' },
    { id: 'ITEM2' },
  ];
  const onItemSelect = vi.fn();
  const getSecondary = (item) => `secondary ${item.id}`;

  render(
    <ItemList
      items={items}
      onItemSelect={onItemSelect}
      selectedItem="ITEM1"
      getSecondary={getSecondary}
    />
  );

  expect(screen.getByText('ITEM1')).toBeInTheDocument();
  expect(screen.getByText('secondary ITEM1')).toBeInTheDocument();

  const first = screen.getByRole('button', { name: /ITEM1/ });
  expect(first).toHaveClass('Mui-selected');

  fireEvent.click(screen.getByText('ITEM2'));
  expect(onItemSelect).toHaveBeenCalledWith('ITEM2');
});

