const mongoose = require('mongoose');

const bazaarItemSchema = new mongoose.Schema({
  itemId: { type: String, required: true, unique: true },
  history: [
    {
      time: Number,
      buyPrice: Number,
      sellPrice: Number,
    },
  ],
  product: mongoose.Schema.Types.Mixed,
});

const BazaarItem = mongoose.model('BazaarItem', bazaarItemSchema);

const bazaarSnapshotSchema = new mongoose.Schema({
  timestamp: { type: Date, default: Date.now },
  data: mongoose.Schema.Types.Mixed,
});

const BazaarSnapshot = mongoose.model('BazaarSnapshot', bazaarSnapshotSchema);

async function connect(uri = process.env.MONGO_URI || 'mongodb://localhost:27017/bazaar') {
  if (mongoose.connection.readyState === 1) return;
  await mongoose.connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
}

module.exports = { connect, BazaarItem, BazaarSnapshot };
