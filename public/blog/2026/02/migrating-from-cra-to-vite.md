# Migrating from CRA to Vite

Create React App served me well for years, but the writing has been on the wall. It's unmaintained, painfully slow on cold starts, and the webpack config is a black box.

## Why Vite

Vite uses native ES modules in development, so there's no bundling step. Hot module replacement is near-instant. Build times are 5–10x faster.

The migration was mostly mechanical:

- Swap `react-scripts` for `vite` and `@vitejs/plugin-react`
- Move `index.html` to the project root
- Replace `process.env.REACT_APP_*` with `import.meta.env.VITE_*`
- Drop `src/react-app-env.d.ts` and `src/reportWebVitals.ts`

## The Gotcha

The one thing that bit me: `require()` doesn't exist in Vite's ESM world. I had dynamic icon imports like `require('./icons/' + name + '.png')` which silently broke. The fix was a static import map — a bit more boilerplate, but explicit and fast.

## Worth It?

Absolutely. Dev server starts in under 300ms now. No regrets.
