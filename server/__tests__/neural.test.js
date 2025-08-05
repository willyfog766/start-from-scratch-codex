const fs = require('fs');
const path = require('path');
const {
  trainModel,
  predictNext,
  trainVolatilityModel,
  predictVolatility,
} = require('../utils/neural');
const tf = require('@tensorflow/tfjs');

describe('neural model utilities', () => {
  const modelFile = path.join(__dirname, '../data/TEST-model.json');

  afterEach(() => {
    if (fs.existsSync(modelFile)) {
      fs.unlinkSync(modelFile);
    }
  });

  test('trains model and makes prediction', async () => {
    const data = [0.1, 0.2, 0.3, 0.4];
    const pred = await trainModel('TEST', data);
    expect(typeof pred).toBe('number');
    expect(fs.existsSync(modelFile)).toBe(true);
    const info = await predictNext('TEST', data);
    expect(typeof info.prediction).toBe('number');
    expect(info.modelExists).toBe(true);
    expect(info.trained).toBe(false);
  });

  test('tensor count remains stable across predictions', async () => {
    const data = [0.1, 0.2, 0.3, 0.4];
    await trainModel('TEST', data);
    await predictNext('TEST', data); // warm up
    const start = tf.memory().numTensors;
    for (let i = 0; i < 5; i++) {
      await predictNext('TEST', data);
    }
    expect(tf.memory().numTensors).toBe(start);
  });
});

describe('volatility model utilities', () => {
  const modelFile = path.join(
    __dirname,
    '../data/TEST-VOLATILITY-model.json'
  );

  afterEach(() => {
    if (fs.existsSync(modelFile)) {
      fs.unlinkSync(modelFile);
    }
  });

  test('trains model and makes volatility prediction', async () => {
    const data = [0.1, 0.2, 0.1, 0.3];
    const pred = await trainVolatilityModel('TEST', data);
    expect(typeof pred).toBe('number');
    expect(fs.existsSync(modelFile)).toBe(true);
    const info = await predictVolatility('TEST', data);
    expect(typeof info.prediction).toBe('number');
    expect(info.modelExists).toBe(true);
    expect(info.trained).toBe(false);
  });
});


