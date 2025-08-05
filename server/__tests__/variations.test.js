const request = require('supertest');
const { app, bazaarData } = require('../index');

describe('GET /api/variations', () => {
  beforeEach(() => {
    const now = Date.now();
    bazaarData.A = {
      history: [
        { time: now - 60 * 1000, buyPrice: 10 },
        { time: now, buyPrice: 15 },
      ],
    };
    bazaarData.B = {
      history: [
        { time: now - 60 * 1000, buyPrice: 10 },
        { time: now, buyPrice: 5 },
      ],
    };
  });

  afterEach(() => {
    delete bazaarData.A;
    delete bazaarData.B;
  });

  test('calculates variations for timeframe', async () => {
    const res = await request(app).get('/api/variations?timeframe=1m');
    expect(res.status).toBe(200);
    const body = res.body;
    const itemA = body.find((v) => v.id === 'A');
    const itemB = body.find((v) => v.id === 'B');
    expect(itemA.variation).toBeCloseTo(5);
    expect(itemB.variation).toBeCloseTo(-5);
  });
});
