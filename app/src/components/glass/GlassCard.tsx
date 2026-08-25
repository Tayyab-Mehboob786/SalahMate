/**
 * SalahMate — GlassCard Component
 *
 * Premium card with a frosted glass effect using `expo-blur`.
 * Unified theme with translucent background, soft shadow, and subtle border.
 */

import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import type { StyleProp, ViewStyle } from 'react-native';
import { BlurView } from 'expo-blur';
import Animated, {
  FadeIn,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import { useGlassTheme } from '@/theme/glass';
import { spacing } from '@/theme';

export interface GlassCardProps {
  children: React.ReactNode;
  onPress?: () => void;
  style?: StyleProp<ViewStyle>;
  contentStyle?: StyleProp<ViewStyle>;
  borderRadius?: number;
  withShadow?: boolean;
  accessibilityLabel?: string;
  accessibilityHint?: string;
}

export const GlassCard: React.FC<GlassCardProps> = ({
  children,
  onPress,
  style,
  contentStyle,
  borderRadius = 20,
  withShadow = true,
  accessibilityLabel,
  accessibilityHint,
}) => {
  const glass = useGlassTheme();
  const scale = useSharedValue<number>(1);

  const flattenedStyle = StyleSheet.flatten(style) || {};
  const layoutStyle: Record<string, any> = {};
  const visualStyle: Record<string, any> = {};

  const LAYOUT_KEYS = new Set([
    'width', 'height', 'minWidth', 'minHeight', 'maxWidth', 'maxHeight',
    'flex', 'flexGrow', 'flexShrink', 'flexBasis',
    'margin', 'marginTop', 'marginBottom', 'marginLeft', 'marginRight', 'marginVertical', 'marginHorizontal',
    'alignSelf', 'position', 'top', 'bottom', 'left', 'right', 'zIndex',
  ]);

  Object.entries(flattenedStyle).forEach(([key, value]) => {
    if (LAYOUT_KEYS.has(key)) {
      layoutStyle[key] = value;
    } else {
      visualStyle[key] = value;
    }
  });

  const hasCustomMargin =
    'margin' in layoutStyle ||
    'marginVertical' in layoutStyle ||
    'marginTop' in layoutStyle ||
    'marginBottom' in layoutStyle;

  if (!hasCustomMargin) {
    layoutStyle.marginVertical = spacing.md;
  }

  const shouldStretch = Boolean(layoutStyle.height || layoutStyle.minHeight || layoutStyle.flex);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePressIn = () => {
    if (onPress) {
      if (typeof scale.set === 'function') {
        scale.set(withSpring(0.98, { damping: 20, stiffness: 400 }));
      } else {
        scale.value = withSpring(0.98, { damping: 20, stiffness: 400 });
      }
    }
  };

  const handlePressOut = () => {
    if (onPress) {
      if (typeof scale.set === 'function') {
        scale.set(withSpring(1, { damping: 20, stiffness: 400 }));
      } else {
        scale.value = withSpring(1, { damping: 20, stiffness: 400 });
      }
    }
  };

  const cardContent = (
    <View
      style={[
        styles.container,
        { borderRadius },
        shouldStretch && { flex: 1, width: '100%' },
        withShadow && styles.modernShadow,
        visualStyle,
      ]}
    >
      <BlurView
        intensity={glass.blurIntensity}
        tint={glass.blurTint as any}
        style={[styles.blurView, { borderRadius }]}
      >
        <View
          style={[
            styles.overlay,
            {
              borderRadius,
              backgroundColor: glass.cardBackground,
              borderColor: glass.border,
            },
          ]}
        />
        <View style={[styles.content, { borderRadius }, shouldStretch && { flex: 1 }, contentStyle]}>
          {children}
        </View>
      </BlurView>
    </View>
  );

  if (onPress) {
    return (
      <Animated.View entering={FadeIn.duration(300)} style={[layoutStyle, animatedStyle]}>
        <Pressable
          onPress={onPress}
          onPressIn={handlePressIn}
          onPressOut={handlePressOut}
          style={shouldStretch ? { flex: 1, width: '100%' } : { width: '100%' }}
          accessible
          accessibilityRole="button"
          accessibilityLabel={accessibilityLabel}
          accessibilityHint={accessibilityHint}
        >
          {cardContent}
        </Pressable>
      </Animated.View>
    );
  }

  return (
    <Animated.View entering={FadeIn.duration(300)} accessible accessibilityRole="summary" style={layoutStyle}>
      {cardContent}
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    overflow: 'visible', // allow shadows to render
  },
  blurView: {
    overflow: 'hidden',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    borderWidth: 1,
  },
  content: {
    padding: spacing.md,
    position: 'relative',
    zIndex: 1,
  },
  modernShadow: {
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 4,
  },
});
