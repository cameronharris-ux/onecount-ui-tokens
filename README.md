# @onecount/ui-tokens

OneCount family design tokens, with five family product presets in v0.6.0.

This package is pure data plus zero-dependency Node checks. Apps still keep their own React Native or web theme adapters, but adapter values should come from this package rather than hand-copied hexes.

## Pipeline

```text
tokens.json
  -> dist/src/index.js for RN / Node adapters
  -> dist/tokens.json for CI, checks, and web transforms
  -> app theme adapters and site CSS variables
```

## Install

Use the public git dependency pattern:

```json
{
  "dependencies": {
    "@onecount/ui-tokens": "github:cameronharris-ux/onecount-ui-tokens#v0.6.0"
  }
}
```

## Consume

```ts
import { CORE, TOKENS, themeForApp } from "@onecount/ui-tokens";

const { theme } = themeForApp("shield");

export const colors = {
  background: theme.colors.dark.background,
  surface: theme.colors.dark.surface,
  accent: CORE.brand.accent,
};
```

Resolved app keys:

| App key | Theme |
|---|---|
| `onecount`, `onecount-app`, `inventory`, `hub` | `onecount` |
| `ops`, `playbook` | `ops` |
| `shield` | `shield` |
| `trace` | `trace` |
| `pulse` | `pulse` |

## Values

The current schema models the shipped theme files directly:

| Theme | Dark background | Dark surface | Radius | Source |
|---|---:|---:|---:|---|
| `onecount` | `#0A0F1A` | `#111827` | `10/14/18/24/999` | `one-count-app/lib/theme.ts` |
| `ops` | `#0A0F1A` | `#111827` | `10/14/18/24/999` | `OneCount-Playbook/constants/theme.ts` |
| `pulse` | `#0A0F1A` | `#111827` | `10/14/18/24/999` | `OneCount - Pulse/constants/theme.ts` |
| `shield` | `#0B1220` | `#141F33` | `8/12/16/22/999` | `OneCount-Shield/constants/theme.ts` |
| `trace` | `#0B1220` | `#141F33` | `10/14/18/24/999` | `OneCount-Trace/constants/theme.ts` |

Pulse is the fifth OneCount family product. Its preset is shared-value-identical to Ops; only preset metadata differs, while `core.identityHues.pulse` supplies the violet identity hue `#A78BFA`.

Core ratified values:

| Token | Value |
|---|---:|
| Brand/action accent | `#00E39A` |
| AI-only ink | `#FF2E8A` |
| Ink on accent fill | `#04231A` |
| Dark success | `#34D399` |
| Light success | `#059669` |

The schema also includes typography, spacing rules, spacing scales, radius, elevation, motion, component state, icon rules, a11y constants, haptic moments, product identity hues, site grid, and declared contrast pairs.

## Checks

Build and smoke-test the compiled package:

```bash
npm run build
npm test
```

Self-check the built package:

```bash
node scripts/check-drift.mjs
```

Run contrast checks over declared body text pairs:

```bash
node scripts/check-contrast.mjs
```

Run drift checks from an app repo config:

```bash
node scripts/check-drift.mjs --config ./ui-token-drift.config.json
```

Config shape:

```json
{
  "app": "shield",
  "root": "/Users/cameronharris/Project/OneCount-Shield",
  "themeFile": "constants/theme.ts",
  "sourceDirs": ["app", "components", "hooks", "lib"],
  "allowedHexLiterals": ["#FFFFFF"],
  "checks": [
    { "name": "dark background", "adapter": "darkColors.background", "token": "colors.dark.background" },
    { "name": "radius sm", "adapter": "radii.sm", "token": "radius.sm" }
  ]
}
```

The drift checker loads `dist/tokens.json`, compares configured adapter exports to the pinned token theme, and scans source directories for raw hex literals outside the theme adapter file.

## Changelog

### 0.6.0 - 2026-07-13

- Added Pulse as the fifth OneCount family product with the `pulse` app key and preset.
- Kept the Pulse preset shared-value-identical to Ops; only `$apps` and `$source` metadata differ.
- Added the violet Pulse identity hue as `core.identityHues.pulse` (`#A78BFA`).
- Extended consumer drift checks to resolve shared `core.*` token paths.

### 0.3.0 - 2026-07-09

- Executed Cameron's Option B from hospitality-os-2026-07 doc 10 §2.3 after the 2026-07-06 retirement note.
- Rebuilt the package as the OneCount family's shared token source, with per-app resolved themes for OneCount, Ops, Shield, and Trace.
- Added the doc 10 §3.3 / §4 token categories and the drift/contrast check scripts.
- Recorded the remaining OneCount identity-hue source drift: `onecount-site/lib/ecosystem.ts` still ships `0 214 143` (`#00D68F`) while v0.3.0 keeps D1 brand mint `#00E39A`.

## 0.4.0 — 2026-07-10

Sibling (ops/shield/trace) light-mode `warning`/`danger`/`success` darkened to `#975A05`/`#C81E24`/`#067154` — the old values failed WCAG AA (1.99–3.91:1) as text on their soft backgrounds and surfaces, and chips render label text in these colours. Dark modes unchanged (all pass ≥4.5:1). OneCount theme untouched (its dedicated statusText tokens already pass 7:1+). New contrastPairs entries make the checker enforce these pairs permanently. Long-term model: adopt OneCount-style statusText/fill split family-wide.
