import React from 'react';
import { View, StyleSheet } from 'react-native';
import { SkeletonBase } from './SkeletonBase';
import { spacing } from '@/theme';

export const AnalyticsSkeleton: React.FC = () => {
  return (
    <View style={styles.content}>
      {/* Weekly Consistency Hero */}
      <View style={styles.heroCard}>
        <View style={styles.heroRow}>
          <SkeletonBase width={110} height={110} borderRadius={55} />
          <View style={styles.heroInfo}>
            <SkeletonBase width={120} height={20} borderRadius={10} style={{ marginBottom: spacing.sm }} />
            <SkeletonBase width="100%" height={24} borderRadius={8} style={{ marginBottom: spacing.xs }} />
            <SkeletonBase width="80%" height={16} borderRadius={6} />
          </View>
        </View>
      </View>

      {/* Metrics Row */}
      <View style={styles.row}>
        <View style={styles.column}>
          <SkeletonBase width="100%" height={100} borderRadius={20} />
        </View>
        <View style={styles.column}>
          <SkeletonBase width="100%" height={100} borderRadius={20} />
        </View>
      </View>

      {/* Prayer Breakdown Header */}
      <View style={styles.sectionHeaderRow}>
        <SkeletonBase width={180} height={20} borderRadius={6} />
        <SkeletonBase width={80} height={16} borderRadius={6} />
      </View>

      {/* Breakdown List */}
      {[1, 2, 3, 4, 5].map((_, index) => (
        <View key={index} style={styles.breakdownCard}>
          <View style={styles.breakdownContent}>
            <SkeletonBase width={48} height={48} borderRadius={14} />
            <View style={styles.breakdownInfo}>
              <View style={styles.nameRow}>
                <SkeletonBase width={80} height={20} borderRadius={6} />
                <SkeletonBase width={40} height={20} borderRadius={6} />
              </View>
              <SkeletonBase width="100%" height={8} borderRadius={4} style={{ marginVertical: 8 }} />
              <View style={styles.nameRow}>
                <SkeletonBase width={90} height={14} borderRadius={4} />
                <SkeletonBase width={80} height={14} borderRadius={4} />
              </View>
            </View>
          </View>
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  content: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
    paddingBottom: spacing['4xl'],
  },
  heroCard: {
    borderRadius: 24,
    backgroundColor: 'rgba(0,0,0,0.02)',
    padding: spacing.lg,
    marginBottom: spacing.md,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
  },
  heroRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  heroInfo: {
    flex: 1,
    marginLeft: spacing.lg,
  },
  row: {
    flexDirection: 'row',
    gap: spacing.md,
    marginBottom: spacing.xl,
  },
  column: {
    flex: 1,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  breakdownCard: {
    borderRadius: 18,
    backgroundColor: 'rgba(0,0,0,0.02)',
    marginBottom: spacing.sm,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
    padding: spacing.md,
  },
  breakdownContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  breakdownInfo: {
    flex: 1,
    marginLeft: spacing.md,
  },
  nameRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
});
