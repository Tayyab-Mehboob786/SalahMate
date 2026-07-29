import React from 'react';
import { View, StyleSheet } from 'react-native';
import { SkeletonBase } from './SkeletonBase';
import { spacing } from '@/theme';

export const GoalSkeleton: React.FC = () => {
  return (
    <View style={styles.content}>
      <SkeletonBase width={120} height={16} borderRadius={6} style={{ marginBottom: spacing.md, marginLeft: spacing.sm }} />
      
      {[1, 2].map((_, index) => (
        <View key={index} style={styles.goalCard}>
          <View style={styles.goalHeader}>
            <View style={styles.goalTitleRow}>
              <SkeletonBase width={24} height={24} borderRadius={12} />
              <SkeletonBase width={150} height={22} borderRadius={6} style={{ marginLeft: spacing.sm }} />
            </View>
            <SkeletonBase width={60} height={20} borderRadius={12} />
          </View>
          
          <SkeletonBase width="40%" height={14} borderRadius={4} style={{ marginBottom: spacing.md }} />
          
          <SkeletonBase width="100%" height={8} borderRadius={4} style={{ marginBottom: spacing.sm }} />
          
          <View style={styles.goalFooter}>
            <View style={styles.footerCol}>
              <SkeletonBase width={70} height={12} borderRadius={4} style={{ marginBottom: 4 }} />
              <SkeletonBase width={90} height={16} borderRadius={6} />
            </View>
            <View style={styles.footerCol}>
              <SkeletonBase width={70} height={12} borderRadius={4} style={{ marginBottom: 4 }} />
              <SkeletonBase width={50} height={16} borderRadius={6} />
            </View>
            <View style={styles.footerCol}>
              <SkeletonBase width={70} height={12} borderRadius={4} style={{ marginBottom: 4 }} />
              <SkeletonBase width={80} height={16} borderRadius={6} />
            </View>
          </View>
        </View>
      ))}
      
      <SkeletonBase width="100%" height={48} borderRadius={24} style={{ marginTop: spacing.md }} />
    </View>
  );
};

const styles = StyleSheet.create({
  content: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
    paddingBottom: spacing['4xl'],
  },
  goalCard: {
    borderRadius: 24,
    backgroundColor: 'rgba(0,0,0,0.02)',
    padding: spacing.lg,
    marginBottom: spacing.md,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
  },
  goalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  goalTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  goalFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: spacing.sm,
  },
  footerCol: {
    flex: 1,
  },
});
