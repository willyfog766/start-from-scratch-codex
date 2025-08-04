const express = require('express');
const fs = require('fs');
const path = require('path');
const cors = require('cors');

const DATA_FILE = path.join(__dirname, 'data', 'bazaar-data.json');

const app = express();
app.use(cors());
app.use(express.json());

let bazaarData = {};

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
        const price = data.quick_status.buyPrice;
        if (!bazaarData[id]) bazaarData[id] = [];
        bazaarData[id].push({ time, price });
        if (bazaarData[id].length > 100) {
          bazaarData[id].shift();
        }
      });
      saveData();
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
    const prev = itemData[i - 1].price;
    const curr = itemData[i].price;
    const next = itemData[i + 1].price;
    if (curr > prev && curr > next) {
      peaks.push(itemData[i]);
    }
  }
  if (peaks.length < 2) return null;
  const lastPeak = peaks[peaks.length - 1];
  const prevPeak = peaks[peaks.length - 2];
  const avgInterval = lastPeak.time - prevPeak.time;
  const avgIncrease = lastPeak.price - prevPeak.price;

  return {
    predictedTime: lastPeak.time + avgInterval,
    predictedPrice: lastPeak.price + avgIncrease,
  };
}

app.get('/api/items/:itemId', (req, res) => {
  const itemId = req.params.itemId.toUpperCase();
  res.json(bazaarData[itemId] || []);
});

app.get('/api/items/:itemId/prediction', (req, res) => {
  const itemId = req.params.itemId.toUpperCase();
  const prediction = predictNextPeak(bazaarData[itemId]);
  res.json(prediction || {});
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});

