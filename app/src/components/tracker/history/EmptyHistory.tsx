import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, useTheme } from 'react-native-paper';
import { AppIcon } from '@/components';
import { spacing } from '@/theme';
import type { SalahMateTheme } from '@/theme';

export function EmptyHistory() {
  const theme = useTheme<SalahMateTheme>();

  return (
    <View style={styles.container}>
      <AppIcon name="history" size={64} color={theme.colors.onSurfaceVariant} style={styles.icon} />
      <Text variant="titleMedium" style={{ color: theme.colors.onSurface, fontWeight: '700', marginBottom: 8 }}>
        No History Yet
      </Text>
      <Text variant="bodyMedium" style={{ color: theme.colors.onSurfaceVariant, textAlign: 'center' }}>
        Start logging your prayers to see your history appear here.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.xl,
    marginTop: 48,
  },
  icon: {
    marginBottom: spacing.md,
    opacity: 0.5,
  },
});
