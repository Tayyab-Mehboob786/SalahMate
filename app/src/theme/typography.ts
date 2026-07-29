/**
 * SalahMate Typography System
 *
 * Implements Material Design 3 type scales (Display, Headline, Title, Body, Label)
 * while providing easy-to-use semantic presets for custom app components.
 */

import { Platform } from 'react-native';
import type { MD3Type } from 'react-native-paper/lib/typescript/types';

// ─── Font Families ───────────────────────────────────────────────────────────

export const fontFamilies = {
  regular: Platform.select({
    ios: 'System',
    android: 'Roboto',
    default: 'System',
  }),
  medium: Platform.select({
    ios: 'System',
    android: 'Roboto-Medium',
    default: 'System',
  }),
  bold: Platform.select({
    ios: 'System',
    android: 'Roboto-Bold',
    default: 'System',
  }),
} as const;

// ─── Font Sizes & Weights ────────────────────────────────────────────────────

export const fontSizes = {
  xs: 10, // Label Small
  sm: 11, // Body Small / Label Medium
  md: 13, // Body Medium / Title Small
  base: 15, // Body Large / Title Medium
  lg: 17,
  xl: 20, // Title Large
  '2xl': 22, // Headline Small
  '3xl': 24, // Headline Medium
  '4xl': 28, // Headline Large
  '5xl': 40, // Display Small
} as const;

export const fontWeights = {
  regular: '400' as const,
  medium: '500' as const,
  semibold: '600' as const,
  bold: '700' as const,
};

export const lineHeights = {
  tight: 1.2,
  normal: 1.4,
  relaxed: 1.6,
} as const;

// ─── App Semantic Presets ────────────────────────────────────────────────────

export const textVariants = {
  // Complete Requested Type Scale
  largeDisplay: {
    fontFamily: fontFamilies.bold,
    fontSize: 40,
    fontWeight: fontWeights.bold,
    lineHeight: 48,
    letterSpacing: -0.8,
  },
  heading: {
    fontFamily: fontFamilies.bold,
    fontSize: fontSizes['3xl'], // 28px
    fontWeight: fontWeights.bold,
    lineHeight: 36,
    letterSpacing: -0.5,
  },
  title: {
    fontFamily: fontFamilies.medium,
    fontSize: fontSizes.xl, // 22px
    fontWeight: fontWeights.semibold,
    lineHeight: 28,
    letterSpacing: -0.3,
  },
  subtitle: {
    fontFamily: fontFamilies.medium,
    fontSize: fontSizes.base, // 16px
    fontWeight: fontWeights.medium,
    lineHeight: 24,
    letterSpacing: 0,
  },
  body: {
    fontFamily: fontFamilies.regular,
    fontSize: fontSizes.base, // 16px
    fontWeight: fontWeights.regular,
    lineHeight: 24,
    letterSpacing: 0.1,
  },
  caption: {
    fontFamily: fontFamilies.regular,
    fontSize: fontSizes.sm, // 12px
    fontWeight: fontWeights.regular,
    lineHeight: 18,
    letterSpacing: 0.2,
  },
  button: {
    fontFamily: fontFamilies.medium,
    fontSize: fontSizes.base, // 16px
    fontWeight: fontWeights.semibold,
    lineHeight: 20,
    letterSpacing: 0.3,
  },
  label: {
    fontFamily: fontFamilies.medium,
    fontSize: fontSizes.sm, // 12px
    fontWeight: fontWeights.medium,
    lineHeight: 16,
    letterSpacing: 0.6,
    textTransform: 'uppercase' as const,
  },

  // Legacy / Helper Presets (preserved for compatibility)
  h1: {
    fontFamily: fontFamilies.bold,
    fontSize: fontSizes['4xl'],
    fontWeight: fontWeights.bold,
    lineHeight: Math.round(fontSizes['4xl'] * lineHeights.tight),
  },
  h2: {
    fontFamily: fontFamilies.bold,
    fontSize: fontSizes['3xl'],
    fontWeight: fontWeights.bold,
    lineHeight: Math.round(fontSizes['3xl'] * lineHeights.tight),
  },
  h3: {
    fontFamily: fontFamilies.medium,
    fontSize: fontSizes['2xl'],
    fontWeight: fontWeights.semibold,
    lineHeight: Math.round(fontSizes['2xl'] * lineHeights.tight),
  },
  h4: {
    fontFamily: fontFamilies.medium,
    fontSize: fontSizes.xl,
    fontWeight: fontWeights.semibold,
    lineHeight: Math.round(fontSizes.xl * lineHeights.tight),
  },
  bodySmall: {
    fontFamily: fontFamilies.regular,
    fontSize: fontSizes.md,
    fontWeight: fontWeights.regular,
    lineHeight: Math.round(fontSizes.md * lineHeights.normal),
  },
  overline: {
    fontFamily: fontFamilies.medium,
    fontSize: fontSizes.xs,
    fontWeight: fontWeights.medium,
    lineHeight: Math.round(fontSizes.xs * lineHeights.normal),
    letterSpacing: 1.5,
    textTransform: 'uppercase' as const,
  },
  tabularTime: {
    fontFamily: fontFamilies.medium,
    fontSize: 18,
    fontWeight: fontWeights.semibold,
    lineHeight: 24,
    fontVariant: ['tabular-nums'] as const,
  },
} as const;

