import React from 'react';
import { View, StyleSheet } from 'react-native';
import { SkeletonBase } from './SkeletonBase';
import { spacing } from '@/theme';

export const HomeSkeleton: React.FC = () => {
  return (
    <View style={styles.container}>
      {/* 1. Header (Greeting + Date + Location) */}
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <SkeletonBase width={32} height={32} borderRadius={16} />
          <View style={styles.headerText}>
            <SkeletonBase width="60%" height={24} borderRadius={8} />
            <SkeletonBase width="40%" height={16} borderRadius={8} style={{ marginTop: 8 }} />
            <SkeletonBase width="30%" height={12} borderRadius={6} style={{ marginTop: 8 }} />
          </View>
        </View>
      </View>

      <View style={styles.content}>
        {/* 3. AI Spiritual Insights Card */}
        <SkeletonBase width="100%" height={64} borderRadius={16} style={{ marginBottom: spacing.md }} />

        {/* 4. Daily Summary Card */}
        <SkeletonBase width="100%" height={90} borderRadius={16} style={{ marginBottom: spacing.md }} />

        {/* 5. Current Goal Widget */}
        <SkeletonBase width="100%" height={160} borderRadius={24} style={{ marginBottom: spacing.md }} />

        {/* 6. Today's Prayers */}
        <SkeletonBase width={120} height={20} borderRadius={8} style={{ marginBottom: spacing.sm }} />
        <View style={styles.row}>
          {[1, 2, 3, 4, 5].map((_, i) => (
            <SkeletonBase key={i} flex={1} height={70} borderRadius={12} style={{ marginHorizontal: 2 }} />
          ))}
        </View>

        {/* 7. Islamic Companion */}
        <SkeletonBase width={140} height={20} borderRadius={8} style={{ marginTop: spacing.md, marginBottom: spacing.sm }} />
        <View style={styles.row}>
          {[1, 2, 3, 4].map((_, i) => (
            <SkeletonBase key={i} flex={1} aspectRatio={1} borderRadius={14} style={{ marginHorizontal: spacing.sm / 2 }} />
          ))}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: spacing.lg,
    paddingTop: 60,
    paddingBottom: spacing.lg,
  },
  headerTop: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerText: {
    marginLeft: spacing.md,
    flex: 1,
    alignItems: 'center',
  },
  content: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});
