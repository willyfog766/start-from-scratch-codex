const express = require('express');
const cors = require('cors');
const Redis = require('ioredis');
const { normalize, volatility, ema } = require('./utils/preprocess');
const { predictNext, predictVolatility } = require('./utils/neural');
const {
  bazaarItemSchema,
  productSchema,
  itemIdParamSchema,
  timeframeSchema,
} = require('./validation');
const { connect, BazaarItem } = require('./db');
const app = express();
app.use(cors());
app.use(express.json());

let bazaarData = {};

let redisClient = null;
const localCache = new Map();

if (process.env.REDIS_URL) {
  redisClient = new Redis(process.env.REDIS_URL);
  redisClient.on('error', (err) => console.error('Redis error', err));
}

async function cacheGet(key) {
  if (redisClient) {
    try {
      return await redisClient.get(key);
    } catch (err) {
      console.error('Redis get error', err);
    }
  }
  return localCache.get(key);
}

async function cacheSet(key, value, ttl = 60) {
  if (redisClient) {
    try {
      await redisClient.set(key, value, 'EX', ttl);
      return;
    } catch (err) {
      console.error('Redis set error', err);
    }
  }
  localCache.set(key, value);
  setTimeout(() => localCache.delete(key), ttl * 1000).unref();
}

async function cacheDel(key) {
  if (redisClient) {
    try {
      await redisClient.del(key);
      return;
    } catch (err) {
      console.error('Redis del error', err);
    }
  }
  localCache.delete(key);
}

const TIMEFRAMES = {
  '1m': 60 * 1000,
  '1h': 60 * 60 * 1000,
  '1d': 24 * 60 * 60 * 1000,
  '1mo': 30 * 24 * 60 * 60 * 1000,
  '1w': 7 * 24 * 60 * 60 * 1000,
};

async function loadData() {
  try {
    await connect();
    const docs = await BazaarItem.find({});
    bazaarData = {};
    docs.forEach(({ itemId, history, product }) => {
      bazaarData[itemId] = { history, product };
    });
  } catch (err) {
    bazaarData = {};
  }
}

async function saveData() {
  try {
    await connect();
    const operations = Object.entries(bazaarData).map(([itemId, item]) => ({
      updateOne: {
        filter: { itemId },
        update: { history: item.history, product: item.product },
        upsert: true,
      },
    }));
    if (operations.length) {
      await BazaarItem.bulkWrite(operations);
    }
  } catch (err) {
    console.error('DB save error', err);
  }
}

loadData();

async function fetchBazaar() {
  try {
    const res = await fetch('https://api.hypixel.net/v2/skyblock/bazaar');
    const json = await res.json();
    const time = Date.now();

    if (json && json.products) {
      Object.entries(json.products).forEach(([id, data]) => {
        const parsedProduct = productSchema.safeParse(data);
        if (!parsedProduct.success) {
          return;
        }
        if (!bazaarData[id]) {
          bazaarData[id] = { history: [], product: parsedProduct.data };
        }
        bazaarData[id].history.push({
          time,
          buyPrice: parsedProduct.data.quick_status.buyPrice,
          sellPrice: parsedProduct.data.quick_status.sellPrice,
        });
        if (bazaarData[id].history.length > 100) {
          bazaarData[id].history.shift();
        }
        bazaarData[id].product = parsedProduct.data;
        const parsedItem = bazaarItemSchema.safeParse(bazaarData[id]);
        if (parsedItem.success) {
          bazaarData[id] = parsedItem.data;
        } else {
          delete bazaarData[id];
        }
      });
      saveData();
      await cacheDel('items');
      await saveData();
    }
  } catch (err) {
    console.error('Fetch error', err);
  }
}

if (process.env.NODE_ENV !== 'test') {
  fetchBazaar();
  setInterval(fetchBazaar, 60 * 1000);
}

function predictNextPeak(itemData) {
  if (!itemData || itemData.length < 3) return null;
  const peaks = [];
  for (let i = 1; i < itemData.length - 1; i++) {
    const prev = itemData[i - 1].buyPrice;
    const curr = itemData[i].buyPrice;
    const next = itemData[i + 1].buyPrice;
    if (curr > prev && curr > next) {
      peaks.push(itemData[i]);
    }
  }
  if (peaks.length < 2) return null;
  const lastPeak = peaks[peaks.length - 1];
  const prevPeak = peaks[peaks.length - 2];
  const avgInterval = lastPeak.time - prevPeak.time;
  const avgIncrease = lastPeak.buyPrice - prevPeak.buyPrice;

  return {
    predictedTime: lastPeak.time + avgInterval,
    predictedPrice: lastPeak.buyPrice + avgIncrease,
  };
}

app.get('/api/items', async (req, res) => {
  const cacheKey = 'items';
  const cached = await cacheGet(cacheKey);
  if (cached) {
    return res.json(JSON.parse(cached));
  }
  const items = Object.entries(bazaarData)
    .filter(([, item]) => bazaarItemSchema.safeParse(item).success)
    .map(([id, item]) => ({
      id,
      quick_status: item.product?.quick_status || {},
    }));
  await cacheSet(cacheKey, JSON.stringify(items));
  res.json(items);
});

