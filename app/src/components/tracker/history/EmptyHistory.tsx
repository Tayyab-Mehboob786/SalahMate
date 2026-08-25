import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text } from 'react-native-paper';
import { AppIcon } from '@/components/common/AppIcon';
import { spacing } from '@/theme';

export function EmptyHistory() {
  return (
    <View style={styles.container}>
      <AppIcon name="history" size={64} color="rgba(255,255,255,0.7)" style={styles.icon} />
      <Text variant="titleMedium" style={{ color: '#FFFFFF', fontWeight: '700', marginBottom: 8 }}>
        No History Yet
      </Text>
      <Text variant="bodyMedium" style={{ color: 'rgba(255,255,255,0.8)', textAlign: 'center' }}>
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
