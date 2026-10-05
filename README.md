# AI Climate Intelligence System — Heatwave Dashboard

A React + Vite dashboard for the project *"AI-Based Climate Intelligence
System for Heatwave Monitoring, Prediction, and Early Warning."*

## Run it

```bash
npm install
npm run dev       # local dev server
npm run build     # production build -> dist/
```

Node 18+ recommended.

## What's included

- District + date selectors (10 Rajasthan districts)
- Current weather cards (temperature, humidity, wind, rainfall, pressure, cloud cover)
- AI heatwave prediction panel with a risk-score gauge, status, severity, predicted max temperature, and prediction horizon
- A small "AI model info" strip listing the meteorological parameters a model would use (TEMP2M, TMAX, TMIN, DEW2M, RAIN, EVAP, CLOUD, WIND, MSLP)
- Weather trend chart (temperature / humidity / rainfall, switchable) — Recharts
- Heatwave risk trend chart — Recharts
- District hotspot table ranked by risk
- Heatwave risk map — Leaflet, with colour-coded markers and popups
- Active alerts panel and safety advisories

## Project structure

```
src/
  data/mockData.js        <- single source of mock data + the integration point
  components/              <- one component + one .css file per dashboard section
  App.jsx                  <- layout, wires selected district/date to all sections
  index.css                <- design tokens (colors, type, spacing) as CSS variables
```

## Connecting a real backend / ML model

Every value on the dashboard currently comes from one function:

```js
// src/data/mockData.js
export function fetchDistrictSnapshot(districtName, dateStr) { ... }
```

It's called once in `App.jsx`:

```js
const snapshot = useMemo(() => fetchDistrictSnapshot(district, date), [district, date]);
```

To connect a real API/ML backend, replace the body of `fetchDistrictSnapshot`
with a `fetch()` call to your endpoint (e.g. `GET /api/snapshot?district=...&date=...`)
and keep the return shape the same — it's documented in the comment directly
above the function in `mockData.js`. Everything downstream (charts, cards,
map, alerts) only depends on that shape, not on how the data was produced,
so no component code needs to change. You'll likely want to turn the
function into an async one and add loading/error states in `App.jsx` once
it's hitting a live endpoint.

## Notes

- All data is synthetic and deterministic (seeded by district + date) so the UI
  behaves consistently during a demo while still reacting to your selections.
- The color system maps heat/risk to a warm amber → red → deep-red scale, and
  uses cyan for neutral/reference data, so severity is readable at a glance.
