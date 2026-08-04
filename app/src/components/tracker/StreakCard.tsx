import React from 'react';
import { View, StyleSheet, ActivityIndicator, Pressable } from 'react-native';
import { Text, useTheme } from 'react-native-paper';
import { GlassCard } from '@/components/glass/GlassCard';
import type { StreakData } from '@/api/prayers.api';
import type { SalahMateTheme } from '@/theme';
import { spacing } from '@/theme';

interface StreakCardProps {
  data: StreakData | null;
  isLoading: boolean;
}

export function StreakCard({ data, isLoading }: StreakCardProps) {
  const theme = useTheme<SalahMateTheme>();

  return (
    <GlassCard borderRadius={16} style={styles.card}>
      <Pressable 
        style={({ pressed }) => [
          styles.container,
          pressed && { backgroundColor: theme.colors.surfaceVariant }
        ]}
      >
        {isLoading || !data ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="small" color={theme.colors.primary} />
          </View>
        ) : (
          <View style={styles.metricsContainer}>
            <Text style={[styles.statText, { color: theme.colors.onSurface }]}>
              🔥 Current: <Text style={{ fontWeight: '700' }}>{data.currentStreak}</Text> {data.currentStreak === 1 ? 'Day' : 'Days'}
            </Text>
            
            <View style={[styles.divider, { backgroundColor: theme.colors.outlineVariant }]} />
            
            <Text style={[styles.statText, { color: theme.colors.onSurface }]}>
              🏆 Best: <Text style={{ fontWeight: '700' }}>{data.longestStreak}</Text>
            </Text>
            
            <View style={[styles.divider, { backgroundColor: theme.colors.outlineVariant }]} />
            
            <Text style={[styles.statText, { color: theme.colors.onSurface }]}>
              📈 Wkly: <Text style={{ fontWeight: '700' }}>{data.weeklyConsistency}%</Text>
            </Text>
          </View>
        )}
      </Pressable>
    </GlassCard>
  );
}

const styles = StyleSheet.create({
  card: {
    marginHorizontal: spacing.md,
    marginBottom: spacing.sm,
    overflow: 'hidden',
  },
  container: {
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  loadingContainer: {
    paddingVertical: spacing.xs,
    justifyContent: 'center',
    alignItems: 'center',
  },
  metricsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  statText: {
    fontSize: 13,
  },
  divider: {
    width: 1,
    height: 16,
  },
});
