/**
 * SalahMate — Glassmorphism Design Tokens (`src/theme/glass.ts`)
 *
 * Premium glass effects: subtle frosted white cards (15–20% opacity glass over white),
 * gentle blur, soft borders, and light shadows.
 *
 * Design rules:
 * - Never use dark transparent glass over harsh dark backgrounds
 * - Light mode: White glass cards on warm off-white (#FAFAF8) backgrounds
 * - Dark mode: Subtle elevated charcoal with green tint — depth, not heavy blur
 * - Glass is used sparingly for premium feel, not as the default surface
 */

import { useTheme } from 'react-native-paper';

export interface GlassTokens {
  /** Blur intensity for `BlurView` — kept low for performance and clarity */
  blurIntensity: number;
  /** Tint mode for `BlurView` */
  blurTint: 'light' | 'dark' | 'default';
  /** Semi-transparent card surface fill */
  cardBackground: string;
  /** Button fill for glass variant */
  buttonBackground: string;
  /** Subtle border for glass containers */
  border: string;
  /** Soft screen background gradient */
  backgroundGradient: readonly [string, string];
  /** Accent highlight gradient (gold) */
  accentGradient: readonly [string, string];
  /** Primary highlight gradient (emerald) */
  primaryGradient: readonly [string, string];
}

export const lightGlassTokens: GlassTokens = {
  blurIntensity: 20,
  blurTint: 'light',
  cardBackground: 'rgba(255, 255, 255, 0.82)', // White glass — 82% opacity
  buttonBackground: 'rgba(255, 255, 255, 0.75)', // White glass button
  border: 'rgba(45, 52, 54, 0.05)', // Very subtle warm gray border
  backgroundGradient: ['#FAFAF8', '#F5F6F3'] as const, // Warm off-white
  accentGradient: ['rgba(196, 149, 12, 0.08)', 'rgba(196, 149, 12, 0.02)'] as const,
  primaryGradient: ['rgba(21, 128, 61, 0.07)', 'rgba(21, 128, 61, 0.02)'] as const,
};

export const darkGlassTokens: GlassTokens = {
  blurIntensity: 24,
  blurTint: 'dark',
  cardBackground: 'rgba(30, 36, 34, 0.85)', // Green-tinted charcoal
  buttonBackground: 'rgba(38, 44, 42, 0.85)', // Elevated charcoal
  border: 'rgba(255, 255, 255, 0.10)', // Subtle white border
  backgroundGradient: ['#161A18', '#1A1E1C'] as const, // Green-tinted dark
  accentGradient: ['rgba(212, 167, 44, 0.12)', 'rgba(212, 167, 44, 0.03)'] as const,
  primaryGradient: ['rgba(74, 222, 128, 0.10)', 'rgba(74, 222, 128, 0.03)'] as const,
};

/**
 * Hook to retrieve glass tokens for the active theme (light or dark).
 */
export function useGlassTheme(): GlassTokens {
  const theme = useTheme();
  return theme.dark ? darkGlassTokens : lightGlassTokens;
}
