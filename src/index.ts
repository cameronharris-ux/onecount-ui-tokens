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
import tokens from "../tokens.json";

export type ThemeName = "sibling" | "onecount";
export type AppKey = "playbook" | "ops" | "shield" | "trace" | "onecount-app" | "hub";

export interface CoreTokens {
  accent: string;
  accentDark: string;
  ai: string;
  fonts: {
    display: string;
    displayBold: string;
    displayMedium: string;
    body: string;
    medium: string;
    semibold: string;
    bold: string;
  };
  radiusPill: number;
}

export interface StatusHues {
  success: string;
  successDark: string;
  warning: string;
  warningDark: string;
  danger: string;
  dangerDark: string;
  info: string;
}

export interface ThemePreset {
  background: string;
  status: StatusHues;
  spacing: Record<string, number>;
  radius: Record<string, number>;
}

export const CORE: CoreTokens = tokens.core as CoreTokens;

export const THEMES: Record<ThemeName, ThemePreset> = {
  sibling: tokens.themes.sibling as unknown as ThemePreset,
  onecount: tokens.themes.onecount as unknown as ThemePreset,
};

export const APP_THEMES: Record<AppKey, ThemeName> = tokens.appThemes as Record<AppKey, ThemeName>;

/** The resolved theme preset for a given app (shared core + the app's pinned palette). */
export function themeForApp(app: AppKey): { core: CoreTokens; theme: ThemePreset } {
  return { core: CORE, theme: THEMES[APP_THEMES[app]] };
}

export const TOKENS_VERSION: string = tokens.version;
