/**
 * SalahMate PrimaryButton Component
 *
 * High-emphasis action button wrapping React Native Paper's `Button`.
 * Upgraded to feature a premium emerald linear gradient background.
 *
 * Requirements Met:
 * - React Native Paper v5 MD3 theme integration (`useTheme`)
 * - Light and Dark theme responsiveness
 * - Accessibility (`accessibilityRole="button"`, labels, states, minimum 48dp touch target)
 * - Strict TypeScript props without business logic
 */

import React from 'react';
import { StyleSheet, View, Animated } from 'react-native';
import { Button, useTheme } from 'react-native-paper';
import type { ButtonProps } from 'react-native-paper';
import { LinearGradient } from 'expo-linear-gradient';
import { spacing } from '@/theme';
import type { SalahMateTheme } from '@/theme';

export interface PrimaryButtonProps extends Omit<ButtonProps, 'mode' | 'children'> {
  /** Text displayed inside the button */
  label: string;
  /** Whether the button should stretch horizontally across its parent container */
  fullWidth?: boolean;
}

export const PrimaryButton: React.FC<PrimaryButtonProps> = ({
  label,
  onPress,
  loading = false,
  disabled = false,
  icon,
  fullWidth = false,
  style,
  contentStyle,
  accessibilityLabel,
  accessibilityHint,
  ...rest
}) => {
  const theme = useTheme<SalahMateTheme>();

  return (
    <Animated.View style={[styles.container, fullWidth && styles.fullWidth, style as any]}>
      <LinearGradient
        colors={[theme.colors.primary, theme.colors.primaryContainer]}
        start={{ x: 0, y: 0.5 }}
        end={{ x: 1, y: 0.5 }}
        style={[styles.gradient, { borderRadius: theme.roundness * 2 }]}
      >
        <Button
          mode="contained"
          onPress={onPress}
          loading={loading}
          disabled={disabled}
          icon={icon}
          buttonColor="transparent"
          textColor={theme.colors.textOnPrimary}
          style={styles.button}
          contentStyle={[styles.content, contentStyle]}
          accessible
          accessibilityRole="button"
          accessibilityLabel={accessibilityLabel ?? label}
          accessibilityHint={accessibilityHint}
          accessibilityState={{ disabled, busy: loading }}
          {...rest}
        >
          {label}
        </Button>
      </LinearGradient>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: spacing.xs,
  },
  fullWidth: {
    width: '100%',
  },
  gradient: {
    width: '100%',
  },
  button: {
    marginVertical: 0,
    backgroundColor: 'transparent',
    elevation: 0, // Let the gradient act as the visual base
  },
  content: {
    minHeight: spacing['3xl'], // Ensures minimum 48dp mobile touch target (WCAG/MD3)
  },
});
