# BrickForge 🧱

**Turn your LEGO bricks into builds.**

BrickForge is a free, open-source web app that lets you input the LEGO bricks you own and generates step-by-step building instructions — no LLM, no API costs, no subscriptions.

## How it works

1. **Enter your inventory** — search bricks by name or use quick-add for common pieces
2. **See what you can build** — the fitting engine scores every template against your inventory
3. **Follow the instructions** — step-by-step with 3D brick preview and print support

## Stack: React + Vite · Rebrickable API (free) · Canvas 3D preview · $0 to run

## Getting started

```bash
npm install
cp .env.example .env   # optional: add Rebrickable API key
npm run dev
```

## Contributing

Add templates to `src/data/templates.js` — each one is a plain JSON object with zones and steps. See existing templates for the schema.

## License: MIT
