export type ThemeName = "onecount" | "ops" | "shield" | "trace";
export type AppKey = "onecount" | "onecount-app" | "inventory" | "hub" | "ops" | "playbook" | "shield" | "trace";
export interface BrandTokens {
    accent: string;
    accentDark: string;
    accentSoft: string;
    accentSoftDark: string;
    onAccent: string;
    primaryGlow: string;
    primaryDeep: string;
    ai: string;
    aiGlow: string;
    aiDeep: string;
    tealBridge: string;
    gradient: string[];
}
export interface FontTokens {
    display: string;
    displayBold: string;
    displayMedium: string;
    body: string;
    medium: string;
    semibold: string;
    bold: string;
    mono: string;
    monoMedium: string;
    monoBold: string;
}
export interface TypeStyle {
    fontSize: number;
    fontWeight: number;
    lineHeight: number;
    fontFamily: string;
    letterSpacing?: number;
    textTransform?: "uppercase";
    fontVariant?: string[];
}
export interface TypographyTokens extends Record<string, TypeStyle | number> {
    display: TypeStyle;
    screenTitle: TypeStyle;
    h1: TypeStyle;
    h2: TypeStyle;
    h3: TypeStyle;
    body: TypeStyle;
    bodySmall: TypeStyle;
    caption: TypeStyle;
    label: TypeStyle;
    heroNumber: TypeStyle;
    MIN_FONT_SIZE: number;
}
export interface RadiusTokens {
    sm: number;
    md: number;
    lg: number;
    xl: number;
    pill: number;
}
export type NumberScale = Record<string, number>;
export interface ElevationToken {
    color?: string;
    y?: number;
    opacity?: number;
    radius?: number;
    elevation: number;
    $comment?: string;
}
export interface CoreTokens {
    accent: string;
    accentDark: string;
    ai: string;
    radiusPill: number;
    brand: BrandTokens;
    fonts: FontTokens;
    typography: TypographyTokens;
    spacingRules: {
        screenGutter: number;
        cardGap: number;
        sectionLabelGap: number;
        baseGrid: number;
        cardPadding: number;
        cardPaddingTight: number;
    };
    spacingScales: {
        siblings: NumberScale;
        onecountCanonical: NumberScale;
        $comment?: string;
    };
    radius: RadiusTokens;
    elevation: Record<string, ElevationToken>;
    keyline: {
        alpha: number;
        $comment?: string;
    };
    motion: {
        micro: {
            durationMs: [number, number];
            easing: string;
            pressScaleButton: number;
            pressScaleCard: number;
        };
        standard: {
            durationMs: [number, number];
            easing: string;
        };
        springs: {
            damping: [number, number];
            stiffness: [number, number];
        };
        dataReveal: {
            durationMs: [number, number];
            easing: string;
        };
        skeletonShimmer: {
            durationMs: number;
            loop: boolean;
            easing: string;
        };
        ambient: {
            durationMs: number;
            easing: string;
        };
        exitRatio: [number, number];
    };
    componentState: {
        pressScale: number;
        pressOpacity: number;
        disabledOpacity: number;
    };
    icons: {
        sizes: {
            inline: number;
            default: number;
            emphasis: number;
        };
        strokeWidth: number;
        $comment?: string;
    };
    a11y: {
        MIN_TAP_TARGET: number;
        MIN_TAP_TARGET_ANDROID: number;
        MIN_FONT_SIZE: number;
        CONTRAST_FLOOR: number;
        DISABLED_OPACITY: number;
        focusRing: {
            color: string;
            width: number;
        };
    };
    haptics: Record<string, "light" | "medium" | "success" | "warning" | "error" | "strong">;
    identityHues: Record<"onecount" | "ops" | "shield" | "trace", string> & {
        $comment?: string;
    };
    siteGrid: Record<string, {
        minWidth?: number;
        maxWidth?: number;
        columns: number;
        gutter: number;
        margin: number;
    }>;
}
export interface ThemeColors {
    background: string;
    backgroundElevated?: string;
    surface: string;
    surface2?: string;
    surfaceMuted?: string;
    border: string;
    borderStrong?: string;
    text: string;
    text2?: string;
    textMuted?: string;
    muted?: string;
    textFaint?: string;
    [token: string]: string | undefined;
}
export interface ShadowToken {
    color: string;
    y: number;
    opacity?: number;
    opacityDark?: number;
    opacityLight?: number;
    radius: number;
    elevation: number;
}
export interface ContrastPair {
    name: string;
    foreground: string;
    background: string;
    role: "body" | "display" | "decorative" | string;
}
export interface ThemePreset {
    $apps: string[];
    $source: string;
    colors: {
        light: ThemeColors;
        dark: ThemeColors;
    };
    spacing: NumberScale;
    radius: RadiusTokens;
    fontFamily: Record<string, string>;
    fontSize?: NumberScale;
    shadows: Record<string, ShadowToken>;
    contrastPairs: ContrastPair[];
}
export interface AuditedDivergence {
    token: string;
    packageValue: string;
    sourceValue: string;
    source: string;
    note: string;
}
export interface TokenSchema {
    $comment: string;
    version: string;
    core: CoreTokens;
    themes: Record<ThemeName, ThemePreset>;
    appThemes: Record<AppKey, ThemeName>;
    auditedDivergences: AuditedDivergence[];
}
export declare const TOKENS: TokenSchema;
export declare const CORE: CoreTokens;
export declare const THEMES: Record<ThemeName, ThemePreset>;
export declare const APP_THEMES: Record<AppKey, ThemeName>;
export declare const AUDITED_DIVERGENCES: AuditedDivergence[];
export declare function themeNameForApp(app: AppKey): ThemeName;
/** The resolved theme preset for a given app plus the shared core tokens. */
export declare function themeForApp(app: AppKey): {
    core: CoreTokens;
    theme: ThemePreset;
    themeName: ThemeName;
};
export declare const TOKENS_VERSION: string;
