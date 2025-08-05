const request = require('supertest');
const { MongoMemoryServer } = require('mongodb-memory-server');
let app;
let fetchBazaar;
let connect;
let BazaarSnapshot;

describe('snapshot workflow', () => {
  let mongo;

  beforeAll(async () => {
    mongo = await MongoMemoryServer.create();
    process.env.MONGO_URI = mongo.getUri();
    ({ app, fetchBazaar } = require('../index'));
    ({ connect, BazaarSnapshot } = require('../db'));
    await connect();
    global.fetch = jest.fn().mockResolvedValue({
      json: () =>
        Promise.resolve({ success: true, products: { TEST: { value: 1 } } }),
    });
    await fetchBazaar();
  });

  afterAll(async () => {
    await require('mongoose').disconnect();
    await mongo.stop();
  });

  test('stores snapshot in database', async () => {
    const snap = await BazaarSnapshot.findOne();
    expect(snap.data.products.TEST.value).toBe(1);
  });

  test('GET /api/products returns latest snapshot', async () => {
    const res = await request(app).get('/api/products');
    expect(res.status).toBe(200);
    expect(res.body.products.TEST.value).toBe(1);
  });
});

describe('frontend', () => {
  test('renders table rows', async () => {
    const fs = require('fs');
    const path = require('path');
    const { JSDOM } = require('jsdom');
    const html = fs.readFileSync(path.join(__dirname, '../../public/index.html'), 'utf8');
    const dom = new JSDOM(html, {
      runScripts: 'dangerously',
      resources: 'usable',
      url: 'http://localhost/',
      beforeParse(window) {
        window.fetch = () =>
          Promise.resolve({
            json: () => Promise.resolve({ products: { TEST: {} } }),
          });
      },
    });
    await new Promise((r) => setTimeout(r, 0));
    const rows = dom.window.document.querySelectorAll('#products tbody tr');
    expect(rows.length).toBe(1);
  });
});
