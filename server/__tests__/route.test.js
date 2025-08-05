const request = require('supertest');
const fs = require('fs');
const path = require('path');
const { app, bazaarData } = require('../index');

describe('GET /api/items/:id/neural-prediction', () => {
  const modelFile = path.join(__dirname, '../data/TEST-model.json');

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
    if (fs.existsSync(modelFile)) {
      fs.unlinkSync(modelFile);
    }
  });

  test('returns predicted price', async () => {
    const res = await request(app).get('/api/items/TEST/neural-prediction');
    expect(res.status).toBe(200);
    expect(res.body.predictedPrice).toBeGreaterThan(30);
    expect(res.body.predictedPrice).toBeLessThanOrEqual(40);
  });
});
