/**
 * SalahMate PasswordInput Component
 *
 * Secure password entry field wrapping our reusable `TextInput`.
 * Manages UI-level password visibility toggling (`eye` / `eye-off` icon button)
 * without introducing business logic or validation rules.
 *
 * Requirements Met:
 * - React Native Paper v5 MD3 theme integration (`useTheme`)
 * - Light and Dark theme responsiveness
 * - Accessibility (`accessibilityRole="button"` on toggle icon, dynamic labels)
 * - Strict TypeScript props without business logic
 */

import React, { useState } from 'react';
import { TextInput as PaperTextInput } from 'react-native-paper';
import { TextInput } from './TextInput';
import type { TextInputProps } from './TextInput';

export type PasswordInputProps = Omit<TextInputProps, 'secureTextEntry' | 'right'>;

export const PasswordInput: React.FC<PasswordInputProps> = ({
  label = 'Password',
  placeholder = 'Enter your password',
  accessibilityLabel,
  ...rest
}) => {
  const [isPasswordVisible, setIsPasswordVisible] = useState<boolean>(false);

  const toggleVisibility = () => {
    setIsPasswordVisible((prev) => !prev);
  };

  return (
    <TextInput
      label={label}
      placeholder={placeholder}
      secureTextEntry={!isPasswordVisible}
      right={
        <PaperTextInput.Icon
          icon={isPasswordVisible ? 'eye-off' : 'eye'}
          onPress={toggleVisibility}
          forceTextInputFocus={false}
          accessible
          accessibilityRole="button"
          accessibilityLabel={
            isPasswordVisible ? 'Hide password characters' : 'Show password characters'
          }
        />
      }
      accessibilityLabel={accessibilityLabel ?? (typeof label === 'string' ? label : 'Password')}
      {...rest}
    />
  );
};
