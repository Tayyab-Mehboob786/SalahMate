import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, useTheme } from 'react-native-paper';
import { GlassCard } from '@/components/glass/GlassCard';
import { ProgressRing } from '@/components/charts/ProgressRing';
import { MotivationMessage } from './MotivationMessage';
import type { SalahMateTheme } from '@/theme';
import { spacing } from '@/theme';

interface PrayerProgressCardProps {
  completedCount: number;
  totalCount: number;
  percentage: number;
  motivationMessage: string;
  progressColor: string;
  statuses?: string[];
}

export function PrayerProgressCard({
  completedCount,
  totalCount,
  percentage,
  motivationMessage,
  progressColor,
  statuses,
}: PrayerProgressCardProps) {
  const theme = useTheme<SalahMateTheme>();

  // ProgressRing expects a value between 0 and 1
  const progressValue = totalCount > 0 ? completedCount / totalCount : 0;

  return (
    <GlassCard borderRadius={16} style={styles.card}>
      <View style={styles.container}>
        <ProgressRing
          progress={progressValue}
          statuses={statuses}
          size={72}
          strokeWidth={8}
          valueText={`${percentage}%`}
          color={progressColor}
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
            style={{ color: theme.colors.onSurfaceVariant, marginTop: 2, fontSize: 13 }}
          >
            {completedCount} / {totalCount} Prayers
          </Text>
          <MotivationMessage message={motivationMessage} color={progressColor} />
        </View>
      </View>
    </GlassCard>
  );
}

const styles = StyleSheet.create({
  card: {
    marginHorizontal: spacing.md,
    marginBottom: spacing.xs,
  },
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    gap: spacing.md,
  },
  info: {
    flex: 1,
    justifyContent: 'center',
  },
  title: {
    fontWeight: '800',
    fontSize: 15,
  },
});
