import React, { useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import { useTheme } from 'react-native-paper';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withRepeat, 
  withTiming, 
  withSequence
} from 'react-native-reanimated';
import { spacing } from '@/theme';
import type { SalahMateTheme } from '@/theme';
import { GlassCard } from '@/components';

export const QuranListSkeleton = () => {
  const theme = useTheme<SalahMateTheme>();
  const opacity = useSharedValue(0.3);

  useEffect(() => {
    opacity.value = withRepeat(
      withSequence(
        withTiming(0.7, { duration: 800 }),
        withTiming(0.3, { duration: 800 })
      ),
      -1,
      true
    );
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  const SkeletonRow = () => (
    <View style={styles.container}>
      <GlassCard style={styles.card}>
        <View style={styles.contentRow}>
          {/* Avatar Skeleton */}
          <Animated.View style={[styles.avatar, { backgroundColor: theme.colors.surfaceVariant }, animatedStyle]} />
          
          <View style={styles.details}>
            {/* Title Skeleton */}
            <Animated.View style={[styles.lineLarge, { backgroundColor: theme.colors.surfaceVariant }, animatedStyle]} />
            {/* Subtitle Skeleton */}
            <Animated.View style={[styles.lineSmall, { backgroundColor: theme.colors.surfaceVariant }, animatedStyle]} />
          </View>
        </View>

        <View style={[styles.footer, { borderTopColor: theme.colors.border }]}>
          <Animated.View style={[styles.footerItem, { backgroundColor: theme.colors.surfaceVariant }, animatedStyle]} />
          <Animated.View style={[styles.footerItem, { backgroundColor: theme.colors.surfaceVariant }, animatedStyle]} />
        </View>
      </GlassCard>
    </View>
  );

  return (
    <View>
      {[1, 2, 3, 4, 5].map((key) => (
        <SkeletonRow key={key} />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginHorizontal: spacing.md,
    marginBottom: spacing.md,
  },
  card: {
    padding: spacing.md,
    borderRadius: 16,
  },
  contentRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    marginRight: spacing.md,
  },
  details: {
    flex: 1,
    gap: 8,
  },
  lineLarge: {
    height: 16,
    width: '40%',
    borderRadius: 8,
  },
  lineSmall: {
    height: 12,
    width: '60%',
    borderRadius: 6,
  },
  footer: {
    flexDirection: 'row',
    marginTop: spacing.md,
    paddingTop: spacing.sm,
    borderTopWidth: StyleSheet.hairlineWidth,
    gap: spacing.lg,
  },
  footerItem: {
    height: 12,
    width: 60,
    borderRadius: 6,
  }
});
