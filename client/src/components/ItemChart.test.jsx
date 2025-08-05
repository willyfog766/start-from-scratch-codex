import { render, screen } from '@testing-library/react';
import ItemChart from './ItemChart';
import { vi } from 'vitest';

vi.mock('react-chartjs-2', () => ({
  Line: () => <div data-testid="chart" />, // simple mock
}));

vi.mock('chart.js/auto', () => ({}));

test('renders nothing when no item selected', () => {
  const { container } = render(<ItemChart selectedItem="" history={[]} />);
  expect(container).toBeEmptyDOMElement();
});

test('renders chart for selected item', () => {
  const history = [
    { time: 0, buyPrice: 1, sellPrice: 2 },
    { time: 1, buyPrice: 3, sellPrice: 4 },
  ];
  render(<ItemChart selectedItem="TEST" history={history} />);
  expect(screen.getByText('TEST')).toBeInTheDocument();
  expect(screen.getByTestId('chart')).toBeInTheDocument();
});

