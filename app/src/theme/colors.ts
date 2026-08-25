/**
 * SalahMate Color System — Unified Premium Glassmorphism Redesign
 *
 * Brand Personality: Premium, Calm, Trustworthy, Modern, Elegant, Spiritually Inspiring
 *
 * Core Palette:
 * - Deep teal (Primary Brand): #19698C
 * - Emerald (Success/Accent): #22A06B
 * - Turquoise (Primary Light): #2A85A5
 * - Warm ivory (Background): #F8F6F1
 * - Charcoal (Text/Icons): #1B1F23
 * - Small muted-gold accents: #C8A24C
 */

import type { MD3Colors } from 'react-native-paper/lib/typescript/types';

// ─── Raw Color Palette ───────────────────────────────────────────────────────

export const palette = {
  primaryBrand: '#19698C', // Deep teal
  primaryHover: '#145874',
  primaryLight: '#2A85A5', // Turquoise
  
  success: '#22A06B', // Emerald
  gold: '#C8A24C', // Muted-gold
  warning: '#F59E0B',
  error: '#EF4444',
  info: '#3B82F6', 

  // Unified Neutrals
  bgIvory: '#F8F6F1', // Warm ivory
  cardWhite: '#FFFFFF',
  textCharcoal: '#1B1F23', // Charcoal
  textSecondary: '#667085',
  borderLight: '#E5E7EB',
  dividerLight: '#ECECEC',

  // Prayer Identity Colors
  fajr: '#3B82F6', 
  dhuhr: '#F59E0B', 
  asr: '#FB923C', 
  maghrib: '#EF4444', 
  isha: '#6366F1', 
  
  // Chart Colors
  chart1: '#19698C',
  chart2: '#22A06B',
  chart3: '#C8A24C',
  chart4: '#2A85A5',
  chart5: '#3B82F6',
  chart6: '#F59E0B',
} as const;

// ─── Semantic App Tokens (Unified Theme) ─────────────────────────────────────

export const salahMateColors = {
  // MD3 Core Overrides
  primary: palette.primaryBrand,
  onPrimary: palette.cardWhite,
  primaryContainer: palette.primaryLight,
  onPrimaryContainer: palette.primaryHover,

  secondary: palette.primaryLight,
  onSecondary: palette.primaryHover,
  secondaryContainer: palette.bgIvory,
  onSecondaryContainer: palette.textSecondary,

  tertiary: palette.gold,
  onTertiary: palette.cardWhite,
  tertiaryContainer: '#FEF3C7',
  onTertiaryContainer: '#92400E',

  background: palette.bgIvory,
  onBackground: palette.textCharcoal,
  surface: palette.cardWhite,
  onSurface: palette.textCharcoal,
  surfaceVariant: '#F1F5F9', // Surface Secondary fallback
  onSurfaceVariant: palette.textSecondary,

  outline: palette.textSecondary,
  outlineVariant: palette.borderLight,

  error: palette.error,
  onError: palette.cardWhite,
  errorContainer: '#FEE2E2',
  onErrorContainer: '#991B1B',

  // Semantic Design System Tokens
  primaryPressed: palette.primaryHover,
  surfaceSecondary: '#F5F5F5',
  border: palette.borderLight,
  divider: palette.dividerLight,
  textPrimary: palette.textCharcoal,
  textSecondary: palette.textSecondary,
  textOnPrimary: palette.cardWhite,
  textOnSurface: palette.textCharcoal,
  iconPrimary: palette.primaryBrand,
  iconSecondary: palette.textSecondary,
  iconOnPrimary: palette.cardWhite,
  iconOnSurface: palette.textCharcoal,
  iconSuccess: palette.success,
  iconWarning: palette.warning,
  iconError: palette.error,
  iconAchievement: palette.gold,
  iconDisabled: '#9CA3AF',
  iconActive: palette.primaryBrand,
  iconInactive: '#9CA3AF',
  success: palette.success,
  warning: palette.warning,
  achievement: palette.gold,
  shadow: 'rgba(0, 0, 0, 0.1)',

  // Legacy mappings for backwards compatibility
  white: palette.cardWhite,
  black: palette.textCharcoal,
  accent: palette.gold,
  card: palette.cardWhite,
  scrim: 'rgba(27, 31, 35, 0.32)',
  disabled: '#E5E7EB',
  onDisabled: '#9CA3AF',
  info: palette.info,
  onInfo: palette.cardWhite,
  infoContainer: '#DBEAFE',
  onSuccess: palette.cardWhite,
  successContainer: '#DCFCE7',
  onSuccessContainer: '#166534',
  onWarning: palette.cardWhite,
  warningContainer: '#FEF3C7',
  onWarningContainer: '#92400E',

  fajr: palette.fajr,
  dhuhr: palette.dhuhr,
  asr: palette.asr,
  maghrib: palette.maghrib,
  isha: palette.isha,

  chart1: palette.chart1,
  chart2: palette.chart2,
  chart3: palette.chart3,
  chart4: palette.chart4,
  chart5: palette.chart5,
  chart6: palette.chart6,

  elevation: {
    level0: 'transparent',
    level1: palette.cardWhite,
    level2: '#F8FAFC',
    level3: '#F1F5F9',
    level4: '#E2E8F0',
    level5: '#CBD5E1',
  },
} as const;

export type ThemeColors = typeof salahMateColors;

// ─── React Native Paper MD3 Color Mapping ────────────────────────────────────

export const md3Colors: Partial<MD3Colors> & Record<string, unknown> = {
  primary: salahMateColors.primary,
  onPrimary: salahMateColors.onPrimary,
  primaryContainer: salahMateColors.primaryContainer,
  onPrimaryContainer: salahMateColors.onPrimaryContainer,
  secondary: salahMateColors.secondary,
  onSecondary: salahMateColors.onSecondary,
  secondaryContainer: salahMateColors.secondaryContainer,
  onSecondaryContainer: salahMateColors.onSecondaryContainer,
  tertiary: salahMateColors.tertiary,
  onTertiary: salahMateColors.onTertiary,
  tertiaryContainer: salahMateColors.tertiaryContainer,
  onTertiaryContainer: salahMateColors.onTertiaryContainer,
  error: salahMateColors.error,
  onError: salahMateColors.onError,
  errorContainer: salahMateColors.errorContainer,
  onErrorContainer: salahMateColors.onErrorContainer,
  background: salahMateColors.background,
  onBackground: salahMateColors.onBackground,
  surface: salahMateColors.surface,
  onSurface: salahMateColors.onSurface,
  surfaceVariant: salahMateColors.surfaceVariant,
  onSurfaceVariant: salahMateColors.onSurfaceVariant,
  outline: salahMateColors.outline,
  outlineVariant: salahMateColors.outlineVariant,
  scrim: salahMateColors.scrim,
  elevation: salahMateColors.elevation,
};
