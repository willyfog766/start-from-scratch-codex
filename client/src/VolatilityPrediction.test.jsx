import { render, screen, waitFor } from '@testing-library/react';
import VolatilityPrediction from './VolatilityPrediction';
import { vi } from 'vitest';

test('fetches and displays volatility prediction', async () => {
  const fakeFetch = vi.fn().mockResolvedValue({
    ok: true,
    json: () => Promise.resolve({ predictedVolatility: 5 })
  });
  global.fetch = fakeFetch;

  render(<VolatilityPrediction itemId="TEST" />);
  await waitFor(() => {
    expect(screen.getByText(/Volatility:/)).toBeInTheDocument();
  });
  expect(screen.getByText('Volatility: 5.00')).toBeInTheDocument();
});

test('renders placeholder when no item is selected', () => {
  const fakeFetch = vi.fn();
  global.fetch = fakeFetch;

  render(<VolatilityPrediction />);

  expect(screen.getByText('No item selected')).toBeInTheDocument();
  expect(fakeFetch).not.toHaveBeenCalled();
});

test('handles API errors gracefully', async () => {
  const fakeFetch = vi.fn().mockResolvedValue({ ok: false, status: 404 });
  global.fetch = fakeFetch;

  render(<VolatilityPrediction itemId="BAD" />);

  await waitFor(() => {
    expect(screen.getByText(/Error:/)).toBeInTheDocument();
  });
  expect(screen.getByText('Error: Prediction not found')).toBeInTheDocument();
});

test('shows error for invalid item id', async () => {
  render(<VolatilityPrediction itemId={123} />);

  await waitFor(() => {
    expect(screen.getByText('Error: Invalid item ID')).toBeInTheDocument();
  });
});
