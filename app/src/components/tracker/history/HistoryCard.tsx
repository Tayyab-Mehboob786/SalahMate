import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text } from 'react-native-paper';
import { PrayerStatusRow } from './PrayerStatusRow';
import { spacing } from '@/theme';
import type { PrayerHistoryItem } from '@/api/prayers.api';

interface HistoryCardProps {
  item: PrayerHistoryItem;
}

export function HistoryCard({ item }: HistoryCardProps) {

  // Format date: e.g., '2026-07-31' -> 'Friday, July 31'
  const d = new Date(item.date);
  const formattedDate = d.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  });

  let hijriDateStr = '';
  try {
    const hijriFormatter = new Intl.DateTimeFormat('en-US-u-ca-islamic', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
    hijriDateStr = hijriFormatter.format(d);
  } catch (e) {
    // Fallback if Hermes/JSC doesn't support the calendar
    hijriDateStr = '';
  }

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <View>
          <Text variant="titleMedium" style={{ color: '#FFFFFF', fontWeight: '700' }}>
            {formattedDate}
          </Text>
          <Text variant="labelSmall" style={{ color: 'rgba(255,255,255,0.8)', fontWeight: '600' }}>
            {hijriDateStr}
          </Text>
        </View>
        <View style={styles.badge}>
          <Text variant="labelSmall" style={{ color: '#FFFFFF', fontWeight: '700' }}>
            {item.percentage}%
          </Text>
        </View>
      </View>

      <View style={styles.divider} />

      <View style={styles.statusRowWrapper}>
        <PrayerStatusRow statuses={item.statuses} />
      </View>

      <View style={styles.footer}>
        <Text variant="labelSmall" style={{ color: 'rgba(255,255,255,0.8)' }}>
          {item.completedCount} out of {item.totalCount} prayers completed
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    marginHorizontal: spacing.md,
    marginBottom: spacing.md,
    padding: spacing.md,
    backgroundColor: 'rgba(0,0,0,0.35)',
    borderRadius: 24,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.15)',
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
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
  },
  divider: {
    height: 1,
    width: '100%',
    marginVertical: spacing.sm,
    backgroundColor: 'rgba(255,255,255,0.15)',
  },
  statusRowWrapper: {
    marginVertical: spacing.sm,
  },
  footer: {
    alignItems: 'center',
    marginTop: spacing.xs,
  },
});
