/**
 * SalahMate — GlassCard Component
 *
 * Premium card with subtle frosted glass effect on iOS, clean elevated surface everywhere else.
 * White cards with soft shadows and subtle border for an Apple Health / Notion aesthetic.
 * Includes optional gentle press animation.
 */

import React from 'react';
import { Platform, Pressable, StyleSheet, View } from 'react-native';
import type { StyleProp, ViewStyle } from 'react-native';
import { BlurView } from 'expo-blur';
import Animated, {
  FadeIn,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import { useTheme } from 'react-native-paper';
import { useGlassTheme } from '@/theme/glass';
import { shadows, spacing } from '@/theme';
import type { SalahMateTheme } from '@/theme';

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
  const theme = useTheme<SalahMateTheme>();
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

  // Apply default margin if no margin is defined in layoutStyle
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

  /* eslint-disable react-hooks/immutability */
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
  /* eslint-enable react-hooks/immutability */

  const cardContent = (
    <View
      style={[
        styles.container,
        {
          borderRadius,
          backgroundColor: theme.dark ? theme.colors.surface : '#FFFFFF',
          borderColor: theme.dark ? theme.colors.border : '#E8ECEF',
        },
        shouldStretch && { flex: 1, width: '100%' },
        withShadow && styles.modernShadow,
        visualStyle,
      ]}
    >
      <View style={[styles.content, { borderRadius }, shouldStretch && { flex: 1 }, contentStyle]}>{children}</View>
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
    borderWidth: 1,
    overflow: 'visible', // allow shadows to render
  },
  content: {
    padding: spacing.md,
    position: 'relative',
    zIndex: 1,
    overflow: 'hidden',
  },
  modernShadow: {
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 16,
    elevation: 3,
  },
});
