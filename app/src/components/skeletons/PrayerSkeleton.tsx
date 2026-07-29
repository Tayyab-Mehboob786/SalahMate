import React from 'react';
import { View, StyleSheet } from 'react-native';
import { SkeletonBase } from './SkeletonBase';
import { spacing } from '@/theme';

export const PrayerSkeleton: React.FC = () => {
  return (
    <View style={styles.content}>
      {/* Next Prayer Hero */}
      <SkeletonBase width="100%" height={110} borderRadius={20} style={{ marginBottom: spacing.xl }} />

      {/* Timetable Section Header */}
      <View style={styles.sectionHeaderRow}>
        <SkeletonBase width={140} height={20} borderRadius={6} />
        <SkeletonBase width={100} height={16} borderRadius={6} />
      </View>

      {/* Timetable List Card */}
      <View style={styles.timetableCard}>
        {[1, 2, 3, 4, 5, 6].map((_, index) => (
          <View key={index} style={styles.tableRow}>
            <View style={styles.nameCol}>
              <SkeletonBase width={22} height={22} borderRadius={11} />
              <SkeletonBase width={80} height={18} borderRadius={6} style={{ marginLeft: spacing.md }} />
            </View>
            <SkeletonBase width={70} height={18} borderRadius={6} />
          </View>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  content: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  timetableCard: {
    borderRadius: 22,
    backgroundColor: 'rgba(0,0,0,0.02)', 
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
  },
  tableRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.05)',
  },
  nameCol: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});
