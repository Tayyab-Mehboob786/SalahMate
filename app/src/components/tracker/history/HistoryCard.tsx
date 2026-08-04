import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, useTheme } from 'react-native-paper';
import { GlassCard } from '@/components/glass/GlassCard';
import { PrayerStatusRow } from './PrayerStatusRow';
import { spacing } from '@/theme';
import type { SalahMateTheme } from '@/theme';
import type { PrayerHistoryItem } from '@/api/prayers.api';

interface HistoryCardProps {
  item: PrayerHistoryItem;
}

export function HistoryCard({ item }: HistoryCardProps) {
  const theme = useTheme<SalahMateTheme>();

  // Format date: e.g., '2026-07-31' -> 'Friday, July 31'
  const d = new Date(item.date);
  const formattedDate = d.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  });

  return (
    <GlassCard borderRadius={16} style={styles.card}>
      <View style={styles.header}>
        <View>
          <Text variant="titleMedium" style={{ color: theme.colors.onSurface, fontWeight: '700' }}>
            {formattedDate}
          </Text>
          <Text variant="labelSmall" style={{ color: theme.colors.primary, fontWeight: '600' }}>
            15 Muharram 1447 AH
          </Text>
        </View>
        <View style={[styles.badge, { backgroundColor: theme.colors.primaryContainer }]}>
          <Text variant="labelSmall" style={{ color: theme.colors.onPrimaryContainer, fontWeight: '700' }}>
            {item.percentage}%
          </Text>
        </View>
      </View>

      <View style={[styles.divider, { backgroundColor: theme.colors.border }]} />

      <View style={styles.statusRowWrapper}>
        <PrayerStatusRow statuses={item.statuses} />
      </View>

      <View style={styles.footer}>
        <Text variant="labelSmall" style={{ color: theme.colors.onSurfaceVariant }}>
          {item.completedCount} out of {item.totalCount} prayers completed
        </Text>
      </View>
    </GlassCard>
  );
}

const styles = StyleSheet.create({
  card: {
    marginHorizontal: spacing.md,
    marginBottom: spacing.md,
    padding: spacing.md,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  divider: {
    height: 1,
    width: '100%',
    marginVertical: spacing.sm,
  },
  statusRowWrapper: {
    marginVertical: spacing.sm,
  },
  footer: {
    alignItems: 'center',
    marginTop: spacing.xs,
  },
});
