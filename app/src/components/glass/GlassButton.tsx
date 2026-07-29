/**
 * SalahMate — GlassButton Component
 *
 * Three clean button variants:
 * - `primary`: Emerald Green background, white text, soft shadow
 * - `glass` / `secondary`: White background, emerald border
 * - `outlined`: Transparent, emerald border, green text
 */

import React from 'react';
import { ActivityIndicator, Pressable, StyleSheet, View } from 'react-native';
import type { StyleProp, ViewStyle } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';
import { Text, useTheme } from 'react-native-paper';
import { shadows, spacing } from '@/theme';
import type { SalahMateTheme } from '@/theme';

export type GlassButtonVariant = 'primary' | 'secondary' | 'glass' | 'outlined';

export interface GlassButtonProps {
  label: string;
  onPress: () => void;
  variant?: GlassButtonVariant;
  loading?: boolean;
  disabled?: boolean;
  icon?: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  borderRadius?: number;
  accessibilityLabel?: string;
}

export const GlassButton: React.FC<GlassButtonProps> = ({
  label,
  onPress,
  variant = 'glass',
  loading = false,
  disabled = false,
  icon,
  style,
  borderRadius = 14,
  accessibilityLabel,
}) => {
  const theme = useTheme<SalahMateTheme>();
  const scale = useSharedValue<number>(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  /* eslint-disable react-hooks/immutability */
  const handlePressIn = () => {
    if (!disabled && !loading) {
      if (typeof scale.set === 'function') {
        scale.set(withSpring(0.97, { damping: 20, stiffness: 400 }));
      } else {
        scale.value = withSpring(0.97, { damping: 20, stiffness: 400 });
      }
    }
  };

  const handlePressOut = () => {
    if (!disabled && !loading) {
      if (typeof scale.set === 'function') {
        scale.set(withSpring(1, { damping: 20, stiffness: 400 }));
      } else {
        scale.value = withSpring(1, { damping: 20, stiffness: 400 });
      }
    }
  };
  /* eslint-enable react-hooks/immutability */

  const isPrimary = variant === 'primary';
  const isOutlined = variant === 'outlined';

  const getBackgroundColor = (): string => {
    if (disabled) {
      return theme.colors.surfaceVariant;
    }
    if (isPrimary) {
      return theme.colors.primary;
    }
    if (isOutlined) {
      return 'transparent';
    }
    return theme.colors.surface; // White/surface background for glass/secondary
  };

  const getBorderColor = (): string => {
    if (disabled) {
      return theme.colors.border;
    }
    if (isPrimary) {
      return 'transparent';
    }
    return theme.colors.primary; // Emerald border for secondary/outlined
  };

  const getTextColor = (): string => {
    if (disabled) {
      return theme.colors.onSurfaceVariant;
    }
    if (isPrimary) {
      return theme.colors.onPrimary;
    }
    return theme.colors.primary; // Emerald text for secondary/outlined
  };

  return (
    <Animated.View style={[animatedStyle, style]}>
      <Pressable
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        disabled={disabled || loading}
        accessible
        accessibilityRole="button"
        accessibilityLabel={accessibilityLabel ?? label}
        accessibilityState={{ disabled: disabled || loading, busy: loading }}
        style={[
          styles.container,
          {
            borderRadius,
            backgroundColor: getBackgroundColor(),
            borderColor: getBorderColor(),
            borderWidth: isPrimary ? 0 : 1.5,
          },
          isPrimary && !disabled ? shadows.sm : undefined,
        ]}
      >
        <View style={styles.content}>
          {loading ? (
            <ActivityIndicator size="small" color={getTextColor()} style={styles.spinner} />
          ) : icon ? (
            <View style={styles.iconContainer}>{icon}</View>
          ) : null}

          <Text
            variant="labelLarge"
            style={[styles.label, { color: getTextColor() }]}
            numberOfLines={1}
          >
            {label}
          </Text>
        </View>
      </Pressable>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    minHeight: 48,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    overflow: 'hidden',
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1,
  },
  label: {
    fontWeight: '600',
    letterSpacing: 0.2,
  },
  spinner: {
    marginRight: spacing.sm,
  },
  iconContainer: {
    marginRight: spacing.sm,
  },
});
