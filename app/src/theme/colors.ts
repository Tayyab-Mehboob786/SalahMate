/**
 * SalahMate Color System — Premium Redesign
 *
 * Brand Personality: Premium, Calm, Trustworthy, Modern, Elegant, Spiritually Inspiring
 *
 * Core Palette:
 * - Primary Brand: #19698C
 * - Primary Hover/Pressed: #145874
 * - Primary Light: #2A85A5
 * - Success: #22A06B
 * - Achievement/Rewards: #C8A24C
 * - Background: #F8F6F1
 * - Card Background: #FFFFFF
 * - Primary Text: #1B1F23
 * - Secondary Text: #667085
 * - Border: #E5E7EB
 * - Divider: #ECECEC
 */

import type { MD3Colors } from 'react-native-paper/lib/typescript/types';

// ─── Raw Color Palette ───────────────────────────────────────────────────────

export const palette = {
  primaryBrand: '#19698C',
  primaryHover: '#145874',
  primaryLight: '#2A85A5',
  
  success: '#22A06B',
  gold: '#C8A24C',
  warning: '#F59E0B',
  error: '#EF4444',
  info: '#3B82F6', 

  // Light Mode Neutrals
  bgLight: '#F8F6F1',
  cardLight: '#FFFFFF',
  textPrimaryLight: '#1B1F23',
  textSecondaryLight: '#667085',
  borderLight: '#E5E7EB',
  dividerLight: '#ECECEC',

  // Dark Mode Neutrals
  bgDark: '#0F172A',
  cardDark: '#1E293B',
  textPrimaryDark: '#F8FAFC', 
  textSecondaryDark: '#CBD5E1', 
  borderDark: '#334155', 
  dividerDark: '#334155',

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

// ─── Semantic App Tokens (Light Mode) ────────────────────────────────────────

export const lightColors = {
  // MD3 Core Overrides (mapped to new semantic base)
  primary: palette.primaryBrand,
  onPrimary: palette.cardLight,
  primaryContainer: palette.primaryLight,
  onPrimaryContainer: palette.primaryHover,

  secondary: palette.primaryLight,
  onSecondary: palette.primaryHover,
  secondaryContainer: palette.bgLight,
  onSecondaryContainer: palette.textSecondaryLight,

  tertiary: palette.gold,
  onTertiary: palette.cardLight,
  tertiaryContainer: '#FEF3C7',
  onTertiaryContainer: '#92400E',

  background: palette.bgLight,
  onBackground: palette.textPrimaryLight,
  surface: palette.cardLight,
  onSurface: palette.textPrimaryLight,
  surfaceVariant: '#F1F5F9', // Surface Secondary fallback
  onSurfaceVariant: palette.textSecondaryLight,

  outline: palette.textSecondaryLight,
  outlineVariant: palette.borderLight,

  error: palette.error,
  onError: palette.cardLight,
  errorContainer: '#FEE2E2',
  onErrorContainer: '#991B1B',

  // Semantic Design System Tokens
  primaryPressed: palette.primaryHover,
  surfaceSecondary: '#F5F5F5',
  border: palette.borderLight,
  divider: palette.dividerLight,
  textPrimary: palette.textPrimaryLight,
  textSecondary: palette.textSecondaryLight,
  textOnPrimary: palette.cardLight,
  textOnSurface: palette.textPrimaryLight,
  iconPrimary: palette.primaryBrand,
  iconSecondary: palette.textSecondaryLight,
  iconOnPrimary: palette.cardLight,
  iconOnSurface: palette.textPrimaryLight,
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
  white: palette.cardLight,
  black: palette.textPrimaryLight,
  accent: palette.gold,
  card: palette.cardLight,
  scrim: 'rgba(27, 31, 35, 0.32)',
  disabled: '#E5E7EB',
  onDisabled: '#9CA3AF',
  info: palette.info,
  onInfo: palette.cardLight,
  infoContainer: '#DBEAFE',
  onSuccess: palette.cardLight,
  successContainer: '#DCFCE7',
  onSuccessContainer: '#166534',
  onWarning: palette.cardLight,
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
    level1: palette.cardLight,
    level2: '#F8FAFC',
    level3: '#F1F5F9',
    level4: '#E2E8F0',
    level5: '#CBD5E1',
  },
} as const;

// ─── Semantic App Tokens (Dark Mode) ─────────────────────────────────────────

