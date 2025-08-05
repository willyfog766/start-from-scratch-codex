const request = require('supertest');
const { app, bazaarData } = require('../index');

beforeEach(() => {
  for (const key in bazaarData) {
    delete bazaarData[key];
  }
});

describe('GET /api/items', () => {
  test('returns list of items', async () => {
    bazaarData.TEST = {
      history: [],
      product: { quick_status: { buyPrice: 100 } },
    };
    const res = await request(app).get('/api/items');
    expect(res.status).toBe(200);
    expect(res.body).toEqual([
      { id: 'TEST', quick_status: { buyPrice: 100 } },
    ]);
  });

  test('returns empty list when no items', async () => {
    const res = await request(app).get('/api/items');
    expect(res.status).toBe(200);
    expect(res.body).toEqual([]);
  });
});

describe('GET /api/items/:id', () => {
  test('returns item history', async () => {
    const history = [{ time: 1, buyPrice: 10 }];
    bazaarData.TEST = { history };
    const res = await request(app).get('/api/items/TEST');
    expect(res.status).toBe(200);
    expect(res.body).toEqual(history);
  });

  test('returns empty array for unknown item', async () => {
    const res = await request(app).get('/api/items/UNKNOWN');
    expect(res.status).toBe(200);
    expect(res.body).toEqual([]);
  });
});

describe('GET /api/items/:id/neural-prediction', () => {
  test('returns predicted price', async () => {
    bazaarData.TEST = {
      history: [
        { time: 1, buyPrice: 10 },
        { time: 2, buyPrice: 20 },
        { time: 3, buyPrice: 30 },
        { time: 4, buyPrice: 40 },
      ],
    };
    const res = await request(app).get('/api/items/TEST/neural-prediction');
    expect(res.status).toBe(200);
    expect(res.body.predictedPrice).toBeCloseTo(27);
  });

  test('handles insufficient data', async () => {
    bazaarData.FEW = {
      history: [
        { time: 1, buyPrice: 10 },
        { time: 2, buyPrice: 20 },
      ],
    };
    const res = await request(app).get('/api/items/FEW/neural-prediction');
    expect(res.status).toBe(200);
    expect(res.body).toEqual({});
  });
});

