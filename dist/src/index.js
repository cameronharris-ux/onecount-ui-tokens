"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TOKENS_VERSION = exports.APP_THEMES = exports.THEMES = exports.CORE = void 0;
exports.themeForApp = themeForApp;
/**
 * @onecount/ui-tokens — canonical OneCount design tokens.
 *
 * The design-language twin of @onecount/contracts: pure, framework-free data
 * (zero deps) shipped as a public git dependency so all 6 products draw their
 * palette/type/spacing/radius from ONE source and can't drift.
 *
 * SHARED CORE (`core`) is identical for every product — the brand accent, the
 * AI accent, the font families, the pill radius — and is strictly gated.
 *
 * The two `themes` presets capture the genuine, intentional split between the
 * sibling apps (Playbook/Ops/Shield/Trace) and the OneCount-inventory family
 * (onecount-app + web hub): different dark background, status hues, spacing base
 * and radius scale. Each app `pins` to one preset via `appThemes`, so the values
 * are de-duplicated and drift-gated today and can be converged value-by-value
 * later without a big-bang restyle. Each app keeps its own RN/Next consumption
 * wrapper (its `useTheme`) and imports these raw values.
 */
const tokens_json_1 = __importDefault(require("../tokens.json"));
exports.CORE = tokens_json_1.default.core;
exports.THEMES = {
    sibling: tokens_json_1.default.themes.sibling,
    onecount: tokens_json_1.default.themes.onecount,
};
exports.APP_THEMES = tokens_json_1.default.appThemes;
/** The resolved theme preset for a given app (shared core + the app's pinned palette). */
function themeForApp(app) {
    return { core: exports.CORE, theme: exports.THEMES[exports.APP_THEMES[app]] };
}
exports.TOKENS_VERSION = tokens_json_1.default.version;
