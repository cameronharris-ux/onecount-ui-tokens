import assert from "node:assert/strict";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const pkg = require("../dist/src/index.js");

assert.equal(pkg.TOKENS_VERSION, "0.5.0");
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

// Motion System v1.0: runtime scale present, inside the audit envelope, and web helpers resolve.
assert.equal(pkg.MOTION.duration.instant, 120);
assert.equal(pkg.MOTION.duration.standard, 220);
assert.equal(pkg.MOTION.duration.splash, 1450);
assert.equal(pkg.MOTION.exitRatio, 0.65);
assert.equal(pkg.MOTION.spring.press.stiffness, 320);
assert.equal(pkg.MOTION.scale.pressButton, pkg.CORE.componentState.pressScale);
const [microLo, microHi] = pkg.CORE.motion.micro.durationMs;
assert.ok(pkg.MOTION.duration.instant >= microLo && pkg.MOTION.duration.instant <= microHi, "instant outside micro envelope");
const [stdLo, stdHi] = pkg.CORE.motion.standard.durationMs;
assert.ok(pkg.MOTION.duration.nav >= stdLo - 40 && pkg.MOTION.duration.nav <= stdHi + 20, "nav outside standard envelope tolerance");
const [dataLo, dataHi] = pkg.CORE.motion.dataReveal.durationMs;
assert.ok(pkg.MOTION.duration.data >= dataLo && pkg.MOTION.duration.data <= dataHi, "data outside dataReveal envelope");
const [ratioLo, ratioHi] = pkg.CORE.motion.exitRatio;
assert.ok(pkg.MOTION.exitRatio >= ratioLo && pkg.MOTION.exitRatio <= ratioHi, "exitRatio outside envelope");
assert.equal(pkg.cssEase("standard"), "cubic-bezier(0.215, 0.61, 0.355, 1)");
assert.equal(pkg.cssEase("linear"), "linear");
const vars = pkg.motionCssVars();
assert.equal(vars["--oc-dur-standard"], "220ms");
assert.ok(vars["--oc-ease-emphasized"].startsWith("cubic-bezier(0.19"));
assert.equal(pkg.CORE.haptics["brand-lock-in"], "light");
assert.equal(pkg.CORE.haptics["quantity-step"], "selection");

console.log("smoke ok: built dist resolves real token values for onecount-app, ops, shield, and trace");
