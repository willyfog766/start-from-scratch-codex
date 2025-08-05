# Bazaar Tracking

## Overview
Bazaar Tracking is a full-stack project for monitoring Hypixel Skyblock bazaar prices.
The **server** is a Node.js application that periodically fetches data from the
official API, stores recent history and exposes endpoints for items, historical
prices and simple predictions.
The **client** is a React (Vite) frontend that consumes these endpoints to show
lists, charts and other visualisations.

## Installation
Install dependencies in the repository and in the client:

```bash
npm install
npm install --prefix client
```

## Running
Start the server:

```bash
npm run start
```

Start the client in a separate terminal:

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

