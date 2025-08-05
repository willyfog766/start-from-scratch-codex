function normalize(history) {
  if (!Array.isArray(history)) return [];
  const prices = history.map((h) => h.buyPrice);
  if (prices.length === 0) return [];
  const max = Math.max(...prices);
  const min = Math.min(...prices);
  const range = max - min || 1;
  return prices.map((p) => (p - min) / range);
}

module.exports = { normalize };
