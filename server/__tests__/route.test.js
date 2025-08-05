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

  test('returns predicted price with details', async () => {
    const res = await request(app).get('/api/items/TEST/neural-prediction');
    expect(res.status).toBe(200);
    expect(res.body.predictedPrice).toBeGreaterThan(30);
    expect(res.body.predictedPrice).toBeLessThanOrEqual(40);
    expect(res.body.modelExists).toBe(false);
    expect(res.body.trained).toBe(true);
    expect(res.body.dataPoints).toBe(4);
  });
});

describe('GET /api/items/:id/volatility-prediction', () => {
  const modelFile = path.join(
    __dirname,
    '../data/TEST-VOLATILITY-model.json'
  );

  beforeEach(() => {
    bazaarData.TEST = {
      history: [
        { time: 1, buyPrice: 10 },
        { time: 2, buyPrice: 20 },
        { time: 3, buyPrice: 30 },
        { time: 4, buyPrice: 40 },
        { time: 5, buyPrice: 50 },
      ],
    };
  });

  afterEach(() => {
    if (fs.existsSync(modelFile)) {
      fs.unlinkSync(modelFile);
    }
  });

  test('returns predicted volatility', async () => {
    const res = await request(app).get(
      '/api/items/TEST/volatility-prediction'
    );
    expect(res.status).toBe(200);
    expect(res.body.predictedVolatility).toBeGreaterThan(0);
  });
});
