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
export declare const CORE: CoreTokens;
export declare const THEMES: Record<ThemeName, ThemePreset>;
export declare const APP_THEMES: Record<AppKey, ThemeName>;
/** The resolved theme preset for a given app (shared core + the app's pinned palette). */
export declare function themeForApp(app: AppKey): {
    core: CoreTokens;
    theme: ThemePreset;
};
export declare const TOKENS_VERSION: string;
