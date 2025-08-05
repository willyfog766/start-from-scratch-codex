const tf = require('@tensorflow/tfjs-node');

let model = null;
let lastLoss = null;

function prepareTrainingData(bazaarData) {
  const xs = [];
  const ys = [];
  Object.values(bazaarData).forEach(item => {
    const history = item.history || [];
    for (let i = 0; i < history.length - 1; i++) {
      const curr = history[i].quick_status || {};
      const next = history[i + 1].quick_status || {};
      xs.push([
        curr.buyPrice || 0,
        curr.sellPrice || 0,
        curr.buyVolume || 0,
        curr.sellVolume || 0,
      ]);
      ys.push(next.buyPrice || 0);
    }
  });
  if (xs.length === 0) return null;
  return {
    xs: tf.tensor2d(xs),
    ys: tf.tensor1d(ys),
  };
}

async function train(bazaarData) {
  const data = prepareTrainingData(bazaarData);
  if (!data) return;
  if (!model) {
    model = tf.sequential();
    model.add(tf.layers.dense({ units: 16, activation: 'relu', inputShape: [4] }));
    model.add(tf.layers.dense({ units: 8, activation: 'relu' }));
    model.add(tf.layers.dense({ units: 1 }));
    model.compile({ optimizer: 'adam', loss: 'meanSquaredError' });
  }
  const result = await model.fit(data.xs, data.ys, { epochs: 20, verbose: 0 });
  lastLoss = result.history.loss[result.history.loss.length - 1];
  data.xs.dispose();
  data.ys.dispose();
}

function predict(itemId, bazaarData) {
  if (!model) return null;
  const item = bazaarData[itemId];
  if (!item || !item.history || item.history.length === 0) return null;
  const qs = item.history[item.history.length - 1].quick_status || {};
  const input = tf.tensor2d([
    [qs.buyPrice || 0, qs.sellPrice || 0, qs.buyVolume || 0, qs.sellVolume || 0]
  ]);
  const output = model.predict(input);
  const price = output.dataSync()[0];
  input.dispose();
  output.dispose();
  const confidence = lastLoss != null ? 1 / (1 + lastLoss) : 0;
  return { price, confidence };
}

module.exports = { train, predict };
