/**
 * SalahMate Global Theme Configuration (`src/theme/theme.ts`)
 *
 * Integrates custom design tokens with React Native Paper (Material Design 3).
 * Strongly types extended color properties (`success`, `warning`, `card`, `border`)
 * to ensure 100% type safety and zero mismatch between dark/light modes.
 */

import { MD3DarkTheme, MD3LightTheme, configureFonts } from 'react-native-paper';
import type { MD3Theme } from 'react-native-paper/lib/typescript/types';
import { md3DarkColors, md3LightColors } from './colors';
import type { ThemeColors } from './colors';
import { radius } from './radius';
import { md3TypeScale } from './typography';

const fonts = configureFonts({ config: md3TypeScale });

export type ExtendedMD3Theme = MD3Theme & {
  colors: MD3Theme['colors'] &
    ThemeColors & {
      success: string;
      warning: string;
      achievement: string;
      primaryPressed: string;
      surfaceSecondary: string;
      border: string;
      divider: string;
      textPrimary: string;
      textSecondary: string;
      textOnPrimary: string;
      textOnSurface: string;
      iconPrimary: string;
      iconSecondary: string;
      iconOnPrimary: string;
      iconOnSurface: string;
      iconSuccess: string;
      iconWarning: string;
      iconError: string;
      iconAchievement: string;
      iconDisabled: string;
      iconActive: string;
      iconInactive: string;
      shadow: string;
    };
};

// ─── Light Theme ─────────────────────────────────────────────────────────────

export const salahMateLightTheme: ExtendedMD3Theme = {
  ...MD3LightTheme,
  roundness: radius.xs,
  colors: {
    ...MD3LightTheme.colors,
    ...md3LightColors,
  } as ExtendedMD3Theme['colors'],
  fonts,
};

// ─── Dark Theme ──────────────────────────────────────────────────────────────

export const salahMateDarkTheme: ExtendedMD3Theme = {
  ...MD3DarkTheme,
  roundness: radius.xs,
  colors: {
    ...MD3DarkTheme.colors,
    ...md3DarkColors,
  } as ExtendedMD3Theme['colors'],
  fonts,
};

export type SalahMateTheme = ExtendedMD3Theme;
