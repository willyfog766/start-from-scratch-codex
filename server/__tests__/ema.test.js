const request = require('supertest');
const { app, bazaarData } = require('../index');

describe('GET /api/items/:id/ema', () => {
  beforeEach(() => {
    bazaarData.TEST = {
      history: [
        { time: 1, buyPrice: 10 },
        { time: 2, buyPrice: 20 },
        { time: 3, buyPrice: 30 },
        { time: 4, buyPrice: 40 },
      ],
    };
  });

  afterEach(() => {
    delete bazaarData.TEST;
  });

  test('returns EMA series for given period', async () => {
    const res = await request(app).get('/api/items/TEST/ema?period=2');
    expect(res.status).toBe(200);
    expect(res.body.length).toBe(3);
    expect(res.body[0]).toBeCloseTo(15);
    expect(res.body[1]).toBeCloseTo(25);
    expect(res.body[2]).toBeCloseTo(35);
  });
});
