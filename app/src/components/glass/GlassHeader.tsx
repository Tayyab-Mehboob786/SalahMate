import { AppIcon } from '@/components';
/**
 * SalahMate — GlassHeader Component
 *
 * Clean, minimal navigation header with warm typography.
 * White surface in light mode, subtle elevated surface in dark mode.
 */

import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import type { StyleProp, ViewStyle } from 'react-native';
import { useRouter } from 'expo-router';
import { Text, useTheme } from 'react-native-paper';
import { shadows, spacing } from '@/theme';
import type { SalahMateTheme } from '@/theme';

export interface GlassHeaderProps {
  title: string | React.ReactNode;
  subtitle?: string | React.ReactNode;
  leftSlot?: React.ReactNode;
  rightSlot?: React.ReactNode;
  showBack?: boolean;
  onBackPress?: () => void;
  style?: StyleProp<ViewStyle>;
  isFloating?: boolean;
}

export const GlassHeader: React.FC<GlassHeaderProps> = ({
  title,
  subtitle,
  leftSlot,
  rightSlot,
  showBack = false,
  onBackPress,
  style,
  isFloating = true,
}) => {
  const theme = useTheme<SalahMateTheme>();
  const router = useRouter();

  const borderRadius = isFloating ? 20 : 0;

  const handleBack = () => {
    if (onBackPress) {
      onBackPress();
    } else {
      router.replace('/(tabs)/dashboard');
    }
  };

  const defaultLeftSlot = showBack ? (
    <Pressable
      onPress={handleBack}
      style={({ pressed }) => [styles.backButton, pressed && styles.backButtonPressed]}
      accessibilityRole="button"
      accessibilityLabel="Navigate back to Home"
    >
      <AppIcon
        name="arrow-left-circle-outline"
        size={28}
        color={theme.colors.onSurface}
      />
    </Pressable>
  ) : null;

  const resolvedLeftSlot = leftSlot !== undefined ? leftSlot : defaultLeftSlot;

  return (
    <View
      style={[
        styles.container,
        {
          borderRadius,
          backgroundColor: theme.colors.surface,
          borderColor: theme.colors.border,
        },
        isFloating && shadows.sm,
        style,
      ]}
    >
      <View style={styles.content}>
        {resolvedLeftSlot ? (
          <View style={styles.sideSlotLeft}>{resolvedLeftSlot}</View>
        ) : rightSlot ? (
          <View style={[styles.sideSlotLeft, { minWidth: 44 }]} />
        ) : null}

        <View style={styles.titleContainer}>
          {typeof title === 'string' ? (
            <Text
              variant="titleMedium"
              style={[styles.title, { color: theme.colors.onSurface }]}
              numberOfLines={1}
              adjustsFontSizeToFit
              minimumFontScale={0.8}
            >
              {title}
            </Text>
          ) : (
            title
          )}
          {subtitle ? (
            typeof subtitle === 'string' ? (
              <Text
                variant="bodySmall"
                style={[styles.subtitle, { color: theme.colors.onSurfaceVariant }]}
                numberOfLines={2}
                adjustsFontSizeToFit
                minimumFontScale={0.85}
              >
                {subtitle}
              </Text>
            ) : (
              subtitle
            )
          ) : null}
        </View>

        {rightSlot ? (
          <View style={styles.sideSlotRight}>{rightSlot}</View>
        ) : resolvedLeftSlot ? (
          <View style={[styles.sideSlotRight, { minWidth: 44 }]} />
        ) : null}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    borderWidth: 1,
    overflow: 'hidden',
    marginVertical: spacing.xs,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    position: 'relative',
    zIndex: 1,
  },
  sideSlotLeft: {
    minWidth: 44,
    alignItems: 'flex-start',
    justifyContent: 'center',
  },
  sideSlotRight: {
    minWidth: 44,
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
  titleContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: spacing.xs,
  },
  title: {
    fontWeight: '700',
    letterSpacing: -0.2,
    textAlign: 'center',
    width: '100%',
  },
  subtitle: {
    marginTop: 4,
    fontWeight: '500',
    textAlign: 'center',
    width: '100%',
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  backButtonPressed: {
    opacity: 0.6,
  },
});
