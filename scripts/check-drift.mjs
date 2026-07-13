import fs from "node:fs";
import path from "node:path";
import { createRequire } from "node:module";
import { fileURLToPath } from "node:url";

// fileURLToPath, not URL.pathname: the raw pathname keeps percent-encoding
// (%20 etc.), which breaks for any consuming checkout whose path contains
// spaces (e.g. "OneCount - Pulse") once this script runs from node_modules.
const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const require = createRequire(import.meta.url);

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, "utf8"));
}

function resolvePath(root, dottedPath) {
  return dottedPath.split(".").reduce((value, key) => (value == null ? undefined : value[key]), root);
}

function formatValue(value) {
  return typeof value === "string" ? value : JSON.stringify(value);
}

function parseArgs(argv) {
  const args = { config: null };
  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];
    if (arg === "--config") {
      args.config = argv[index + 1];
      index += 1;
    } else if (arg.startsWith("--config=")) {
      args.config = arg.slice("--config=".length);
    } else if (arg === "--help" || arg === "-h") {
      args.help = true;
    } else {
      throw new Error(`Unknown argument: ${arg}`);
    }
  }
  return args;
}

function usage() {
  return `Usage:
  node scripts/check-drift.mjs
    Run self-check against this package's built dist.

  node scripts/check-drift.mjs --config path/to/ui-token-drift.config.json
    Check an app repo.

Config shape:
{
  "app": "shield",
  "root": "/absolute/path/to/app",
  "themeFile": "constants/theme.ts",
  "sourceDirs": ["app", "components", "hooks", "lib"],
  "allowedHexLiterals": ["#FFFFFF"],
  "checks": [
    { "name": "dark background", "adapter": "darkColors.background", "token": "colors.dark.background" },
    { "name": "radius sm", "adapter": "radii.sm", "token": "radius.sm" }
  ]
}`;
}

function selfCheck() {
  const sourceTokens = readJson(path.join(repoRoot, "tokens.json"));
  const distTokens = readJson(path.join(repoRoot, "dist", "tokens.json"));
  const pkg = require(path.join(repoRoot, "dist", "src", "index.js"));
  const findings = [];

  if (JSON.stringify(sourceTokens) !== JSON.stringify(distTokens)) {
    findings.push("dist/tokens.json does not match tokens.json; run npm run build");
  }

  for (const app of ["onecount-app", "ops", "shield", "trace"]) {
    const resolved = pkg.themeForApp(app);
    if (!resolved?.core?.brand?.accent || !resolved?.theme?.colors?.dark?.background) {
      findings.push(`themeForApp(${app}) did not resolve real values`);
    }
  }

  if (findings.length > 0) {
    console.error("ui-token drift self-check failed:");
    for (const finding of findings) console.error(`- ${finding}`);
    process.exit(1);
  }

  console.log("ui-token drift self-check ok");
  console.log("- dist/tokens.json matches tokens.json");
  console.log("- built themeForApp resolves onecount-app, ops, shield, and trace");
}

function walkFiles(startDir) {
  const files = [];
  if (!fs.existsSync(startDir)) return files;
  const entries = fs.readdirSync(startDir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(startDir, entry.name);
    if (entry.isDirectory()) {
      if ([".git", "node_modules", "dist", "build", ".expo", ".next"].includes(entry.name)) continue;
      files.push(...walkFiles(fullPath));
    } else if (/\.(cjs|mjs|js|jsx|ts|tsx|css|scss)$/.test(entry.name)) {
      files.push(fullPath);
    }
  }
  return files;
}

