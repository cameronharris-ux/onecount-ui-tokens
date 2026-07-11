"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MOTION = exports.TOKENS_VERSION = exports.AUDITED_DIVERGENCES = exports.APP_THEMES = exports.THEMES = exports.CORE = exports.TOKENS = void 0;
exports.themeNameForApp = themeNameForApp;
exports.themeForApp = themeForApp;
exports.cssEase = cssEase;
exports.motionCssVars = motionCssVars;
/**
 * @onecount/ui-tokens - canonical OneCount design tokens.
 *
 * Pure, framework-free data for the OneCount family. Native and web apps keep
 * local adapters, but those adapters should source primitive values from this
 * package rather than copying hexes by hand.
 */
const tokens_json_1 = __importDefault(require("../tokens.json"));
exports.TOKENS = tokens_json_1.default;
exports.CORE = exports.TOKENS.core;
exports.THEMES = exports.TOKENS.themes;
exports.APP_THEMES = exports.TOKENS.appThemes;
exports.AUDITED_DIVERGENCES = exports.TOKENS.auditedDivergences;
function themeNameForApp(app) {
    const themeName = exports.APP_THEMES[app];
    if (!themeName) {
        throw new Error(`Unknown OneCount app key: ${app}`);
    }
    return themeName;
}
/** The resolved theme preset for a given app plus the shared core tokens. */
function themeForApp(app) {
    const themeName = themeNameForApp(app);
    const theme = exports.THEMES[themeName];
    if (!theme) {
        throw new Error(`App ${app} maps to missing theme preset: ${themeName}`);
    }
    return { core: exports.CORE, theme, themeName };
}
exports.TOKENS_VERSION = exports.TOKENS.version;
/** The OneCount Motion System runtime scale (docs: onecount-ui/docs/MOTION.md). */
exports.MOTION = exports.CORE.motionSpec;
/** A motion easing as a CSS `cubic-bezier(...)` string (or `linear`). */
function cssEase(name) {
    const [x1, y1, x2, y2] = exports.MOTION.easing[name];
    if (name === "linear") {
        return "linear";
    }
    return `cubic-bezier(${x1}, ${y1}, ${x2}, ${y2})`;
}
/**
 * The motion scale as CSS custom properties for web surfaces:
 * --oc-dur-<name>: <ms>ms and --oc-ease-<name>: cubic-bezier(...).
 * Returned as a plain record so callers can inline it on :root or emit a file.
 */
function motionCssVars() {
    const vars = {};
    for (const [name, ms] of Object.entries(exports.MOTION.duration)) {
        vars[`--oc-dur-${name}`] = `${ms}ms`;
    }
    const easingNames = ["standard", "enter", "exit", "emphasized", "move", "linear"];
    for (const name of easingNames) {
        vars[`--oc-ease-${name}`] = cssEase(name);
    }
    vars["--oc-exit-ratio"] = String(exports.MOTION.exitRatio);
    return vars;
}
