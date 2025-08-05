const { simpleNeuralPrediction } = require('../utils/neural');

describe('simpleNeuralPrediction', () => {
  test('computes weighted sum of last three values', () => {
    const normalized = [0.2, 0.4, 0.6, 0.8];
    const result = simpleNeuralPrediction(normalized);
    // 0.5*0.4 + 0.3*0.6 + 0.2*0.8 = 0.54
    expect(result).toBeCloseTo(0.54);
  });

  test('returns null when not enough data', () => {
    expect(simpleNeuralPrediction([0.1, 0.2])).toBeNull();
  });
});
