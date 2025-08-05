function simpleNeuralPrediction(normalizedPrices) {
  if (!Array.isArray(normalizedPrices) || normalizedPrices.length < 3) {
    return null;
  }
  const last3 = normalizedPrices.slice(-3);
  const weights = [0.5, 0.3, 0.2];
  return weights.reduce((sum, w, i) => sum + w * last3[i], 0);
}

module.exports = { simpleNeuralPrediction };
