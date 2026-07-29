/**
 * SalahMate Switch Component (`src/components/forms/Switch.tsx`)
 *
 * Premium Apple Health & MD3 style toggle switch using `react-native-reanimated`.
 * Smooth thumb spring animation (200-350ms) and emerald track highlight.
 */

import React, { useEffect } from 'react';
import { Pressable, StyleSheet } from 'react-native';
import type { StyleProp, ViewStyle } from 'react-native';
import Animated, {
  interpolateColor,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import { useTheme } from 'react-native-paper';
import type { SalahMateTheme } from '@/theme';

export interface SwitchProps {
  /** Whether the switch is checked/active */
  value: boolean;
  /** Callback triggered when value changes */
  onValueChange: (newValue: boolean) => void;
  /** Whether the switch is disabled */
  disabled?: boolean;
  /** Custom container style */
  style?: StyleProp<ViewStyle>;
  /** Optional custom active color */
  color?: string;
  /** Accessibility label */
  accessibilityLabel?: string;
}

export const Switch: React.FC<SwitchProps> = ({
  value,
  onValueChange,
  disabled = false,
  style,
  color,
  accessibilityLabel,
}) => {
  const theme = useTheme<SalahMateTheme>();
  const progress = useSharedValue(value ? 1 : 0);

  useEffect(() => {
    progress.value = withSpring(value ? 1 : 0, {
      damping: 18,
      stiffness: 300,
    });
  }, [value, progress]);

  const trackAnimatedStyle = useAnimatedStyle(() => {
    const backgroundColor = interpolateColor(
      progress.value,
      [0, 1],
      [theme.colors.surfaceVariant, color ?? theme.colors.primary]
    );
    return { backgroundColor };
  });

  const thumbAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: progress.value * 20 }],
    };
  });

  return (
    <Pressable
      onPress={() => !disabled && onValueChange(!value)}
      disabled={disabled}
      accessible
      accessibilityRole="switch"
      accessibilityState={{ checked: value, disabled }}
      accessibilityLabel={accessibilityLabel ?? 'Toggle Setting'}
      style={[styles.container, disabled && styles.disabled, style]}
    >
      <Animated.View style={[styles.track, trackAnimatedStyle]}>
        <Animated.View style={[styles.thumb, thumbAnimatedStyle, { backgroundColor: theme.colors.surface, shadowColor: theme.colors.shadow }]} />
      </Animated.View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  track: {
    width: 50,
    height: 30,
    borderRadius: 15,
    padding: 3,
    justifyContent: 'center',
  },
  thumb: {
    width: 24,
    height: 24,
    borderRadius: 12,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 2.5,
    elevation: 2,
  },
  disabled: {
    opacity: 0.5,
  },
});
