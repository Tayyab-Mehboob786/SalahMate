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

const getStatusColor = (status: string | undefined, defaultColor: string, trackColor: string) => {
  if (!status) return trackColor;
  const s = status.toUpperCase();
  if (s === 'COMPLETED') return '#2ECC71';
  if (s === 'QADA') return '#F1C40F';
  if (s === 'MISSED') return '#E74C3C';
  return trackColor;
};

export interface ProgressRingProps {
  /** Progress percentage between 0 and 1 (e.g. 0.8 = 80%) */
  progress: number;
  /** Optional array of prayer statuses for multi-color segments */
  statuses?: string[];
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
  statuses,
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

  const isMultiColor = statuses && statuses.length === 5;
  const segmentGap = 4;
  const segmentLength = Math.max(0, (circumference / 5) - segmentGap);

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

        {isMultiColor ? (
          statuses.map((st, i) => {
            const segColor = getStatusColor(st, activeColor, 'transparent');
            if (segColor === 'transparent') return null;

            const offset = -i * (circumference / 5);
            return (
              <Circle
                key={`ring-seg-${i}`}
                cx={size / 2}
                cy={size / 2}
                r={radius}
                stroke={segColor}
                strokeWidth={strokeWidth}
                fill="transparent"
                strokeDasharray={`${segmentLength} ${circumference - segmentLength}`}
                strokeDashoffset={offset}
                strokeLinecap="round"
                transform={`rotate(-90 ${size / 2} ${size / 2})`}
              />
            );
          })
        ) : (
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
        )}
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
