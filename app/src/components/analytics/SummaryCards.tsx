import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, useTheme } from 'react-native-paper';
import { GlassCard } from '@/components/glass/GlassCard';
import { spacing, type SalahMateTheme } from '@/theme';

interface SummaryCardsProps {
  overallCompletion: number;
  currentStreak: number;
  perfectDays: number;
}

export function SummaryCards({ overallCompletion, currentStreak, perfectDays }: SummaryCardsProps) {
  const theme = useTheme<SalahMateTheme>();

  return (
    <View style={styles.container}>
      <GlassCard borderRadius={16} style={styles.card}>
        <View style={styles.content}>
          <Text style={styles.icon}>🎯</Text>
          <Text style={[styles.value, { color: theme.colors.onSurface }]}>{overallCompletion}%</Text>
          <Text style={[styles.label, { color: theme.colors.onSurfaceVariant }]}>Completion</Text>
        </View>
      </GlassCard>

      <GlassCard borderRadius={16} style={styles.card}>
        <View style={styles.content}>
          <Text style={styles.icon}>🔥</Text>
          <Text style={[styles.value, { color: theme.colors.onSurface }]}>{currentStreak}</Text>
          <Text style={[styles.label, { color: theme.colors.onSurfaceVariant }]}>Streak</Text>
        </View>
      </GlassCard>

      <GlassCard borderRadius={16} style={styles.card}>
        <View style={styles.content}>
          <Text style={styles.icon}>✨</Text>
          <Text style={[styles.value, { color: theme.colors.onSurface }]}>{perfectDays}</Text>
          <Text style={[styles.label, { color: theme.colors.onSurfaceVariant }]}>Perfect</Text>
        </View>
      </GlassCard>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    marginHorizontal: spacing.md,
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
  card: {
    flex: 1,
  },
  content: {
    paddingVertical: spacing.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: {
    fontSize: 24,
    marginBottom: 4,
  },
  value: {
    fontSize: 20,
    fontWeight: '800',
  },
  label: {
    fontSize: 12,
    marginTop: 2,
  },
});
