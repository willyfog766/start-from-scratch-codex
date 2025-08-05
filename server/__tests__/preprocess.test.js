const { normalize, volatility, ema } = require('../utils/preprocess');

describe('normalize', () => {
  test('scales prices between 0 and 1', () => {
    const data = [
      { buyPrice: 10 },
      { buyPrice: 20 },
      { buyPrice: 30 },
    ];
    expect(normalize(data)).toEqual([0, 0.5, 1]);
  });

  test('returns empty array for invalid input', () => {
    expect(normalize(null)).toEqual([]);
  });
});

describe('volatility', () => {
  test('returns normalized absolute changes', () => {
    const data = [
      { buyPrice: 10 },
      { buyPrice: 20 },
      { buyPrice: 40 },
      { buyPrice: 50 },
    ];
    expect(volatility(data)).toEqual([0, 1, 0]);
  });

  test('returns empty array for insufficient data', () => {
    expect(volatility([{ buyPrice: 10 }])).toEqual([]);
  });
});

describe('ema', () => {
  test('computes exponential moving average', () => {
    const series = [10, 20, 30, 40];
    expect(ema(series, 2)).toEqual([15, 25, 35]);
  });

  test('returns empty array for invalid input', () => {
    expect(ema([10], 2)).toEqual([]);
  });
});
