/**
 * SalahMate Spacing System
 *
 * Designed around Material Design 3 (MD3) 8dp baseline grid and 4dp sub-grid.
 * All internal component padding, gaps, and screen margins must use these tokens.
 *
 * Usage: spacing.md → 16
 */

export const spacing = {
  /** 0px */
  none: 0,
  /** 4px — minimal internal chip or badge padding */
  xs: 4,
  4: 4,
  /** 8px — tight spacing between icon and text */
  sm: 8,
  8: 8,
  /** 12px — compact form element gaps */
  md: 12,
  12: 12,
  /** 16px — standard component padding and spacing */
  lg: 16,
  16: 16,
  /** 20px — larger spacing, section gaps */
  xl: 20,
  20: 20,
  /** 24px — generous screen margins and major layout breaks */
  '2xl': 24,
  24: 24,
  /** 32px — significant separation */
  '3xl': 32,
  32: 32,
  /** 48px — massive separation (e.g., bottom of scroll views) */
  '4xl': 48,
  48: 48,
} as const;

export type Spacing = keyof typeof spacing;
