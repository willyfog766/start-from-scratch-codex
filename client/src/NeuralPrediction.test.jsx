import { render, screen, waitFor } from '@testing-library/react';
import NeuralPrediction from './NeuralPrediction';
import { vi } from 'vitest';

test('fetches and displays prediction', async () => {
  const fakeFetch = vi.fn().mockResolvedValue({
    ok: true,
    json: () => Promise.resolve({ predictedPrice: 99 })
  });
  global.fetch = fakeFetch;

  render(<NeuralPrediction itemId="TEST" />);
  await waitFor(() => {
    expect(screen.getByText(/Prediction:/)).toBeInTheDocument();
  });
  expect(screen.getByText('Prediction: 99.00')).toBeInTheDocument();
});
