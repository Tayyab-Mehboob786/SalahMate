import React from 'react';
import { View, StyleSheet } from 'react-native';
import { GlassCard } from '@/components/glass/GlassCard';
import { SkeletonBase } from '@/components/skeletons/SkeletonBase';
import { spacing } from '@/theme';

export function HistorySkeleton() {
  return (
    <>
      {[1, 2, 3].map((key) => (
        <GlassCard key={key} borderRadius={16} style={styles.card}>
          <View style={styles.header}>
            <View>
              <SkeletonBase width={150} height={20} borderRadius={4} />
              <SkeletonBase width={100} height={14} borderRadius={4} style={{ marginTop: 6 }} />
            </View>
            <SkeletonBase width={40} height={24} borderRadius={12} />
          </View>
          
          <SkeletonBase width="100%" height={1} borderRadius={0} style={{ marginVertical: spacing.sm }} />
          
          <View style={styles.statusRow}>
            {[1, 2, 3, 4, 5].map((i) => (
              <SkeletonBase key={i} width={24} height={24} borderRadius={12} />
            ))}
          </View>
          
          <View style={styles.footer}>
            <SkeletonBase width={200} height={14} borderRadius={4} />
          </View>
        </GlassCard>
      ))}
    </>
  );
}

const styles = StyleSheet.create({
  card: {
    marginHorizontal: spacing.md,
    marginBottom: spacing.md,
    padding: spacing.md,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  statusRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 8,
    marginVertical: spacing.sm,
  },
  footer: {
    alignItems: 'center',
    marginTop: spacing.xs,
  },
});
