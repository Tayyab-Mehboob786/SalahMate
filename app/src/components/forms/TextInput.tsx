/**
 * SalahMate TextInput Component
 *
 * Form text entry component wrapping React Native Paper's `TextInput` (`mode="outlined"`).
 * Integrates optional error messages and descriptive helper text via `HelperText`.
 *
 * Requirements Met:
 * - React Native Paper v5 MD3 theme integration (`useTheme`)
 * - Light and Dark theme responsiveness
 * - Accessibility (`accessible`, `accessibilityLabel`, error announcements)
 * - Strict TypeScript props without business logic
 */

import React from 'react';
import { StyleSheet, View } from 'react-native';
import { HelperText, TextInput as PaperTextInput, useTheme } from 'react-native-paper';
import type { TextInputProps as PaperTextInputProps } from 'react-native-paper';
import { spacing } from '@/theme';
import type { SalahMateTheme } from '@/theme';

export interface TextInputProps extends Omit<PaperTextInputProps, 'theme'> {
  /** Error message displayed beneath the input field */
  errorMessage?: string;
  /** Descriptive helper text displayed when no error exists */
  helperText?: string;
}

const TextInputBase: React.FC<TextInputProps> = ({
  label,
  value,
  onChangeText,
  placeholder,
  error = false,
  errorMessage,
  helperText,
  disabled = false,
  mode = 'outlined',
  style,
  accessibilityLabel,
  accessibilityHint,
  ...rest
}) => {
  const theme = useTheme<SalahMateTheme>();
  const hasError = Boolean(error || errorMessage);

  return (
    <View style={styles.container}>
      <PaperTextInput
        label={label}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        error={hasError}
        disabled={disabled}
        mode={mode}
        style={[styles.input, { backgroundColor: theme.colors.surface }, style]}
        outlineColor={theme.colors.outline}
        activeOutlineColor={theme.colors.primary}
        outlineStyle={hasError ? { borderColor: theme.colors.error } : undefined}
        textColor={theme.colors.onSurface}
        placeholderTextColor={theme.colors.onSurfaceVariant}
        accessible
        accessibilityLabel={
          accessibilityLabel ?? (typeof label === 'string' ? label : placeholder) ?? 'Text Input'
        }
        accessibilityHint={accessibilityHint ?? (hasError ? errorMessage : helperText)}
        {...rest}
      />

      {(hasError && Boolean(errorMessage)) || Boolean(helperText) ? (
        <HelperText
          type={hasError ? 'error' : 'info'}
          visible={hasError ? Boolean(errorMessage) : Boolean(helperText)}
          style={styles.helperText}
          accessible
          accessibilityLiveRegion="polite"
        >
          {hasError ? errorMessage : helperText}
        </HelperText>
      ) : null}
    </View>
  );
};

export const TextInput = Object.assign(TextInputBase, {
  Icon: PaperTextInput.Icon,
  Affix: PaperTextInput.Affix,
});

const styles = StyleSheet.create({
  container: {
    marginVertical: spacing.xs,
    width: '100%',
  },
  input: {
    minHeight: spacing['3xl'], // Ensures minimum 48dp touch target
  },
  helperText: {
    paddingHorizontal: spacing.xs,
    paddingTop: 2,
  },
});
