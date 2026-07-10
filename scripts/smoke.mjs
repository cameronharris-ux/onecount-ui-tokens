import assert from "node:assert/strict";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const pkg = require("../dist/src/index.js");

assert.equal(pkg.TOKENS_VERSION, "0.4.0");
assert.equal(pkg.CORE.accent, "#00E39A");
assert.equal(pkg.CORE.ai, "#FF2E8A");
assert.equal(pkg.CORE.brand.accent, "#00E39A");
assert.equal(pkg.CORE.brand.ai, "#FF2E8A");
assert.equal(pkg.themeForApp("ops").theme.colors.dark.background, "#0A0F1A");
assert.equal(pkg.themeForApp("shield").theme.colors.dark.background, "#0B1220");
assert.equal(pkg.themeForApp("trace").theme.colors.dark.surface, "#141F33");
assert.equal(pkg.themeForApp("onecount-app").theme.colors.dark.surface, "#111827");
// Canonical cutover targets (doc10 §3.3): the package carries the values apps
// migrate TO, not their pre-cutover drift — see themes.*.$migrations.
assert.equal(pkg.themeForApp("shield").theme.radius.sm, 10);
assert.equal(pkg.themeForApp("trace").theme.colors.dark.warning, "#F0B429");
assert.equal(pkg.themeForApp("trace").theme.colors.dark.danger, "#FF6369");
assert.equal(pkg.themeForApp("trace").theme.spacing.xsPlus, 6);

for (const app of ["onecount-app", "ops", "shield", "trace"]) {
  const resolved = pkg.themeForApp(app);
  assert.ok(resolved.core.brand.accent, `${app} core accent is missing`);
  assert.ok(resolved.theme.colors.dark.background, `${app} dark background is missing`);
  assert.ok(resolved.theme.colors.light.surface, `${app} light surface is missing`);
}

console.log("smoke ok: built dist resolves real token values for onecount-app, ops, shield, and trace");
