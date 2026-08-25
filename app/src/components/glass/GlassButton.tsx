/**
 * SalahMate — GlassButton Component
 *
 * Premium button using glassmorphism.
 */

import React from 'react';
import { ActivityIndicator, Pressable, StyleSheet, View } from 'react-native';
import type { StyleProp, ViewStyle } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';
import { Text, useTheme } from 'react-native-paper';
import { BlurView } from 'expo-blur';
import { useGlassTheme } from '@/theme/glass';
import { shadows, spacing } from '@/theme';
import type { SalahMateTheme } from '@/theme';

export type GlassButtonVariant = 'primary' | 'secondary' | 'glass' | 'outlined' | 'white' | 'white-outlined';

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
  const glass = useGlassTheme();
  const scale = useSharedValue<number>(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

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

  const isPrimary = variant === 'primary';
  const isOutlined = variant === 'outlined';

  const getBackgroundColor = (): string => {
    if (disabled) {
      if (variant.startsWith('white')) return 'rgba(255, 255, 255, 0.1)';
      return theme.colors.surfaceVariant;
    }
    if (variant === 'white') return 'rgba(255, 255, 255, 0.2)';
    if (variant === 'white-outlined') return 'transparent';
    if (isPrimary) return theme.colors.primary;
    if (isOutlined) return 'transparent';
    return glass.buttonBackground; 
  };

  const getBorderColor = (): string => {
    if (disabled) {
      if (variant.startsWith('white')) return 'rgba(255, 255, 255, 0.2)';
      return theme.colors.border;
    }
    if (variant === 'white') return 'rgba(255, 255, 255, 0.4)';
    if (variant === 'white-outlined') return 'rgba(255, 255, 255, 0.8)';
    if (isPrimary) return 'transparent';
    if (isOutlined) return theme.colors.primary;
    return glass.border;
  };

  const getTextColor = (): string => {
    if (disabled) {
      if (variant.startsWith('white')) return 'rgba(255, 255, 255, 0.4)';
      return theme.colors.onSurfaceVariant;
    }
    if (variant.startsWith('white')) return '#FFFFFF';
    if (isPrimary) return theme.colors.onPrimary;
    return theme.colors.primary;
  };

  const buttonContent = (
    <>
      <View
        style={[
          styles.overlay,
          {
            borderRadius,
            backgroundColor: getBackgroundColor(),
            borderColor: getBorderColor(),
            borderWidth: isPrimary ? 0 : (variant.startsWith('white') ? 1 : 1.5),
          },
        ]}
      />
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
    </>
  );

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
          { borderRadius },
          isPrimary && !disabled ? shadows.sm : undefined,
        ]}
      >
        {variant === 'glass' || variant.startsWith('white') ? (
          <BlurView
            intensity={variant.startsWith('white') ? 25 : glass.blurIntensity}
            tint={variant.startsWith('white') ? 'light' : (glass.blurTint as any)}
            style={[styles.blurView, { borderRadius }]}
          >
            {buttonContent}
          </BlurView>
        ) : (
          <View style={[styles.blurView, { borderRadius }]}>
            {buttonContent}
          </View>
        )}
      </Pressable>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    minHeight: 48,
    overflow: 'visible',
  },
  blurView: {
    flex: 1,
    overflow: 'hidden',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
  },
  content: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.lg,
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
