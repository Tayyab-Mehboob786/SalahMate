/**
 * SalahMate — Glassmorphism Design Tokens (`src/theme/glass.ts`)
 *
 * Premium glass effects: subtle frosted translucent cards,
 * gentle blur, soft borders, and light shadows.
 *
 * Unified Theme:
 * - Glass is used for premium feel across the single app theme.
 */

export interface GlassTokens {
  /** Blur intensity for `BlurView` */
  blurIntensity: number;
  /** Tint mode for `BlurView` */
  blurTint: 'light' | 'dark' | 'default';
  /** Semi-transparent card surface fill */
  cardBackground: string;
  /** Button fill for glass variant */
  buttonBackground: string;
  /** Subtle border for glass containers */
  border: string;
  /** Soft screen background gradient (fallback if image not loaded) */
  backgroundGradient: readonly [string, string];
  /** Accent highlight gradient (gold) */
  accentGradient: readonly [string, string];
  /** Primary highlight gradient (emerald) */
  primaryGradient: readonly [string, string];
}

export const glassTokens: GlassTokens = {
  blurIntensity: 24, // Medium blur for premium glass feel
  blurTint: 'light', // Light tint for clean glass
  cardBackground: 'rgba(255, 255, 255, 0.75)', // White glass — 75% opacity
  buttonBackground: 'rgba(255, 255, 255, 0.85)', // White glass button
  border: 'rgba(255, 255, 255, 0.3)', // Subtle white border for frosted edge
  backgroundGradient: ['#F8F6F1', '#E5E7EB'] as const, // Ivory fallback gradient
  accentGradient: ['rgba(200, 162, 76, 0.15)', 'rgba(200, 162, 76, 0.05)'] as const, // Gold
  primaryGradient: ['rgba(34, 160, 107, 0.15)', 'rgba(34, 160, 107, 0.05)'] as const, // Emerald
};

/**
 * Hook to retrieve glass tokens for the unified theme.
 */
export function useGlassTheme(): GlassTokens {
  return glassTokens;
}
