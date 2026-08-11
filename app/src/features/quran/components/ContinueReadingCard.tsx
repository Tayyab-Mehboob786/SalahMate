import React, { useEffect } from 'react';
import { View, StyleSheet, Pressable } from 'react-native';
import { Text, useTheme } from 'react-native-paper';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withTiming, 
  Easing 
} from 'react-native-reanimated';
import { GlassCard, AppIcon } from '@/components';
import { spacing } from '@/theme';
import type { SalahMateTheme } from '@/theme';

interface ContinueReadingCardProps {
  surahName: string;
  pageNumber: number;
  juzNumber: number;
  progressPercent: number;
  onPress: () => void;
}

export const ContinueReadingCard: React.FC<ContinueReadingCardProps> = ({
  surahName,
  pageNumber,
  juzNumber,
  progressPercent,
  onPress,
}) => {
  const theme = useTheme<SalahMateTheme>();
  const progressWidth = useSharedValue(0);

  useEffect(() => {
    progressWidth.value = withTiming(progressPercent, {
      duration: 1000,
      easing: Easing.out(Easing.cubic),
    });
  }, [progressPercent]);

  const animatedProgressStyle = useAnimatedStyle(() => ({
    width: `${progressWidth.value}%`,
  }));

  return (
    <Pressable onPress={onPress}>
      {({ pressed }) => (
        <Animated.View style={[styles.container, pressed && { transform: [{ scale: 0.98 }] }]}>
          <GlassCard style={styles.card}>
            <View style={styles.header}>
              <View style={styles.iconContainer}>
                <AppIcon name="book-open-variant" size={24} color="#D4AF37" />
              </View>
              <View style={styles.badge}>
                <Text style={styles.badgeText}>Continue Reading</Text>
              </View>
            </View>

            <View style={styles.content}>
              <Text variant="headlineMedium" style={[styles.surahName, { color: theme.colors.onPrimary }]}>
                {surahName}
              </Text>
              <Text variant="bodyMedium" style={[styles.details, { color: theme.colors.onPrimary }]}>
                Page {pageNumber} • Juz {juzNumber}
              </Text>
            </View>

            <View style={styles.footer}>
              <View style={styles.progressContainer}>
                <View style={styles.progressHeader}>
                  <Text variant="labelSmall" style={{ color: theme.colors.onPrimary, opacity: 0.9 }}>
                    Progress
                  </Text>
                  <Text variant="labelSmall" style={{ color: theme.colors.onPrimary, fontWeight: 'bold' }}>
                    {progressPercent}%
                  </Text>
                </View>
                <View style={[styles.progressBarBg, { backgroundColor: 'rgba(255, 255, 255, 0.2)' }]}>
                  <Animated.View style={[styles.progressBarFill, { backgroundColor: '#D4AF37' }, animatedProgressStyle]} />
                </View>
              </View>
              
              <View style={styles.actionButton}>
                <AppIcon name="arrow-right" size={20} color={theme.colors.onPrimary} />
              </View>
            </View>
          </GlassCard>
        </Animated.View>
      )}
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    marginHorizontal: spacing.lg,
    marginVertical: spacing.md,
  },
  card: {
    padding: spacing.lg,
    overflow: 'hidden',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  badge: {
    backgroundColor: 'rgba(212, 175, 55, 0.2)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(212, 175, 55, 0.5)',
  },
  badgeText: {
    color: '#D4AF37',
    fontWeight: '700',
    fontSize: 12,
    textTransform: 'uppercase',
  },
  content: {
    marginBottom: spacing.xl,
  },
  surahName: {
    fontWeight: '800',
    marginBottom: 4,
  },
  details: {
    opacity: 0.8,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
  },
  progressContainer: {
    flex: 1,
    marginRight: spacing.xl,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  progressBarBg: {
    height: 6,
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 3,
  },
  actionButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  }
});
