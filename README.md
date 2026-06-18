# @onecount/ui-tokens

Canonical OneCount design tokens — the design-language twin of `@onecount/contracts`. Pure, framework-free data (zero runtime deps) shipped as a public **git dependency** so all six products (OneCount inventory, Ops, Shield, Trace, Playbook, web hub) draw their palette / type / spacing / radius from **one source** and can't drift.

## Model: shared core + per-app theme

- **`CORE`** — identical for every product: the brand accent (`#00D68F` Electric Emerald), the AI/intelligence accent (`#7C3AED` Vivid Violet), the font families (Space Grotesk display + Inter body), and the pill radius. Strictly gated — these may never diverge.
- **`THEMES`** — two presets that capture the genuine, intentional split:
  - **`sibling`** (Playbook, Ops, Shield, Trace): background `#0B1220`, status hues `#1FA971 / #E0A309 / #E5484D`, `xs:4` spacing, `8/12/16/22` radius.
  - **`onecount`** (onecount-app + web hub): background `#0A0F1A`, status hues `#00D68F / #FFB020 / #FF4757`, `xs:8` spacing, `6/8/12/16` radius.
- **`APP_THEMES`** — pins each app to its preset, so values are de-duplicated and drift-gated today and can be converged **value-by-value** later without a big-bang restyle.

Each app keeps its own RN/Next consumption wrapper (its `useTheme`) and imports these raw values:

```ts
import { themeForApp } from "@onecount/ui-tokens";
const { core, theme } = themeForApp("shield");
// core.accent === "#00D68F"; theme.status.danger === "#E5484D"
```

## Install (tokenless, any build env)

```
npm install "github:cameronharris-ux/onecount-ui-tokens#v0.1.0"
```

Prebuilt CJS `dist/` is committed (no registry token, no `.npmrc`, no GitHub org required) — the same distribution model proven by `@onecount/contracts`.

## Evolving tokens

Edit `tokens.json` (the single source), `npm run build`, commit the rebuilt `dist/`, tag a new version, and bump the pin in each app. The Playbook drift gate (`scripts/check-ui-tokens.mjs`) enforces that every app's local theme still carries the shared core and matches its pinned preset.
