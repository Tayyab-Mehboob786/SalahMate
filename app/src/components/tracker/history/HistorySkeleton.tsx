import React from 'react';
import { View, StyleSheet } from 'react-native';
import { SkeletonBase } from '@/components/skeletons/SkeletonBase';
import { spacing } from '@/theme';

export function HistorySkeleton() {
  return (
    <>
      {[1, 2, 3].map((key) => (
        <View key={key} style={styles.card}>
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
        </View>
      ))}
    </>
  );
}

const styles = StyleSheet.create({
  card: {
    marginHorizontal: spacing.md,
    marginBottom: spacing.md,
    padding: spacing.md,
    backgroundColor: 'rgba(0,0,0,0.35)',
    borderRadius: 24,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.15)',
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
