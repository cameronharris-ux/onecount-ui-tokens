# @onecount/ui-tokens — DEPRECATED

**Retired 2026-07-06** per the hospitality-os-2026-07 quick-win ruling (adjudicated delete-by-default: zero consumers across the OneCount family, a broken `dist/` build, and a README/`tokens.json` contradiction that made this package unsafe to trust as a source of truth).

Do not add new consumers. Nothing currently imports this package — each app already carries its own tokens locally.

## Canonical source of truth today

Each app's own `constants/theme.ts` (or equivalent) is canonical. Use `one-count-app/lib/theme.ts` as the reference implementation when aligning another app's theme.

## Revival path

If the family wants a shared token package again, follow doc 10, §2.3 of the hospitality-os-2026-07 engagement (`onecount-site/docs/hospitality-os-2026-07/`) — it preserves Cameron's alternative fix path (repair the build, resolve the tokens.json contradiction, wire real consumers) as the ratified way back in, rather than restarting from scratch.

## History

Git history is preserved in this repo for reference. See prior commits for the original shared-core + per-app-theme model.
