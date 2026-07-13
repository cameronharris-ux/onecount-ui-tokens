import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

// fileURLToPath, not URL.pathname — see check-drift.mjs; URL.pathname keeps
// %20 and crashes when the package lives under a path containing spaces.
const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const tokensPath = path.join(repoRoot, "dist", "tokens.json");
const tokens = JSON.parse(fs.readFileSync(tokensPath, "utf8"));
const floor = tokens.core?.a11y?.CONTRAST_FLOOR ?? 4.5;

function resolvePath(root, dottedPath) {
  return dottedPath.split(".").reduce((value, key) => (value == null ? undefined : value[key]), root);
}

function parseHex(hex) {
  const value = String(hex).trim().replace("#", "");
  if (!/^[0-9a-fA-F]{6}$/.test(value)) {
    throw new Error(`Expected 6-digit hex color, got ${hex}`);
  }
  return [
    Number.parseInt(value.slice(0, 2), 16) / 255,
    Number.parseInt(value.slice(2, 4), 16) / 255,
    Number.parseInt(value.slice(4, 6), 16) / 255,
  ];
}

function linearize(channel) {
  return channel <= 0.03928 ? channel / 12.92 : ((channel + 0.055) / 1.055) ** 2.4;
}

function luminance(hex) {
  const [r, g, b] = parseHex(hex).map(linearize);
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

function contrastRatio(foreground, background) {
  const fg = luminance(foreground);
  const bg = luminance(background);
  const lighter = Math.max(fg, bg);
  const darker = Math.min(fg, bg);
  return (lighter + 0.05) / (darker + 0.05);
}

const rows = [];
const failures = [];

for (const [themeName, theme] of Object.entries(tokens.themes ?? {})) {
  for (const pair of theme.contrastPairs ?? []) {
    const foreground = resolvePath(theme, pair.foreground);
    const background = resolvePath(theme, pair.background);
    const ratio = contrastRatio(foreground, background);
    const rounded = Math.round(ratio * 100) / 100;
    const pass = pair.role !== "body" || ratio >= floor;
    rows.push({ themeName, pair, foreground, background, ratio: rounded, pass });
    if (!pass) {
      failures.push({ themeName, pair, foreground, background, ratio: rounded });
    }
  }
}

console.log(`contrast check: ${rows.length} declared pairs, body floor ${floor}:1`);
for (const row of rows) {
  const status = row.pass ? "PASS" : "FAIL";
  console.log(
    `${status} ${row.themeName} ${row.pair.name}: ${row.foreground} on ${row.background} = ${row.ratio}:1`
  );
}

if (failures.length > 0) {
  console.error("\ncontrast findings:");
  for (const failure of failures) {
    console.error(
      `- ${failure.themeName} ${failure.pair.name}: ${failure.foreground} on ${failure.background} = ${failure.ratio}:1`
    );
  }
  process.exit(1);
}
