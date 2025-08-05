const request = require('supertest');
const { app, bazaarData } = require('../index');

describe('GET /api/items/:id/neural-prediction', () => {
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

  test('returns predicted price', async () => {
    const res = await request(app).get('/api/items/TEST/neural-prediction');
    expect(res.status).toBe(200);
    expect(res.body.predictedPrice).toBeCloseTo(27);
  });
});