export const darkColors = {
  // MD3 Core Overrides (mapped to new semantic base)
  primary: palette.primaryBrand,
  onPrimary: palette.textPrimaryDark,
  primaryContainer: palette.primaryHover,
  onPrimaryContainer: palette.primaryLight,

  secondary: palette.primaryLight,
  onSecondary: palette.textPrimaryDark,
  secondaryContainer: '#334155',
  onSecondaryContainer: palette.textSecondaryDark,

  tertiary: palette.gold,
  onTertiary: '#000000',
  tertiaryContainer: '#78350F',
  onTertiaryContainer: '#FEF3C7',

  background: palette.bgDark,
  onBackground: palette.textPrimaryDark,
  surface: palette.cardDark,
  onSurface: palette.textPrimaryDark,
  surfaceVariant: '#334155',
  onSurfaceVariant: palette.textSecondaryDark,

  outline: palette.textSecondaryDark,
  outlineVariant: palette.borderDark,

  error: palette.error,
  onError: '#000000',
  errorContainer: '#7F1D1D',
  onErrorContainer: '#FEE2E2',

  // Semantic Design System Tokens
  primaryPressed: palette.primaryHover,
  surfaceSecondary: '#334155',
  border: palette.borderDark,
  divider: palette.dividerDark,
  textPrimary: palette.textPrimaryDark,
  textSecondary: palette.textSecondaryDark,
  textOnPrimary: palette.textPrimaryDark,
  textOnSurface: palette.textPrimaryDark,
  iconPrimary: palette.primaryBrand,
  iconSecondary: palette.textSecondaryDark,
  iconOnPrimary: palette.textPrimaryDark,
  iconOnSurface: palette.textPrimaryDark,
  iconSuccess: palette.success,
  iconWarning: '#FBBF24',
  iconError: '#FCA5A5',
  iconAchievement: '#FCD34D',
  iconDisabled: '#64748B',
  iconActive: palette.primaryLight,
  iconInactive: '#64748B',
  success: palette.success,
  warning: palette.warning,
  achievement: palette.gold,
  shadow: 'rgba(0, 0, 0, 0.4)',

  // Legacy mappings for backwards compatibility
  white: palette.textPrimaryDark,
  black: palette.textPrimaryDark,
  accent: palette.gold,
  card: palette.cardDark,
  scrim: 'rgba(0, 0, 0, 0.5)',
  disabled: '#475569',
  onDisabled: '#94A3B8',
  info: palette.info,
  onInfo: '#000000',
  infoContainer: '#1E3A8A',
  onSuccess: '#000000',
  successContainer: '#14532D',
  onSuccessContainer: '#DCFCE7',
  onWarning: '#000000',
  warningContainer: '#78350F',
  onWarningContainer: '#FEF3C7',

  fajr: '#93C5FD',
  dhuhr: '#FCD34D',
  asr: '#FDBA74',
  maghrib: '#FCA5A5',
  isha: '#A5B4FC',

  chart1: palette.chart1,
  chart2: palette.chart2,
  chart3: palette.chart3,
  chart4: palette.chart4,
  chart5: palette.chart5,
  chart6: palette.chart6,

  elevation: {
    level0: 'transparent',
    level1: '#1E293B',
    level2: '#334155',
    level3: '#475569',
    level4: '#64748B',
    level5: '#94A3B8',
  },
} as const;

export type ThemeColors = typeof lightColors;

// ─── React Native Paper MD3 Color Mapping ────────────────────────────────────

export const md3LightColors: Partial<MD3Colors> & Record<string, unknown> = {
  primary: lightColors.primary,
  onPrimary: lightColors.onPrimary,
  primaryContainer: lightColors.primaryContainer,
  onPrimaryContainer: lightColors.onPrimaryContainer,
  secondary: lightColors.secondary,
  onSecondary: lightColors.onSecondary,
  secondaryContainer: lightColors.secondaryContainer,
  onSecondaryContainer: lightColors.onSecondaryContainer,
  tertiary: lightColors.tertiary,
  onTertiary: lightColors.onTertiary,
  tertiaryContainer: lightColors.tertiaryContainer,
  onTertiaryContainer: lightColors.onTertiaryContainer,
  error: lightColors.error,
  onError: lightColors.onError,
  errorContainer: lightColors.errorContainer,
  onErrorContainer: lightColors.onErrorContainer,
  background: lightColors.background,
  onBackground: lightColors.onBackground,
  surface: lightColors.surface,
  onSurface: lightColors.onSurface,
  surfaceVariant: lightColors.surfaceVariant,
  onSurfaceVariant: lightColors.onSurfaceVariant,
  outline: lightColors.outline,
  outlineVariant: lightColors.outlineVariant,
  scrim: lightColors.scrim,
  elevation: lightColors.elevation,
  // Add all base fields mapped for MD3
};

export const md3DarkColors: Partial<MD3Colors> & Record<string, unknown> = {
  primary: darkColors.primary,
  onPrimary: darkColors.onPrimary,
  primaryContainer: darkColors.primaryContainer,
  onPrimaryContainer: darkColors.onPrimaryContainer,
  secondary: darkColors.secondary,
  onSecondary: darkColors.onSecondary,
  secondaryContainer: darkColors.secondaryContainer,
  onSecondaryContainer: darkColors.onSecondaryContainer,
  tertiary: darkColors.tertiary,
  onTertiary: darkColors.onTertiary,
  tertiaryContainer: darkColors.tertiaryContainer,
  onTertiaryContainer: darkColors.onTertiaryContainer,
  error: darkColors.error,
  onError: darkColors.onError,
  errorContainer: darkColors.errorContainer,
  onErrorContainer: darkColors.onErrorContainer,
  background: darkColors.background,
  onBackground: darkColors.onBackground,
  surface: darkColors.surface,
  onSurface: darkColors.onSurface,
  surfaceVariant: darkColors.surfaceVariant,
  onSurfaceVariant: darkColors.onSurfaceVariant,
  outline: darkColors.outline,
  outlineVariant: darkColors.outlineVariant,
  scrim: darkColors.scrim,
  elevation: darkColors.elevation,
};
