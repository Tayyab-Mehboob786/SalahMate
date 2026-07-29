/**
 * SalahMate Border Radius System
 *
 * Aligned with Material Design 3 Shape Tokens (Shapes / Corner rounding).
 */

export const radius = {
  /** 0px — sharp corners */
  none: 0,
  /** 4px — extra small */
  xs: 4,
  /** 8px — small */
  sm: 8,
  /** 12px — medium */
  md: 12,
  12: 12,
  /** 16px — large */
  lg: 16,
  16: 16,
  /** 20px — extra large */
  xl: 20,
  20: 20,
  /** 24px — 2xl */
  '2xl': 24,
  24: 24,
  /** 9999px — full */
  full: 9999,
} as const;

export type Radius = keyof typeof radius;
