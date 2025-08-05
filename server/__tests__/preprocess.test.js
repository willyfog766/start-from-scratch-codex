const { normalize } = require('../utils/preprocess');

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
