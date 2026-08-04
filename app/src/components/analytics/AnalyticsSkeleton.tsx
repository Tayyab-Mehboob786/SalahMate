import React from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import { useTheme } from 'react-native-paper';
import { GlassCard } from '@/components/glass/GlassCard';
import { spacing, type SalahMateTheme } from '@/theme';

export function AnalyticsSkeleton() {
  const theme = useTheme<SalahMateTheme>();
  const skeletonColor = theme.colors.surfaceVariant;

  return (
    <View style={styles.container}>
      {/* Period Filter Skeleton */}
      <View style={styles.filterContainer}>
        {[1, 2, 3, 4].map((i) => (
          <View key={i} style={[styles.filterTab, { backgroundColor: skeletonColor }]} />
        ))}
      </View>

      {/* Summary Cards Skeleton */}
      <View style={styles.summaryContainer}>
        {[1, 2, 3].map((i) => (
          <GlassCard key={i} borderRadius={16} style={styles.summaryCard}>
            <View style={styles.summaryContent}>
              <View style={[styles.circle, { backgroundColor: skeletonColor }]} />
              <View style={[styles.line, { backgroundColor: skeletonColor, width: 40, marginTop: 8 }]} />
              <View style={[styles.line, { backgroundColor: skeletonColor, width: 60, marginTop: 4 }]} />
            </View>
          </GlassCard>
        ))}
      </View>

      {/* Chart Skeleton 1 */}
      <GlassCard borderRadius={16} style={styles.chartCard}>
        <View style={styles.chartContent}>
          <View style={[styles.line, { backgroundColor: skeletonColor, width: 150, alignSelf: 'flex-start', marginBottom: 20 }]} />
          <View style={[styles.box, { backgroundColor: skeletonColor, height: 160 }]} />
        </View>
      </GlassCard>

      {/* Chart Skeleton 2 */}
      <GlassCard borderRadius={16} style={styles.chartCard}>
        <View style={styles.chartContent}>
          <View style={[styles.line, { backgroundColor: skeletonColor, width: 120, alignSelf: 'flex-start', marginBottom: 20 }]} />
          <View style={[styles.box, { backgroundColor: skeletonColor, height: 160 }]} />
        </View>
      </GlassCard>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  filterContainer: {
    flexDirection: 'row',
    marginHorizontal: spacing.md,
    marginBottom: spacing.md,
    gap: spacing.sm,
  },
  filterTab: {
    flex: 1,
    height: 36,
    borderRadius: 20,
    opacity: 0.5,
  },
  summaryContainer: {
    flexDirection: 'row',
    marginHorizontal: spacing.md,
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
  summaryCard: {
    flex: 1,
  },
  summaryContent: {
    padding: spacing.md,
    alignItems: 'center',
  },
  circle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    opacity: 0.5,
  },
  line: {
    height: 12,
    borderRadius: 6,
    opacity: 0.5,
  },
  box: {
    width: '100%',
    borderRadius: 12,
    opacity: 0.5,
  },
  chartCard: {
    marginHorizontal: spacing.md,
    marginBottom: spacing.md,
  },
  chartContent: {
    padding: spacing.md,
  },
});
