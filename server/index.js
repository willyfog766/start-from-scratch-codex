const express = require('express');
const fs = require('fs');
const path = require('path');
const cors = require('cors');
const predictor = require('./model/predictor');

const DATA_DIR = path.join(__dirname, 'data');
const DATA_FILE = path.join(DATA_DIR, 'bazaar-data.json');

const app = express();
app.use(cors());
app.use(express.json());

let bazaarData = {};

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
          sell_summary: data.sell_summary,
          buy_summary: data.buy_summary,
          quick_status: data.quick_status,
        });
        if (bazaarData[id].history.length > 100) {
          bazaarData[id].history.shift();
        }
        bazaarData[id].product = data;
      });
      saveData();
      await predictor.train(bazaarData);
    }
  } catch (err) {
    console.error('Fetch error', err);
  }
}

fetchBazaar();
setInterval(fetchBazaar, 60 * 1000);

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

app.get('/api/items/:itemId/neural-prediction', (req, res) => {
  const itemId = req.params.itemId.toUpperCase();
  const result = predictor.predict(itemId, bazaarData);
  res.json(result || {});
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});

