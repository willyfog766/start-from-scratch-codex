# Hypixel SkyBlock Market Tracker – Front-End

This Vite + React 19 + TypeScript app provides the SPA for tracking Hypixel SkyBlock Bazaar data.

## Folder structure

```
client/
  src/
    components/
      layout/         # header, sidebar, footer, theme toggle
    features/
      dashboard/
        components/
        pages/
      item/
        components/
        pages/
      analytics/
        components/
        pages/
      alerts/
        components/
        pages/
    lib/              # API helpers, query client
    routes/           # React Router config
    store/            # Zustand stores
    styles/           # Tailwind global styles
    worker/           # Service worker entry
```

## Scripts

- `npm run dev` – start dev server
- `npm run build` – production build
- `npm run lint` – run eslint
- `npm test` – run tests with Vitest