app.get('/api/variations', (req, res) => {
  const tfResult = timeframeSchema.safeParse(req.query.timeframe);
  const tf = TIMEFRAMES[tfResult.success ? tfResult.data : '1m'];
  const threshold = Date.now() - tf;
  const variations = Object.entries(bazaarData)
    .filter(([, item]) => bazaarItemSchema.safeParse(item).success)
    .map(([id, item]) => {
      const history = item.history || [];
      if (history.length === 0) {
        return { id, variation: 0 };
      }
      const current = history[history.length - 1];
      let past = null;
      for (let i = history.length - 1; i >= 0; i--) {
        if (history[i].time <= threshold) {
          past = history[i];
          break;
        }
      }
      if (!past) past = history[0];
      return { id, variation: (current.buyPrice || 0) - (past.buyPrice || 0) };
    })
    .sort((a, b) => b.variation - a.variation);
  res.json(variations);
});

app.get('/api/items/:itemId', (req, res) => {
  const itemId = req.params.itemId.toUpperCase();
  if (!itemIdParamSchema.safeParse(itemId).success) {
    return res.status(400).json([]);
  }
  const item = bazaarItemSchema.safeParse(bazaarData[itemId]);
  res.json(item.success ? item.data.history : []);
});

app.get('/api/items/:itemId/full', (req, res) => {
  const itemId = req.params.itemId.toUpperCase();
  if (!itemIdParamSchema.safeParse(itemId).success) {
    return res.status(400).json({});
  }
  const item = bazaarItemSchema.safeParse(bazaarData[itemId]);
  res.json(item.success ? item.data.product || {} : {});
});

app.get('/api/items/:itemId/ema', (req, res) => {
  const itemId = req.params.itemId.toUpperCase();
  const period = parseInt(req.query.period, 10);
  const history = bazaarData[itemId]?.history || [];
  const series = history.map((h) => h.buyPrice);
  res.json(ema(series, period));
});

app.get('/api/items/:itemId/prediction', (req, res) => {
  const itemId = req.params.itemId.toUpperCase();
  if (!itemIdParamSchema.safeParse(itemId).success) {
    return res.status(400).json({});
  }
  const item = bazaarItemSchema.safeParse(bazaarData[itemId]);
  const prediction = predictNextPeak(item.success ? item.data.history : []);
  res.json(prediction || {});
});

app.get('/api/items/:itemId/neural-prediction', async (req, res) => {
  const itemId = req.params.itemId.toUpperCase();
  if (!itemIdParamSchema.safeParse(itemId).success) {
    return res.status(400).json({});
  }
  const item = bazaarItemSchema.safeParse(bazaarData[itemId]);
  const history = item.success ? item.data.history : [];
  const normalized = normalize(history);
  if (normalized.length < 3) {
    return res.json({});
  }
  const { prediction, interval, modelExists, trained, dataPoints } = await predictNext(
    itemId,
    normalized
  );
  if (prediction == null) {
    return res.json({ modelExists, trained, dataPoints });
  }
  const prices = history.map((h) => h.buyPrice);
  const max = Math.max(...prices);
  const min = Math.min(...prices);
  const predictedPrice = prediction * (max - min) + min;
  const delta = interval * (max - min);
  res.json({
    predictedPrice,
    normalizedPrediction: prediction,
    interval: {
      low: predictedPrice - delta,
      high: predictedPrice + delta,
    },
    modelExists,
    trained,
    dataPoints,
  });
});

app.get('/api/items/:itemId/volatility-prediction', async (req, res) => {
  const itemId = req.params.itemId.toUpperCase();
  if (!itemIdParamSchema.safeParse(itemId).success) {
    return res.status(400).json({});
  }
  const item = bazaarItemSchema.safeParse(bazaarData[itemId]);
  const history = item.success ? item.data.history : [];
  const volSeries = volatility(history);
  if (volSeries.length < 3) {
    return res.json({});
  }
  const {
    prediction,
    modelExists,
    trained,
    dataPoints,
  } = await predictVolatility(itemId, volSeries);
  if (prediction == null) {
    return res.json({ modelExists, trained, dataPoints });
  }
  const changes = [];
  for (let i = 1; i < history.length; i++) {
    changes.push(Math.abs(history[i].buyPrice - history[i - 1].buyPrice));
  }
  const max = Math.max(...changes);
  const min = Math.min(...changes);
  const predictedVolatility = prediction * (max - min) + min;
  res.json({
    predictedVolatility,
    normalizedPrediction: prediction,
    modelExists,
    trained,
    dataPoints,
  });
});

const PORT = process.env.PORT || 3001;
if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
  });
}

module.exports = { app, bazaarData, predictNextPeak, fetchBazaar };

