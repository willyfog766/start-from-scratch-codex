const express = require('express');
const fs = require('fs');
const path = require('path');
const cors = require('cors');
const { normalize, volatility } = require('./utils/preprocess');
const { predictNext, predictVolatility } = require('./utils/neural');

const DATA_DIR = path.join(__dirname, 'data');
const DATA_FILE = path.join(DATA_DIR, 'bazaar-data.json');

const app = express();
app.use(cors());
app.use(express.json());

let bazaarData = {};

const TIMEFRAMES = {
  '1m': 60 * 1000,
  '1h': 60 * 60 * 1000,
  '1d': 24 * 60 * 60 * 1000,
  '1mo': 30 * 24 * 60 * 60 * 1000,
  '1w': 7 * 24 * 60 * 60 * 1000,
};

if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

function loadData() {
  try {
    const raw = fs.readFileSync(DATA_FILE, 'utf-8');
    bazaarData = JSON.parse(raw);
  } catch (err) {
    bazaarData = {};
  }
}

function saveData() {
  fs.writeFileSync(DATA_FILE, JSON.stringify(bazaarData, null, 2));
}

loadData();

async function fetchBazaar() {
  try {
    const res = await fetch('https://api.hypixel.net/v2/skyblock/bazaar');
    const json = await res.json();
    const time = Date.now();

    if (json && json.products) {
      Object.entries(json.products).forEach(([id, data]) => {
        if (!bazaarData[id]) {
          bazaarData[id] = { history: [], product: data };
        }
        bazaarData[id].history.push({
          time,
          buyPrice: data.quick_status.buyPrice,
          sellPrice: data.quick_status.sellPrice,
        });
        if (bazaarData[id].history.length > 100) {
          bazaarData[id].history.shift();
        }
        bazaarData[id].product = data;
      });
      saveData();
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

app.get('/api/items', (req, res) => {
  const items = Object.entries(bazaarData).map(([id, item]) => ({
    id,
    quick_status: item.product?.quick_status || {},
  }));
  res.json(items);
});

app.get('/api/variations', (req, res) => {
  const tf = TIMEFRAMES[req.query.timeframe] || TIMEFRAMES['1m'];
  const threshold = Date.now() - tf;
  const variations = Object.entries(bazaarData)
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
  res.json(bazaarData[itemId]?.history || []);
});

app.get('/api/items/:itemId/full', (req, res) => {
  const itemId = req.params.itemId.toUpperCase();
  res.json(bazaarData[itemId]?.product || {});
});

app.get('/api/items/:itemId/prediction', (req, res) => {
  const itemId = req.params.itemId.toUpperCase();
  const prediction = predictNextPeak(bazaarData[itemId]?.history);
  res.json(prediction || {});
});

app.get('/api/items/:itemId/neural-prediction', async (req, res) => {
  const itemId = req.params.itemId.toUpperCase();
  const history = bazaarData[itemId]?.history || [];
  const normalized = normalize(history);
  if (normalized.length < 3) {
    return res.json({});
  }
  const { prediction, modelExists, trained, dataPoints } = await predictNext(
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
  res.json({
    predictedPrice,
    normalizedPrediction: prediction,
    modelExists,
    trained,
    dataPoints,
  });
});

app.get('/api/items/:itemId/volatility-prediction', async (req, res) => {
  const itemId = req.params.itemId.toUpperCase();
  const history = bazaarData[itemId]?.history || [];
  const volSeries = volatility(history);
  if (volSeries.length < 3) {
    return res.json({});
  }
  const predictedNorm = await predictVolatility(itemId, volSeries);
  const changes = [];
  for (let i = 1; i < history.length; i++) {
    changes.push(Math.abs(history[i].buyPrice - history[i - 1].buyPrice));
  }
  const max = Math.max(...changes);
  const min = Math.min(...changes);
  const predictedVolatility = predictedNorm * (max - min) + min;
  res.json({ predictedVolatility });
});

const PORT = process.env.PORT || 3001;
if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
  });
}

module.exports = { app, bazaarData, predictNextPeak };

