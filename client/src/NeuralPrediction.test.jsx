import { render, screen, waitFor } from '@testing-library/react';
import NeuralPrediction from './NeuralPrediction';
import { vi } from 'vitest';

test('fetches and displays detailed prediction info', async () => {
  const fakeFetch = vi.fn().mockResolvedValue({
    ok: true,
    json: () =>
      Promise.resolve({
        predictedPrice: 99,
        normalizedPrediction: 0.5,
        modelExists: true,
        trained: false,
        dataPoints: 10,
      }),
  })
  global.fetch = fakeFetch

  render(<NeuralPrediction itemId="TEST" />)
  await waitFor(() => {
    expect(screen.getByText(/Prediction:/)).toBeInTheDocument()
  })
  expect(screen.getByText('Prediction: 99.00')).toBeInTheDocument()
  expect(screen.getByText('Normalized: 0.5000')).toBeInTheDocument()
  expect(screen.getByText('Model Exists: Yes')).toBeInTheDocument()
  expect(screen.getByText('Trained Now: No')).toBeInTheDocument()
  expect(screen.getByText('Data Points: 10')).toBeInTheDocument()
})
