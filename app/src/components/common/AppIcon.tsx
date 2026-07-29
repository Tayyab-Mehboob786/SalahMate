/**
 * SalahMate — AppIcon Component (`src/components/common/AppIcon.tsx`)
 *
 * Centralized icon component wrapping MaterialCommunityIcons.
 * Provides semantic color variants, standardized sizes, and automatic
 * theme-aware coloring for both Light and Dark modes.
 *
 * Usage:
 *   <AppIcon name="home" variant="primary" size="lg" />
 *   <AppIcon name="check-circle" variant="success" size="md" />
 *   <AppIcon name="star" color={customColor} size={28} />
 */

import React from 'react';
import type { StyleProp, TextStyle } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useTheme } from 'react-native-paper';
import { iconSizes } from '@/theme/icons';
import type { IconSize } from '@/theme/icons';
import type { SalahMateTheme } from '@/theme';

// ─── Variant Types ───────────────────────────────────────────────────────────

export type IconVariant =
  | 'primary'
  | 'secondary'
  | 'onPrimary'
  | 'onSurface'
  | 'success'
  | 'warning'
  | 'error'
  | 'achievement'
  | 'disabled'
  | 'active'
  | 'inactive'
  | 'surface';

// ─── Props ───────────────────────────────────────────────────────────────────

export interface AppIconProps {
  /** MaterialCommunityIcons icon name */
  name: React.ComponentProps<typeof MaterialCommunityIcons>['name'];
  /** Semantic color variant — resolved from theme tokens */
  variant?: IconVariant;
  /** Semantic size key or raw pixel number */
  size?: IconSize | number;
  /** Direct color override — takes priority over variant */
  color?: string;
  /** Pass-through style for positioning, margins, etc. */
  style?: StyleProp<TextStyle>;
  /** Accessibility label for screen readers */
  accessibilityLabel?: string;
}

// ─── Variant → Theme Color Mapping ───────────────────────────────────────────

function resolveColor(variant: IconVariant, colors: SalahMateTheme['colors']): string {
  switch (variant) {
    case 'primary':
      return colors.iconPrimary;
    case 'secondary':
      return colors.iconSecondary;
    case 'onPrimary':
      return colors.iconOnPrimary;
    case 'onSurface':
      return colors.iconOnSurface;
    case 'success':
      return colors.iconSuccess;
    case 'warning':
      return colors.iconWarning;
    case 'error':
      return colors.iconError;
    case 'achievement':
      return colors.iconAchievement;
    case 'disabled':
      return colors.iconDisabled;
    case 'active':
      return colors.iconActive;
    case 'inactive':
      return colors.iconInactive;
    case 'surface':
      return colors.surface;
    default:
      return colors.iconPrimary;
  }
}

// ─── Component ───────────────────────────────────────────────────────────────

export const AppIcon: React.FC<AppIconProps> = ({
  name,
  variant = 'primary',
  size = 'md',
  color,
  style,
  accessibilityLabel,
}) => {
  const theme = useTheme<SalahMateTheme>();

  const resolvedColor = color ?? resolveColor(variant, theme.colors);
  const resolvedSize = typeof size === 'number' ? size : iconSizes[size];

  return (
    <MaterialCommunityIcons
      name={name}
      size={resolvedSize}
      color={resolvedColor}
      style={style}
      accessibilityLabel={accessibilityLabel}
    />
  );
};
