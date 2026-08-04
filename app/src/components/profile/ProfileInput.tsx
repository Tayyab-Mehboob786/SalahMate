import React from 'react';
import { TextInput } from '@/components/forms/TextInput';
import { AppIcon } from '@/components/common/AppIcon';
import type { SalahMateTheme } from '@/theme';
import { useTheme } from 'react-native-paper';

interface ProfileInputProps {
  label: string;
  value: string;
  onChangeText: (text: string) => void;
  error?: string;
  icon?: string;
}

export const ProfileInput: React.FC<ProfileInputProps> = ({ label, value, onChangeText, error, icon }) => {
  const theme = useTheme<SalahMateTheme>();
  return (
    <TextInput
      label={label}
      value={value}
      onChangeText={onChangeText}
      errorMessage={error}
      error={!!error}
      left={icon ? <TextInput.Icon icon={() => <AppIcon name={icon as any} size="md" color={theme.colors.onSurfaceVariant} />} /> : undefined}
    />
  );
};