export type TextVariant = keyof typeof textVariants;

// ─── React Native Paper MD3 TypeScale Mapping ───────────────────────────────

const createMD3Type = (
  size: number,
  lineHeight: number,
  weight: '400' | '500' | '700',
  fontFamily: string,
  letterSpacing = 0,
): MD3Type => ({
  fontFamily,
  fontSize: size,
  fontWeight: weight,
  lineHeight,
  letterSpacing,
});

export const md3TypeScale: Record<string, MD3Type> = {
  displayLarge: createMD3Type(57, 64, '400', fontFamilies.regular, -0.25),
  displayMedium: createMD3Type(45, 52, '400', fontFamilies.regular, 0),
  displaySmall: createMD3Type(36, 44, '400', fontFamilies.regular, 0),

  headlineLarge: createMD3Type(32, 40, '400', fontFamilies.regular, 0),
  headlineMedium: createMD3Type(28, 36, '400', fontFamilies.regular, 0),
  headlineSmall: createMD3Type(24, 32, '400', fontFamilies.regular, 0),

  titleLarge: createMD3Type(22, 28, '500', fontFamilies.medium, 0),
  titleMedium: createMD3Type(16, 24, '500', fontFamilies.medium, 0.15),
  titleSmall: createMD3Type(14, 20, '500', fontFamilies.medium, 0.1),

  bodyLarge: createMD3Type(16, 24, '400', fontFamilies.regular, 0.5),
  bodyMedium: createMD3Type(14, 20, '400', fontFamilies.regular, 0.25),
  bodySmall: createMD3Type(12, 16, '400', fontFamilies.regular, 0.4),

  labelLarge: createMD3Type(14, 20, '500', fontFamilies.medium, 0.1),
  labelMedium: createMD3Type(12, 16, '500', fontFamilies.medium, 0.5),
  labelSmall: createMD3Type(11, 16, '500', fontFamilies.medium, 0.5),

  // Custom Presets Registered for React Native Paper Text compatibility
  default: createMD3Type(14, 20, '400', fontFamilies.regular, 0.25),
  caption: createMD3Type(12, 18, '400', fontFamilies.regular, 0.2),
  subtitle: createMD3Type(16, 24, '500', fontFamilies.medium, 0),
  heading: createMD3Type(28, 36, '700', fontFamilies.bold, -0.5),
  largeDisplay: createMD3Type(40, 48, '700', fontFamilies.bold, -0.8),
  title: createMD3Type(22, 28, '500', fontFamilies.medium, -0.3),
  body: createMD3Type(16, 24, '400', fontFamilies.regular, 0.1),
  button: createMD3Type(16, 20, '500', fontFamilies.medium, 0.3),
  label: createMD3Type(12, 16, '500', fontFamilies.medium, 0.6),
  h1: createMD3Type(32, 40, '700', fontFamilies.bold, 0),
  h2: createMD3Type(28, 36, '700', fontFamilies.bold, 0),
  h3: createMD3Type(24, 32, '500', fontFamilies.medium, 0),
  h4: createMD3Type(22, 28, '500', fontFamilies.medium, 0),
  overline: createMD3Type(11, 16, '500', fontFamilies.medium, 1.5),
};
