# Hypixel Bazaar Peak Predictor

This repository contains a Vite + React app that retrieves item data from the [Hypixel SkyBlock Bazaar API](https://api.hypixel.net/v2/skyblock/bazaar), stores the history in the browser, and graphs the sell price over time. A simple linear regression is used to estimate the next price peak.

## Running locally

```bash
cd frontend
npm install
npm run dev
```

Open the printed local URL in a browser. Enter a Bazaar item id (e.g., `ENCHANTED_CARROT_STICK`) and click **Fetch Now** to gather the latest data. The chart updates as new points are recorded and the predicted next price is shown beneath it.