function scanHexLiterals(config, root, themeFileAbs) {
  const sourceDirs = config.sourceDirs ?? ["app", "components", "hooks", "lib"];
  const allowed = new Set((config.allowedHexLiterals ?? []).map((hex) => hex.toUpperCase()));
  const findings = [];
  for (const sourceDir of sourceDirs) {
    const absDir = path.resolve(root, sourceDir);
    for (const file of walkFiles(absDir)) {
      if (path.resolve(file) === themeFileAbs) continue;
      const source = fs.readFileSync(file, "utf8");
      const matches = source.match(/#[0-9A-Fa-f]{6}\b/g) ?? [];
      for (const match of matches) {
        if (allowed.has(match.toUpperCase())) continue;
        findings.push({ file, hex: match });
      }
    }
  }
  return findings;
}

function collectExportedObjects(source) {
  const objects = new Map();
  const exportPattern = /export\s+const\s+([A-Za-z0-9_]+)(?::[^=]+)?\s*=\s*\{/g;
  let match;
  while ((match = exportPattern.exec(source))) {
    const name = match[1];
    const openBrace = source.indexOf("{", match.index);
    const closeBrace = findMatchingBrace(source, openBrace);
    if (closeBrace !== -1) {
      objects.set(name, source.slice(openBrace + 1, closeBrace));
      exportPattern.lastIndex = closeBrace + 1;
    }
  }
  return objects;
}

function findMatchingBrace(source, openIndex) {
  let depth = 0;
  for (let index = openIndex; index < source.length; index += 1) {
    const char = source[index];
    if (char === "{") depth += 1;
    if (char === "}") {
      depth -= 1;
      if (depth === 0) return index;
    }
  }
  return -1;
}

function readObjectProperty(objects, objectName, propertyName) {
  const body = objects.get(objectName);
  if (!body) return undefined;
  const pattern = new RegExp(`(?:^|[,\\n\\r])\\s*${propertyName}\\s*:\\s*([^,\\n\\r}]+)`);
  const match = body.match(pattern);
  return match ? match[1].trim() : undefined;
}

function normalizeAdapterValue(rawValue, objects) {
  if (rawValue == null) return undefined;
  const stringMatch = rawValue.match(/^["']([^"']+)["']/);
  if (stringMatch) return stringMatch[1];
  const numberMatch = rawValue.match(/^-?\d+(?:\.\d+)?/);
  if (numberMatch) return Number(numberMatch[0]);
  const refMatch = rawValue.match(/^([A-Za-z0-9_]+)\.([A-Za-z0-9_]+)/);
  if (refMatch) {
    return normalizeAdapterValue(readObjectProperty(objects, refMatch[1], refMatch[2]), objects);
  }
  return rawValue.replace(/\s+as\s+const$/, "");
}

function adapterValue(sourceObjects, adapterPath) {
  const [objectName, propertyName] = adapterPath.split(".");
  if (!objectName || !propertyName || adapterPath.split(".").length !== 2) {
    throw new Error(`Only two-part adapter paths are supported, got ${adapterPath}`);
  }
  return normalizeAdapterValue(readObjectProperty(sourceObjects, objectName, propertyName), sourceObjects);
}

function runConfig(configPath) {
  const config = readJson(path.resolve(configPath));
  const root = path.resolve(config.root ?? ".");
  const themeFileAbs = path.resolve(root, config.themeFile);
  const tokens = readJson(path.join(repoRoot, "dist", "tokens.json"));
  const themeName = config.preset ?? tokens.appThemes?.[config.app] ?? config.app;
  const theme = tokens.themes?.[themeName];

  if (!theme) {
    throw new Error(`No token theme found for app/preset ${config.app ?? config.preset}`);
  }
  if (!fs.existsSync(themeFileAbs)) {
    throw new Error(`Theme file not found: ${themeFileAbs}`);
  }

  const source = fs.readFileSync(themeFileAbs, "utf8");
  const objects = collectExportedObjects(source);
  const valueFindings = [];
  for (const check of config.checks ?? []) {
    const actual = adapterValue(objects, check.adapter);
    const expected = resolvePath(theme, check.token);
    if (actual !== expected) {
      valueFindings.push({ ...check, actual, expected });
    }
  }

  const hexFindings = scanHexLiterals(config, root, themeFileAbs);

  console.log(`ui-token drift check: ${config.app ?? themeName} -> ${themeName}`);
  console.log(`theme file: ${themeFileAbs}`);
  console.log(`value checks: ${(config.checks ?? []).length}`);
  console.log(`hex literal findings outside adapter: ${hexFindings.length}`);

  if (valueFindings.length > 0 || hexFindings.length > 0) {
    if (valueFindings.length > 0) {
      console.error("\nvalue drift:");
      for (const finding of valueFindings) {
        console.error(
          `- ${finding.name}: adapter ${finding.adapter}=${formatValue(finding.actual)}; token ${finding.token}=${formatValue(finding.expected)}`
        );
      }
    }
    if (hexFindings.length > 0) {
      console.error("\nhex literals outside theme adapter:");
      for (const finding of hexFindings.slice(0, 50)) {
        console.error(`- ${path.relative(root, finding.file)}: ${finding.hex}`);
      }
      if (hexFindings.length > 50) {
        console.error(`- ...and ${hexFindings.length - 50} more`);
      }
    }
    process.exit(1);
  }

  console.log("ui-token drift check ok");
}

try {
  const args = parseArgs(process.argv.slice(2));
  if (args.help) {
    console.log(usage());
  } else if (args.config) {
    runConfig(args.config);
  } else {
    selfCheck();
  }
} catch (error) {
  console.error(error instanceof Error ? error.message : String(error));
  process.exit(1);
}
