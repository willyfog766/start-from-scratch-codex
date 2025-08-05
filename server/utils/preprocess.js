function normalize(history) {
  if (!Array.isArray(history)) return [];
  const prices = history.map((h) => h.buyPrice);
  if (prices.length === 0) return [];
  const max = Math.max(...prices);
  const min = Math.min(...prices);
  const range = max - min || 1;
  return prices.map((p) => (p - min) / range);
}

function volatility(history) {
  if (!Array.isArray(history) || history.length < 2) return [];
  const changes = [];
  for (let i = 1; i < history.length; i++) {
    changes.push(Math.abs(history[i].buyPrice - history[i - 1].buyPrice));
  }
  const max = Math.max(...changes);
  const min = Math.min(...changes);
  const range = max - min || 1;
  return changes.map((c) => (c - min) / range);
}

function ema(series, period) {
  if (
    !Array.isArray(series) ||
    !Number.isFinite(period) ||
    period <= 0 ||
    series.length < period
  )
    return [];
  const k = 2 / (period + 1);
  let sum = 0;
  for (let i = 0; i < period; i++) {
    sum += series[i];
  }
  let prev = sum / period;
  const result = [prev];
  for (let i = period; i < series.length; i++) {
    prev = series[i] * k + prev * (1 - k);
    result.push(prev);
  }
  return result;
}

module.exports = { normalize, volatility, ema };
