import React from 'react';
import { View, StyleSheet } from 'react-native';
import { SkeletonBase } from './SkeletonBase';
import { spacing } from '@/theme';

export const QuranSkeleton: React.FC = () => {
  return (
    <View style={styles.content}>
      {/* Search Bar */}
      <SkeletonBase width="100%" height={48} borderRadius={24} style={{ marginBottom: spacing.lg }} />

      {/* Continue Reading Card */}
      <View style={styles.continueCard}>
        <View style={styles.continueHeader}>
          <SkeletonBase width={140} height={20} borderRadius={6} />
          <SkeletonBase width={100} height={16} borderRadius={6} />
        </View>
        <View style={styles.continueBody}>
          <View style={styles.continueInfo}>
            <SkeletonBase width={120} height={28} borderRadius={8} style={{ marginBottom: spacing.xs }} />
            <SkeletonBase width={160} height={16} borderRadius={6} style={{ marginBottom: spacing.md }} />
            <SkeletonBase width="100%" height={6} borderRadius={3} />
          </View>
          <SkeletonBase width={76} height={76} borderRadius={38} style={{ marginLeft: spacing.lg }} />
        </View>
      </View>

      {/* Tabs */}
      <View style={styles.tabsContainer}>
        <SkeletonBase flex={1} height={40} borderRadius={20} style={{ marginRight: spacing.sm }} />
        <SkeletonBase flex={1} height={40} borderRadius={20} />
      </View>

      {/* Surah List */}
      {[1, 2, 3, 4, 5].map((_, index) => (
        <View key={index} style={styles.surahCard}>
          <View style={styles.surahContent}>
            <SkeletonBase width={42} height={42} borderRadius={14} />
            <View style={styles.surahInfo}>
              <SkeletonBase width={100} height={20} borderRadius={6} style={{ marginBottom: 4 }} />
              <SkeletonBase width={140} height={14} borderRadius={4} />
            </View>
            <SkeletonBase width={60} height={28} borderRadius={6} />
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
  continueCard: {
    borderRadius: 24,
    backgroundColor: 'rgba(0,0,0,0.02)',
    padding: spacing.lg,
    marginBottom: spacing.xl,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
  },
  continueHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  continueBody: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  continueInfo: {
    flex: 1,
  },
  tabsContainer: {
    flexDirection: 'row',
    marginBottom: spacing.md,
  },
  surahCard: {
    borderRadius: 18,
    backgroundColor: 'rgba(0,0,0,0.02)',
    padding: spacing.md,
    marginBottom: spacing.sm,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
  },
  surahContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  surahInfo: {
    flex: 1,
    marginLeft: spacing.md,
  },
});
