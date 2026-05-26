# Namma Bus Timing

A simple **bus timing web app** for **Thammampatti bus stand** (Thammampatti → other cities).

- Works on **mobile** (responsive design)
- Shows **time + bus name** exactly like the timing board
- Search by **route**, **time**, or **bus name**

## Run locally

```bash
npm install
npm start
```

Then open the URL shown in the terminal (usually `http://localhost:3000`).

## Change the app name (one place only)

Edit **only** this file:

```
src/config/branding.json
```

Example:

```json
{
  "appName": "Namma Bus Timing",
  "appShortName": "Namma Bus",
  "appTagline": "Your tagline here",
  "appDescription": "Short description for Google / browser",
  "packageName": "namma-bus-timing",
  "themeColor": "#1e3a5f",
  "backgroundColor": "#f3f4f6"
}
```

Then either:

- Run `npm start` or `npm run build` (sync runs automatically), **or**
- Run `npm run sync-branding` manually

### What updates automatically

| Field | Updates |
|--------|---------|
| `appName` | Page title, header, footer, PWA manifest |
| `appShortName` | Phone home-screen icon name |
| `appTagline` | Subtitle under the main title |
| `appDescription` | Browser meta description |
| `packageName` | `package.json` npm name |
| `themeColor` / `backgroundColor` | PWA theme colors |

React UI imports from `src/constants/app.ts`, which reads `branding.json`.

## Edit / correct bus timings

All timings and bus names are stored in:

- `src/data/busRoutes.ts`

Each route has a `departures` list like:

```ts
departures: [
  { time: '6.00', busName: 'Government Bus' },
  { time: '6.10', busName: 'Palaniappa' },
]
```

### Notes about time format

- Keep the same board format: `6.00`, `7.25`, `1.21` (with a dot).
- The app automatically sorts/filters times in the correct day order.

## Project structure

```
src/
  config/
    branding.json     ← EDIT APP NAME HERE (single source)
  constants/
    app.ts            ← Re-exports branding for React
  app/
    App.tsx
  data/
    busRoutes.ts
  styles/
    globals.css
    app.css
  utils/
    time.ts
  setupBranding.ts    ← Applies title/meta in the browser
  index.tsx
scripts/
  sync-branding.mjs   ← Syncs branding.json → public + package.json
```

## Build for production

```bash
npm run build
```

## Test

```bash
npm test
```
