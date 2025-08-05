# start-from-scratch-codex

## Neural price prediction

The server exposes an endpoint that forecasts the next item price using a
trainable model built with [TensorFlow.js](https://github.com/tensorflow/tfjs).
The model takes the last three normalized prices and predicts the next value.
Model parameters are stored under `server/data` so subsequent predictions reuse
the trained network.

### API

- `GET /api/items/:itemId/neural-prediction` – Returns `{ predictedPrice }`
  using the trained model. If the model does not exist but enough history is
  available, the server trains a new model and saves it to disk before
  responding.

Training utilities are available in `server/utils/neural.js` and can be used to
retrain models as needed.

