const tryRequire = (name) => {
  try {
    return require(name);
  } catch (err) {
    return null;
  }
};

const mongoose = tryRequire('mongoose');

let BazaarItem;
let connected = false;

const bazaarItemSchema = new (mongoose ? mongoose.Schema : Function)(
  mongoose
    ? {
        id: { type: String, unique: true },
        history: [
          {
            time: Number,
            buyPrice: Number,
            sellPrice: Number,
          },
        ],
        product: mongoose.Schema.Types.Mixed,
      }
    : {}
);

async function connect(uri = process.env.MONGO_URI) {
  if (!mongoose || !uri) {
    return;
  }
  if (connected) return;
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

async function connect(uri = process.env.MONGO_URI || 'mongodb://localhost:27017/bazaar') {
  if (mongoose.connection.readyState === 1) return;
  await mongoose.connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  BazaarItem = mongoose.models.BazaarItem || mongoose.model('BazaarItem', bazaarItemSchema);
  connected = true;
}

async function upsertItem(id, data) {
  if (!mongoose || !connected) return;
  await BazaarItem.findOneAndUpdate({ id }, { ...data, id }, { upsert: true, new: true });
}

async function getAllItems() {
  if (!mongoose || !connected) return {};
  const docs = await BazaarItem.find({}).lean();
  return docs.reduce((acc, doc) => {
    acc[doc.id] = { history: doc.history, product: doc.product };
    return acc;
  }, {});
}

module.exports = { connect, upsertItem, getAllItems };
}

module.exports = { connect, BazaarItem };
