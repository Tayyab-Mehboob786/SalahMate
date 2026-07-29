/**
 * SalahMate SecondaryButton Component
 *
 * Medium-emphasis action button wrapping React Native Paper's `Button` (`mode="outlined"`).
 * Provides clean visual contrast without competing with the PrimaryButton.
 *
 * Requirements Met:
 * - React Native Paper v5 MD3 theme integration (`useTheme`)
 * - Light and Dark theme responsiveness (`outline` border and `primary` text)
 * - Accessibility (`accessibilityRole="button"`, labels, states, minimum 48dp touch target)
 * - Strict TypeScript props without business logic
 */

import React from 'react';
import { StyleSheet } from 'react-native';
import { Button, useTheme } from 'react-native-paper';
import type { ButtonProps } from 'react-native-paper';
import { spacing } from '@/theme';
import type { SalahMateTheme } from '@/theme';

export interface SecondaryButtonProps extends Omit<ButtonProps, 'mode' | 'children'> {
  /** Text displayed inside the button */
  label: string;
  /** Whether the button should stretch horizontally across its parent container */
  fullWidth?: boolean;
}

export const SecondaryButton: React.FC<SecondaryButtonProps> = ({
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
    <Button
      mode="outlined"
      onPress={onPress}
      loading={loading}
      disabled={disabled}
      icon={icon}
      textColor={theme.colors.primary}
      style={[
        styles.container,
        fullWidth && styles.fullWidth,
        {
          borderRadius: theme.roundness * 2,
          borderColor: theme.colors.outline,
        },
        style,
      ]}
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
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: spacing.xs,
  },
  fullWidth: {
    width: '100%',
  },
  content: {
    minHeight: spacing['3xl'], // Ensures minimum 48dp mobile touch target (WCAG/MD3)
  },
});
