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
