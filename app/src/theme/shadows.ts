/**
 * SalahMate Shadow System — Premium Redesign
 *
 * Soft, subtle shadows that create depth without harshness.
 * Inspired by Apple's design language and modern fintech apps.
 * iOS uses shadow* properties, Android uses elevation.
 */

import { Platform, type ViewStyle } from 'react-native';

type ShadowPreset = ViewStyle;

const createShadow = (
  offsetY: number,
  blur: number,
  opacity: number,
  elevation: number,
): ShadowPreset =>
  Platform.select({
    ios: {
      shadowColor: '#E4E6E3', // Light gray shadow for white-dominant theme
      shadowOffset: { width: 0, height: offsetY },
      shadowOpacity: opacity,
      shadowRadius: blur,
    },
    android: {
      elevation,
    },
    default: {
      elevation,
    },
  }) as ShadowPreset;

export const shadows = {
  /** No shadow */
  none: createShadow(0, 0, 0, 0),
  /** Subtle lift — cards at rest (barely visible, creates depth) */
  sm: createShadow(1, 3, 0.04, 1),
  /** Moderate lift — cards on hover/focus */
  md: createShadow(2, 6, 0.06, 2),
  /** Prominent lift — floating elements, FABs */
  lg: createShadow(4, 12, 0.08, 4),
  /** Maximum lift — modals, bottom sheets */
  xl: createShadow(8, 24, 0.1, 8),
} as const;

export type Shadow = keyof typeof shadows;
