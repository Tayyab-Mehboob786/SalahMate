/**
 * SalahMate Avatar Component
 *
 * Multi-mode user representation component wrapping React Native Paper's
 * `Avatar.Image`, `Avatar.Text`, and `Avatar.Icon`.
 * Automatically inherits MD3 primary tonal containers when custom colors are omitted.
 *
 * Requirements Met:
 * - React Native Paper v5 MD3 theme integration (`useTheme`)
 * - Light and Dark theme responsiveness (`primaryContainer` / `onPrimaryContainer`)
 * - Accessibility (`accessibilityRole="image"`, descriptive labels)
 * - Strict TypeScript props without business logic
 */

import React from 'react';
import { StyleSheet, View } from 'react-native';
import type { ImageSourcePropType, StyleProp, ViewStyle } from 'react-native';
import { Avatar as PaperAvatar, useTheme } from 'react-native-paper';
import type { SalahMateTheme } from '@/theme';

export interface AvatarProps {
  /** Rendering mode: image source, initials text, or material icon */
  mode?: 'image' | 'text' | 'icon';
  /** Diameter size in pixels (defaults to `40`) */
  size?: number;
  /** Image source object when `mode="image"` */
  source?: ImageSourcePropType;
  /** Initials string (e.g. "AB") when `mode="text"` */
  label?: string;
  /** Material Design icon name (e.g. "account") when `mode="icon"` */
  icon?: string;
  /** Custom background fill color */
  backgroundColor?: string;
  /** Custom foreground/text color when `mode="text" | "icon"` */
  color?: string;
  /** Custom container styles */
  style?: StyleProp<ViewStyle>;
  /** Accessibility label describing the avatar */
  accessibilityLabel?: string;
}

export const Avatar: React.FC<AvatarProps> = ({
  mode = 'text',
  size = 40,
  source,
  label = 'SM',
  icon = 'account',
  backgroundColor,
  color,
  style,
  accessibilityLabel,
}) => {
  const theme = useTheme<SalahMateTheme>();
  const bg = backgroundColor ?? theme.colors.primaryContainer;
  const fg = color ?? theme.colors.onPrimaryContainer;

  return (
    <View
      style={[styles.container, style]}
      accessible
      accessibilityRole="image"
      accessibilityLabel={accessibilityLabel ?? (mode === 'text' ? `User ${label}` : 'User Avatar')}
    >
      {mode === 'image' && source ? (
        <PaperAvatar.Image size={size} source={source} style={{ backgroundColor: bg }} />
      ) : null}

      {mode === 'text' || (mode === 'image' && !source) ? (
        <PaperAvatar.Text
          size={size}
          label={label.slice(0, 2).toUpperCase()}
          style={{ backgroundColor: bg }}
          color={fg}
        />
      ) : null}

      {mode === 'icon' ? (
        <PaperAvatar.Icon size={size} icon={icon} style={{ backgroundColor: bg }} color={fg} />
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    overflow: 'hidden',
  },
});
