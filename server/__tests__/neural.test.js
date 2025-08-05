const fs = require('fs');
const path = require('path');
const { trainModel, predictNext } = require('../utils/neural');

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
    const again = await predictNext('TEST', data);
    expect(typeof again).toBe('number');
  });
});


