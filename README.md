codex/implement-trainable-prediction-model
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
- `GET /api/items/:itemId/volatility-prediction` – Returns
  `{ predictedVolatility }` representing the next expected absolute change in
  price based on historical data. Training is performed automatically when
  sufficient history is available and results are cached on disk.

Training utilities are available in `server/utils/neural.js` and can be used to
retrain models as needed.

# Bazaar Tracking

## Overview
Bazaar Tracking is a full-stack project for monitoring Hypixel Skyblock bazaar prices.
The **server** is a Node.js application that periodically fetches data from the
official API, stores recent history and exposes endpoints for items, historical
prices and simple predictions.
The **client** is a React (Vite) frontend that consumes these endpoints to show
lists, charts and other visualisations.

## Requirements
- Node.js 20.19 or newer. Older versions (such as Node 18) will fail to run the Vite dev server with an error similar to `crypto.hash is not a function`.

## Installation
Install dependencies in the repository and in the client:

```bash
npm install
npm install --prefix client
```

## Running
Start the server from the repository root:

```bash
npm start
```

Start the client in a separate terminal (requires Node 20+):

```bash
npm run dev --prefix client
```

## Environment Variables
- `PORT` – port for the server (default: `3001`).
- `VITE_API_URL` – base URL of the server API used by the client (default:
  `http://localhost:3001`).

## Contribution Guidelines
Pull requests and issues are welcome. For significant changes please open an
issue first to discuss what you would like to change.

## Testing
Run the full test suite before committing:

```bash
npm run test
```


