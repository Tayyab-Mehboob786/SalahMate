/**
 * SalahMate — ProgressRing Component (`src/components/charts/ProgressRing.tsx`)
 *
 * Circular animated progress indicator using `react-native-svg` and `react-native-reanimated`.
 * Designed for the Apple Health / Headspace aesthetic with smooth spring/timing transitions (200-350ms).
 */

import React, { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import Svg, { Circle } from 'react-native-svg';
import Animated, {
  useAnimatedProps,
  useSharedValue,
  withTiming,
  Easing,
} from 'react-native-reanimated';
import { Text, useTheme } from 'react-native-paper';
import type { SalahMateTheme } from '@/theme';

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

export interface ProgressRingProps {
  /** Progress percentage between 0 and 1 (e.g. 0.8 = 80%) */
  progress: number;
  /** Size in pixels (diameter of the ring, defaults to 120) */
  size?: number;
  /** Stroke width in pixels (defaults to 12) */
  strokeWidth?: number;
  /** Custom stroke color (defaults to primary theme color) */
  color?: string;
  /** Custom background track color (defaults to subtle outline) */
  trackColor?: string;
  /** Center headline text (e.g. "80%") */
  valueText?: string;
  /** Center subtitle label (e.g. "4/5 Prayers") */
  labelText?: string;
  /** Optional custom node rendered in the center */
  children?: React.ReactNode;
}

export const ProgressRing: React.FC<ProgressRingProps> = ({
  progress,
  size = 120,
  strokeWidth = 12,
  color,
  trackColor,
  valueText,
  labelText,
  children,
}) => {
  const theme = useTheme<SalahMateTheme>();
  const activeColor = color ?? theme.colors.primary;
  const bgTrackColor = trackColor ?? theme.colors.surfaceVariant;

  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const clampedProgress = Math.min(Math.max(progress, 0), 1);

  const animatedProgress = useSharedValue(0);

  useEffect(() => {
    animatedProgress.value = withTiming(clampedProgress, {
      duration: 350,
      easing: Easing.bezier(0.25, 0.1, 0.25, 1),
    });
  }, [clampedProgress, animatedProgress]);

  const animatedProps = useAnimatedProps(() => {
    const strokeDashoffset = circumference * (1 - animatedProgress.value);
    return {
      strokeDashoffset,
    };
  });

  return (
    <View style={[styles.container, { width: size, height: size }]}>
      <Svg width={size} height={size} style={styles.svg}>
        {/* Background Track Circle */}
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={bgTrackColor}
          strokeWidth={strokeWidth}
          fill="transparent"
        />
        {/* Animated Progress Circle */}
        <AnimatedCircle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={activeColor}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          animatedProps={animatedProps}
          strokeLinecap="round"
          fill="transparent"
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
        />
      </Svg>

      <View style={StyleSheet.absoluteFill}>
        <View style={styles.centerContent}>
          {children ? (
            children
          ) : (
            <>
              {valueText ? (
                <Text
                  variant="titleLarge"
                  style={[styles.valueText, { color: theme.colors.onSurface }]}
                >
                  {valueText}
                </Text>
              ) : null}
              {labelText ? (
                <Text
                  variant="labelSmall"
                  style={[styles.labelText, { color: theme.colors.onSurfaceVariant }]}
                >
                  {labelText}
                </Text>
              ) : null}
            </>
          )}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  svg: {
    position: 'absolute',
  },
  centerContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 8,
  },
  valueText: {
    fontWeight: '800',
    letterSpacing: -0.5,
  },
  labelText: {
    fontWeight: '600',
    marginTop: 2,
    textAlign: 'center',
  },
});
