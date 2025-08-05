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

test('encodes itemId in request URL', async () => {
  const fakeFetch = vi.fn().mockResolvedValue({
    ok: true,
    json: () => Promise.resolve({}),
  });
  global.fetch = fakeFetch;

  render(<VolatilityPrediction itemId="BAD ITEM" />);
  await waitFor(() => {
    expect(fakeFetch).toHaveBeenCalled();
  });
  expect(fakeFetch).toHaveBeenCalledWith(
    '/api/items/BAD%20ITEM/volatility-prediction'
  );
});
