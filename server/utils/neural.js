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
  tensors.forEach((t) => t.dispose());
  return model;
}

function computeInterval(model, normalizedPrices) {
  if (!Array.isArray(normalizedPrices) || normalizedPrices.length < 4) {
    return 0;
  }
  const xs = [];
  const ys = [];
  for (let i = 0; i < normalizedPrices.length - 3; i++) {
    xs.push(normalizedPrices.slice(i, i + 3));
    ys.push(normalizedPrices[i + 3]);
  }
  return tf.tidy(() => {
    const xsTensor = tf.tensor2d(xs);
    const ysTensor = tf.tensor1d(ys);
    const preds = model.predict(xsTensor);
    const diff = preds.sub(ysTensor);
    const mean = diff.mean();
    const variance = diff.sub(mean).square().mean().dataSync()[0];
    return Math.sqrt(variance);
  });
}

async function trainModel(itemId, normalizedPrices) {
  if (!Array.isArray(normalizedPrices) || normalizedPrices.length < 4) {
    return { prediction: null, interval: 0 };
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
  xsTensor.dispose();
  ysTensor.dispose();

  await saveModel(model, itemId);

  const result = tf.tidy(() => {
    const input = tf.tensor2d([normalizedPrices.slice(-3)]);
    const output = model.predict(input);
    return output.dataSync()[0];
  });

  const interval = computeInterval(model, normalizedPrices);

  model.dispose();
  return { prediction: Math.max(0, Math.min(1, result)), interval };
}

async function predictNext(itemId, normalizedPrices) {
  if (!Array.isArray(normalizedPrices) || normalizedPrices.length < 3) {
    return {
      prediction: null,
      interval: 0,
      modelExists: false,
      trained: false,
      dataPoints: Array.isArray(normalizedPrices) ? normalizedPrices.length : 0,
    };
  }

  let model = loadModel(itemId);
  const dataPoints = normalizedPrices.length;
  if (!model) {
    if (normalizedPrices.length < 4) {
      return {
        prediction: null,
        interval: 0,
        modelExists: false,
        trained: false,
        dataPoints,
      };
    }
    const { prediction, interval } = await trainModel(itemId, normalizedPrices);
    return { prediction, interval, modelExists: false, trained: true, dataPoints };
  }

  const interval = computeInterval(model, normalizedPrices);
  const result = tf.tidy(() => {
    const input = tf.tensor2d([normalizedPrices.slice(-3)]);
    const output = model.predict(input);
    return output.dataSync()[0];
  });

  model.dispose();
  return {
    prediction: Math.max(0, Math.min(1, result)),
    interval,
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
  return predictNext(withSuffix(itemId, 'VOLATILITY'), normalizedChanges);
}

module.exports = { trainModel, predictNext, trainVolatilityModel, predictVolatility };

