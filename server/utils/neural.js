const fs = require('fs');
const path = require('path');
const tf = require('@tensorflow/tfjs');

const MODEL_DIR = path.join(__dirname, '..', 'data');

function getModelPath(itemId) {
  return path.join(MODEL_DIR, `${itemId}-model.json`);
}

async function saveModel(model, itemId) {
  if (!fs.existsSync(MODEL_DIR)) {
    fs.mkdirSync(MODEL_DIR, { recursive: true });
  }
  const weights = await Promise.all(
    model.getWeights().map(async (w) => ({
      data: Array.from(await w.data()),
      shape: w.shape,
    }))
  );
  fs.writeFileSync(getModelPath(itemId), JSON.stringify(weights));
}

function loadModel(itemId) {
  const file = getModelPath(itemId);
  if (!fs.existsSync(file)) return null;
  const weightsData = JSON.parse(fs.readFileSync(file, 'utf-8'));
  const model = tf.sequential();
  model.add(tf.layers.dense({ inputShape: [3], units: 8, activation: 'relu' }));
  model.add(tf.layers.dense({ units: 1 }));
  model.compile({ optimizer: 'sgd', loss: 'meanSquaredError' });
  const tensors = weightsData.map((w) => tf.tensor(w.data, w.shape));
  model.setWeights(tensors);
  return model;
}

async function trainModel(itemId, normalizedPrices) {
  if (!Array.isArray(normalizedPrices) || normalizedPrices.length < 4) {
    return null;
  }

  const xs = [];
  const ys = [];
  for (let i = 0; i < normalizedPrices.length - 3; i++) {
    xs.push(normalizedPrices.slice(i, i + 3));
    ys.push(normalizedPrices[i + 3]);
  }

  const model = tf.sequential();
  model.add(tf.layers.dense({ inputShape: [3], units: 8, activation: 'relu' }));
  model.add(tf.layers.dense({ units: 1 }));
  model.compile({ optimizer: 'sgd', loss: 'meanSquaredError' });

  const xsTensor = tf.tensor2d(xs);
  const ysTensor = tf.tensor2d(ys, [ys.length, 1]);
  await model.fit(xsTensor, ysTensor, { epochs: 200, verbose: 0 });

  await saveModel(model, itemId);

  const input = tf.tensor2d([normalizedPrices.slice(-3)]);
  const result = model.predict(input).dataSync()[0];
  return Math.max(0, Math.min(1, result));
}

async function predictNext(itemId, normalizedPrices) {
  if (!Array.isArray(normalizedPrices) || normalizedPrices.length < 3) {
    return null;
  }

  let model = loadModel(itemId);
  if (!model) {
    if (normalizedPrices.length < 4) return null;
    return trainModel(itemId, normalizedPrices);
  }

  const input = tf.tensor2d([normalizedPrices.slice(-3)]);
  const result = model.predict(input).dataSync()[0];
  return Math.max(0, Math.min(1, result));
}

module.exports = { trainModel, predictNext };

