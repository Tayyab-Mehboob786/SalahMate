import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, useTheme } from 'react-native-paper';
import { GlassCard } from '@/components/glass/GlassCard';
import { ProgressRing } from '@/components/charts/ProgressRing';
import type { SalahMateTheme } from '@/theme';
import { spacing } from '@/theme';

interface ProgressCardProps {
  completed: number;
  total: number;
}

export function ProgressCard({ completed, total }: ProgressCardProps) {
  const theme = useTheme<SalahMateTheme>();
  const progress = total > 0 ? completed / total : 0;
  const percentage = Math.round(progress * 100);

  return (
    <GlassCard borderRadius={24} style={styles.card}>
      <View style={styles.container}>
        <ProgressRing
          progress={progress}
          size={100}
          strokeWidth={10}
          valueText={`${percentage}%`}
        />
        <View style={styles.info}>
          <Text
            variant="titleMedium"
            style={[styles.title, { color: theme.colors.onSurface }]}
          >
            Daily Progress
          </Text>
          <Text
            variant="bodyMedium"
            style={{ color: theme.colors.onSurfaceVariant, marginTop: 4 }}
          >
            {completed} of {total} prayers completed
          </Text>
          {percentage === 100 && (
            <Text
              variant="labelMedium"
              style={{ color: theme.colors.success, marginTop: 8, fontWeight: '700' }}
            >
              Mashallah! All prayers done.
            </Text>
          )}
        </View>
      </View>
    </GlassCard>
  );
}

const styles = StyleSheet.create({
  card: {
    marginHorizontal: spacing.md,
    marginBottom: spacing.md,
  },
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.md,
    gap: spacing.lg,
  },
  info: {
    flex: 1,
    justifyContent: 'center',
  },
  title: {
    fontWeight: '800',
  },
});
