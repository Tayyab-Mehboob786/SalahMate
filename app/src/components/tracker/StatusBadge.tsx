import React from 'react';
import { View, StyleSheet, StyleProp, ViewStyle } from 'react-native';
import { Text, useTheme } from 'react-native-paper';
import { AppIcon } from '@/components/common/AppIcon';
import type { SalahMateTheme } from '@/theme';

export type PrayerStatus = 'Completed' | 'Pending' | 'Missed' | 'Qada';

interface StatusBadgeProps {
  status: PrayerStatus;
  style?: StyleProp<ViewStyle>;
}

export function StatusBadge({ status, style }: StatusBadgeProps) {
  const theme = useTheme<SalahMateTheme>();

  const getStatusConfig = () => {
    switch (status) {
      case 'Completed':
        return {
          icon: 'check-circle' as const,
          color: theme.colors.success,
          bgColor: theme.colors.primaryContainer,
          textColor: theme.colors.onPrimaryContainer,
        };
      case 'Pending':
        return {
          icon: 'clock-outline' as const,
          color: theme.colors.primary,
          bgColor: theme.colors.surfaceVariant,
          textColor: theme.colors.onSurfaceVariant,
        };
      case 'Missed':
        return {
          icon: 'close-circle-outline' as const,
          color: theme.colors.error,
          bgColor: theme.colors.errorContainer,
          textColor: theme.colors.onErrorContainer,
        };
      case 'Qada':
        return {
          icon: 'restore' as const,
          color: theme.colors.warning,
          bgColor: '#FFF3E0', // Dummy fallback for Qada bg
          textColor: theme.colors.warning,
        };
      default:
        return {
          icon: 'circle-outline' as const,
          color: theme.colors.disabled,
          bgColor: theme.colors.surfaceVariant,
          textColor: theme.colors.onSurfaceVariant,
        };
    }
  };

  const config = getStatusConfig();

  // Override Qada bg for dark mode safely
  if (status === 'Qada' && theme.dark) {
    config.bgColor = '#4E342E';
  }

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: config.bgColor, borderColor: config.color },
        style,
      ]}
    >
      <AppIcon name={config.icon as any} size={14} color={config.color} />
      <Text
        variant="labelSmall"
        style={[styles.text, { color: config.textColor }]}
      >
        {status}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 1,
    gap: 4,
  },
  text: {
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    fontSize: 10,
  },
});
