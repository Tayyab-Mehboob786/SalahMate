/**
 * SalahMate Global Theme Configuration (`src/theme/theme.ts`)
 *
 * Integrates custom design tokens with React Native Paper (Material Design 3).
 * Strongly types extended color properties (`success`, `warning`, `card`, `border`)
 * to ensure 100% type safety.
 */

import { MD3LightTheme, configureFonts } from 'react-native-paper';
import type { MD3Theme } from 'react-native-paper/lib/typescript/types';
import { md3Colors, salahMateColors } from './colors';
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

// ─── Unified Theme ───────────────────────────────────────────────────────────

export const salahMateTheme: ExtendedMD3Theme = {
  ...MD3LightTheme,
  roundness: radius.xs,
  colors: {
    ...MD3LightTheme.colors,
    ...salahMateColors,
    ...md3Colors,
  } as ExtendedMD3Theme['colors'],
  fonts,
};

export type SalahMateTheme = ExtendedMD3Theme;
