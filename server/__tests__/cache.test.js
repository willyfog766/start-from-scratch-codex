const request = require('supertest');
const { app, bazaarData, fetchBazaar } = require('../index');

describe('Caching behavior for /api/items', () => {
  const originalFetch = global.fetch;

  beforeEach(() => {
    const now = Date.now();
    bazaarData.FOO = {
      history: [{ time: now, buyPrice: 10 }],
      product: { quick_status: { buyPrice: 10, sellPrice: 12 } },
    };
  });

  afterEach(() => {
    delete bazaarData.FOO;
    if (originalFetch) {
      global.fetch = originalFetch;
    }
  });

  test('serves cached data and invalidates after fetchBazaar', async () => {
    let res = await request(app).get('/api/items');
    expect(res.body[0].quick_status.buyPrice).toBe(10);

    bazaarData.FOO.product.quick_status.buyPrice = 20;

    res = await request(app).get('/api/items');
    expect(res.body[0].quick_status.buyPrice).toBe(10);

    global.fetch = jest.fn().mockResolvedValue({
      json: () =>
        Promise.resolve({
          products: {
            FOO: { quick_status: { buyPrice: 30, sellPrice: 12 } },
          },
        }),
    });

    await fetchBazaar();

    res = await request(app).get('/api/items');
    expect(res.body[0].quick_status.buyPrice).toBe(30);
  });
});

