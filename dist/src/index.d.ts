export type ThemeName = "onecount" | "ops" | "shield" | "trace" | "pulse";
export type AppKey = "onecount" | "onecount-app" | "inventory" | "hub" | "ops" | "playbook" | "shield" | "trace" | "pulse";
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
/** cubic-bezier control points [x1, y1, x2, y2]. */
export type EasingBezier = [number, number, number, number];
export type MotionEasingName = "standard" | "enter" | "exit" | "emphasized" | "move" | "linear";
export type MotionDurationName = "instant" | "fast" | "standard" | "nav" | "expand" | "data" | "brand" | "splash";
export type MotionSpringName = "soft" | "precise" | "press" | "release";
export interface SpringSpec {
    damping: number;
    stiffness: number;
    mass: number;
}
/**
 * OneCount Motion System v1.0 runtime scale (see onecount-ui/docs/MOTION.md).
 * Framework-free values: RN maps easing arrays through Easing.bezier, web
 * through cssEase()/motionCssVars() below.
 */
export interface MotionSpecTokens {
    $comment?: string;
    duration: Record<MotionDurationName, number>;
    /** Exits run at this fraction of their paired entrance duration. */
    exitRatio: number;
    easing: Record<MotionEasingName, EasingBezier> & {
        $comment?: string;
    };
    spring: Record<MotionSpringName, SpringSpec> & {
        $comment?: string;
    };
    distance: {
        micro: number;
        sm: number;
        md: number;
        lg: number;
        xl: number;
    };
    scale: {
        pressButton: number;
        pressCard: number;
        enter: number;
        popover: number;
        emphasis: number;
    };
    opacity: {
        backdrop: number;
        dimmed: number;
    };
    splashStages: {
        $comment?: string;
        environment: [number, number];
        construction: [number, number];
        lockIn: [number, number];
        identity: [number, number];
        handoff: [number, number];
        segmentStaggerMs: number;
        segmentDurationMs: number;
    };
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
        $comment?: string;
    };
    motionSpec: MotionSpecTokens;
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
    haptics: Record<string, "light" | "medium" | "success" | "warning" | "error" | "strong" | "selection"> & {
        $comment?: string;
    };
    identityHues: Record<"onecount" | "ops" | "shield" | "trace" | "pulse", string> & {
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
/** The OneCount Motion System runtime scale (docs: onecount-ui/docs/MOTION.md). */
export declare const MOTION: MotionSpecTokens;
/** A motion easing as a CSS `cubic-bezier(...)` string (or `linear`). */
export declare function cssEase(name: MotionEasingName): string;
/**
 * The motion scale as CSS custom properties for web surfaces:
 * --oc-dur-<name>: <ms>ms and --oc-ease-<name>: cubic-bezier(...).
 * Returned as a plain record so callers can inline it on :root or emit a file.
 */
export declare function motionCssVars(): Record<string, string>;
