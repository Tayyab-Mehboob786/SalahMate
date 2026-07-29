/**
 * SalahMate LoadingIndicator Component
 *
 * Feedback component wrapping React Native Paper's `ActivityIndicator`.
 * Supports full-screen centering and descriptive loading labels.
 *
 * Requirements Met:
 * - React Native Paper v5 MD3 theme integration (`useTheme`)
 * - Light and Dark theme responsiveness
 * - Accessibility (`accessibilityRole="progressbar"`, live region announcement)
 * - Strict TypeScript props without business logic
 */

import React from 'react';
import { StyleSheet, View } from 'react-native';
import { ActivityIndicator, Text, useTheme } from 'react-native-paper';
import type { ActivityIndicatorProps } from 'react-native-paper';
import { spacing } from '@/theme';
import type { SalahMateTheme } from '@/theme';

export interface LoadingIndicatorProps extends Omit<ActivityIndicatorProps, 'theme'> {
  /** Optional descriptive message displayed beneath the loading spinner */
  label?: string;
  /** Whether the indicator should vertically and horizontally center across the screen */
  fullScreen?: boolean;
}

export const LoadingIndicator: React.FC<LoadingIndicatorProps> = ({
  size = 'large',
  color,
  label,
  fullScreen = false,
  style,
  accessibilityLabel,
  ...rest
}) => {
  const theme = useTheme<SalahMateTheme>();

  return (
    <View
      style={[
        styles.container,
        fullScreen && styles.fullScreen,
        fullScreen && { backgroundColor: theme.colors.background },
        style,
      ]}
      accessible
      accessibilityRole="progressbar"
      accessibilityLabel={accessibilityLabel ?? label ?? 'Loading content'}
      accessibilityLiveRegion="polite"
    >
      <ActivityIndicator size={size} color={color ?? theme.colors.primary} {...rest} />
      {label ? (
        <Text style={[styles.label, { color: theme.colors.onSurfaceVariant }]}>{label}</Text>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: spacing.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  fullScreen: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  label: {
    marginTop: spacing.sm,
    fontSize: 14,
    fontWeight: '500',
    textAlign: 'center',
  },
});
