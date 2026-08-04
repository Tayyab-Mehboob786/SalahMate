import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Text, useTheme } from 'react-native-paper';
import { AppIcon } from '@/components/common/AppIcon';
import { spacing } from '@/theme';
import type { SalahMateTheme } from '@/theme';

interface ReadOnlyFieldProps {
  label: string;
  value: string;
  icon?: string;
}

export const ReadOnlyField: React.FC<ReadOnlyFieldProps> = ({ label, value, icon = 'lock' }) => {
  const theme = useTheme<SalahMateTheme>();
  return (
    <View style={[styles.container, { backgroundColor: theme.colors.surfaceVariant }]}>
      <View style={styles.left}>
        <AppIcon name={icon as any} size="md" color={theme.colors.onSurfaceVariant} />
        <View style={styles.textContainer}>
          <Text variant="labelSmall" style={{ color: theme.colors.onSurfaceVariant }}>{label}</Text>
          <Text variant="bodyMedium" style={{ color: theme.colors.onSurfaceVariant }}>{value}</Text>
        </View>
      </View>
      <AppIcon name="lock" size="sm" color={theme.colors.onSurfaceVariant} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: spacing.md,
    borderRadius: 16,
    marginBottom: spacing.sm,
  },
  left: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  textContainer: {
    justifyContent: 'center',
  },
});
