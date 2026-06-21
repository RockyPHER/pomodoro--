/**
 * Theme catalogue.
 *
 * Only "cozy-rain" is implemented today. The remaining entries are
 * declared so the architecture (and the theme control) are ready for
 * future reskins — adding one is a matter of a new [data-theme] block
 * in globals.css plus an entry here. No component references colors
 * directly, so a new theme requires no component changes.
 */
export type AppTheme =
  | "cozy-rain"
  | "warm-cafe"
  | "minimal-light"
  | "performance-sport";

export interface ThemeMeta {
  id: AppTheme;
  label: string;
  /** Whether the theme's tokens are defined in globals.css yet. */
  available: boolean;
}

export const THEMES: ThemeMeta[] = [
  { id: "cozy-rain", label: "Cozy Rain", available: true },
  { id: "warm-cafe", label: "Warm Café", available: false },
  { id: "minimal-light", label: "Minimal Light", available: false },
  { id: "performance-sport", label: "Performance", available: false },
];

export const DEFAULT_THEME: AppTheme = "cozy-rain";
