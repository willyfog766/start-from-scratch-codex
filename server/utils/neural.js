const fs = require('fs');
const path = require('path');
const tf = require('@tensorflow/tfjs');

const MODEL_DIR = path.join(__dirname, '..', 'data');

const VALID_ITEM_ID_REGEX = /^[A-Za-z0-9_-]+$/;

function isValidItemId(itemId) {
  return typeof itemId === 'string' && VALID_ITEM_ID_REGEX.test(itemId);
}

function getModelPath(itemId) {
  if (!isValidItemId(itemId)) return null;
  const filename = `${itemId}-model.json`;
  const resolvedPath = path.resolve(MODEL_DIR, filename);
  const resolvedDir = path.resolve(MODEL_DIR) + path.sep;
  if (!resolvedPath.startsWith(resolvedDir)) return null;
  return resolvedPath;
}

async function saveModel(model, itemId) {
  const filePath = getModelPath(itemId);
  if (!filePath) return;
  if (!fs.existsSync(MODEL_DIR)) {
    fs.mkdirSync(MODEL_DIR, { recursive: true });
  }
  const weights = await Promise.all(
    model.getWeights().map(async (w) => ({
      data: Array.from(await w.data()),
      shape: w.shape,
    }))
  );
  fs.writeFileSync(filePath, JSON.stringify(weights));
}

function loadModel(itemId) {
  const file = getModelPath(itemId);
  if (!file || !fs.existsSync(file)) return null;
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
  if (!isValidItemId(itemId) || !Array.isArray(normalizedPrices) || normalizedPrices.length < 4) {
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
  if (!isValidItemId(itemId) || !Array.isArray(normalizedPrices) || normalizedPrices.length < 3) {
    return {
      prediction: null,
      modelExists: false,
      trained: false,
      dataPoints: Array.isArray(normalizedPrices) ? normalizedPrices.length : 0,
    };
  }

  let model = loadModel(itemId);
  const dataPoints = normalizedPrices.length;
  if (!model) {
    if (normalizedPrices.length < 4) {
      return { prediction: null, modelExists: false, trained: false, dataPoints };
    }
    const prediction = await trainModel(itemId, normalizedPrices);
    return { prediction, modelExists: false, trained: true, dataPoints };
  }

  const input = tf.tensor2d([normalizedPrices.slice(-3)]);
  const result = model.predict(input).dataSync()[0];
  return {
    prediction: Math.max(0, Math.min(1, result)),
    modelExists: true,
    trained: false,
    dataPoints,
  };
}

function withSuffix(itemId, suffix) {
  return `${itemId}-${suffix}`;
}

async function trainVolatilityModel(itemId, normalizedChanges) {
  return trainModel(withSuffix(itemId, 'VOLATILITY'), normalizedChanges);
}

async function predictVolatility(itemId, normalizedChanges) {
  const result = await predictNext(
    withSuffix(itemId, 'VOLATILITY'),
    normalizedChanges,
  );
  return result ? result.prediction : null;
}

module.exports = { trainModel, predictNext, trainVolatilityModel, predictVolatility };

