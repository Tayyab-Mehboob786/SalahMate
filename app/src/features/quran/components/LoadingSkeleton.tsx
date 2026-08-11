import React, { useEffect } from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import { useTheme } from 'react-native-paper';
import Animated, { useSharedValue, useAnimatedStyle, withRepeat, withTiming, withSequence } from 'react-native-reanimated';
import { spacing } from '@/theme';

export const ReaderLoadingSkeleton = () => {
  const theme = useTheme();
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

  const renderLines = (count: number) => {
    return Array.from({ length: count }).map((_, i) => (
      <Animated.View 
        key={`line-${i}`} 
        style={[
          styles.textLine, 
          { backgroundColor: theme.colors.surfaceVariant },
          animatedStyle,
          // Randomize width slightly for realism
          { width: `${85 + Math.random() * 15}%` }
        ]} 
      />
    ));
  };

  return (
    <View style={styles.container}>
      <View style={[styles.frame, { borderColor: theme.dark ? '#333333' : '#E8E2D2' }]}>
        
        {/* Header Skeleton */}
        <Animated.View style={[styles.header, { backgroundColor: theme.colors.surfaceVariant }, animatedStyle]} />
        
        {/* Text Lines Skeleton */}
        <View style={styles.content}>
          {renderLines(12)}
        </View>

      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: spacing.sm,
    width: Dimensions.get('window').width,
  },
  frame: {
    flex: 1,
    borderWidth: 2,
    borderRadius: 8,
    margin: spacing.xs,
    padding: spacing.md,
  },
  header: {
    height: 48,
    borderRadius: 12,
    marginBottom: spacing.xl,
    marginTop: spacing.md,
  },
  content: {
    alignItems: 'center',
    gap: 32,
  },
  textLine: {
    height: 16,
    borderRadius: 8,
  }
});
