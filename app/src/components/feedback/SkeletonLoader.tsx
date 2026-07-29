/**
 * SalahMate SkeletonLoader Component (`src/components/feedback/SkeletonLoader.tsx`)
 *
 * Smooth animated skeleton placeholder using `react-native-reanimated`.
 * Replaces harsh spinners during content loading with calming, subtle opacity pulse.
 */

import React, { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import type { StyleProp, ViewStyle } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
  Easing,
} from 'react-native-reanimated';
import { useTheme } from 'react-native-paper';
import type { SalahMateTheme } from '@/theme';

export interface SkeletonLoaderProps {
  /** Width of the skeleton block (number in px or percentage string e.g. "100%") */
  width?: number | string;
  /** Height of the skeleton block in pixels (defaults to 20) */
  height?: number;
  /** Border radius of the skeleton block (defaults to 12) */
  borderRadius?: number;
  /** Custom container style */
  style?: StyleProp<ViewStyle>;
}

export const SkeletonLoader: React.FC<SkeletonLoaderProps> = ({
  width = '100%',
  height = 20,
  borderRadius = 12,
  style,
}) => {
  const theme = useTheme<SalahMateTheme>();
  const opacity = useSharedValue(0.4);

  useEffect(() => {
    opacity.value = withRepeat(
      withTiming(0.85, {
        duration: 800,
        easing: Easing.inOut(Easing.ease),
      }),
      -1,
      true
    );
  }, [opacity]);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  return (
    <Animated.View
      style={[
        styles.skeleton,
        {
          width: width as any,
          height,
          borderRadius,
          backgroundColor: theme.colors.surfaceVariant,
        },
        animatedStyle,
        style,
      ]}
      accessible
      accessibilityRole="progressbar"
      accessibilityLabel="Loading content placeholder"
    />
  );
};

const styles = StyleSheet.create({
  skeleton: {
    overflow: 'hidden',
  },
});
