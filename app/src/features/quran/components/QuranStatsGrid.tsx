import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, useTheme } from 'react-native-paper';
import { GlassCard, AppIcon } from '@/components';
import { spacing } from '@/theme';
import type { SalahMateTheme } from '@/theme';
import { ReadingProgress } from '../types/quran.types';

interface QuranStatsGridProps {
  progress?: ReadingProgress | null;
}

export const QuranStatsGrid: React.FC<QuranStatsGridProps> = ({ progress }) => {
  const theme = useTheme<SalahMateTheme>();

  // Use progress data or defaults
  const stats = [
    { label: 'Pages Read', value: progress?.completedPages.length ?? 0, icon: 'book-open-page-variant-outline', color: '#19698C' },
    { label: 'Streak', value: `${progress?.streakDays ?? 0} d`, icon: 'fire', color: '#E25C5C' },
    { label: 'Bookmarks', value: 3, icon: 'bookmark-outline', color: '#D4AF37' }, // mocked 3
    { label: 'Time Read', value: `${progress?.readingTimeMinutes ?? 0} m`, icon: 'clock-outline', color: '#4A90E2' },
  ];

  return (
    <View style={styles.container}>
      <Text variant="titleMedium" style={[styles.sectionTitle, { color: theme.colors.onBackground }]}>
        Your Journey
      </Text>
      
      <View style={styles.grid}>
        {stats.map((stat, index) => (
          <View key={index} style={styles.gridItem}>
            <GlassCard style={styles.card}>
              <View style={[styles.iconContainer, { backgroundColor: `${stat.color}15` }]}>
                <AppIcon name={stat.icon as any} size={20} color={stat.color} />
              </View>
              <Text variant="headlineSmall" style={[styles.value, { color: theme.colors.onSurface }]}>
                {stat.value}
              </Text>
              <Text variant="labelSmall" style={[styles.label, { color: theme.colors.onSurfaceVariant }]}>
                {stat.label}
              </Text>
            </GlassCard>
          </View>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginHorizontal: spacing.lg,
    marginVertical: spacing.md,
  },
  sectionTitle: {
    fontWeight: '700',
    marginBottom: spacing.sm,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -spacing.xs,
  },
  gridItem: {
    width: '50%',
    padding: spacing.xs,
  },
  card: {
    padding: spacing.md,
    alignItems: 'center',
    borderRadius: 16,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  value: {
    fontWeight: '800',
    marginBottom: 2,
  },
  label: {
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  }
});
