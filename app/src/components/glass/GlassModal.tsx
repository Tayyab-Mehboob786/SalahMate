/**
 * SalahMate — GlassModal / GlassBottomSheet Component
 *
 * Clean overlay modal with soft backdrop scrim.
 * White rounded panel in light mode, dark elevated panel in dark mode.
 */

import React, { useEffect } from 'react';
import { Pressable, StyleSheet, View, BackHandler } from 'react-native';
import Animated, { FadeIn, FadeOut, SlideInDown, SlideOutDown, Easing } from 'react-native-reanimated';
import type { StyleProp, ViewStyle } from 'react-native';
import { Text, useTheme, Portal } from 'react-native-paper';
import { shadows, spacing } from '@/theme';
import type { SalahMateTheme } from '@/theme';

export interface GlassModalProps {
  visible: boolean;
  onDismiss: () => void;
  title?: string;
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
}

export const GlassModal: React.FC<GlassModalProps> = ({
  visible,
  onDismiss,
  title,
  children,
  style,
}) => {
  const theme = useTheme<SalahMateTheme>();

  useEffect(() => {
    if (!visible) return;
    const onBackPress = () => {
      onDismiss();
      return true;
    };
    const subscription = BackHandler.addEventListener('hardwareBackPress', onBackPress);
    return () => subscription.remove();
  }, [visible, onDismiss]);

  if (!visible) return null;

  return (
    <Portal>
      <Animated.View 
        style={styles.backdrop}
        entering={FadeIn.duration(250).easing(Easing.out(Easing.ease))}
        exiting={FadeOut.duration(200)}
      >
        <Pressable style={styles.backdropOverlay} onPress={onDismiss}>
          <View style={[styles.backdropOverlay, { backgroundColor: theme.colors.scrim }]} />
        </Pressable>
      </Animated.View>

      <Animated.View 
        style={styles.centeredContainer} 
        pointerEvents="box-none"
        entering={SlideInDown.duration(300).easing(Easing.out(Easing.ease))}
        exiting={SlideOutDown.duration(250).easing(Easing.in(Easing.ease))}
      >
        <View
          style={[
            styles.panel,
            {
              backgroundColor: theme.colors.surface,
              borderColor: theme.colors.border,
            },
            shadows.xl,
            style,
          ]}
        >
          {title ? (
            <View style={styles.header}>
              <View style={[styles.handle, { backgroundColor: theme.colors.outline }]} />
              <Text
                variant="titleMedium"
                style={[styles.title, { color: theme.colors.onSurface }]}
              >
                {title}
              </Text>
            </View>
          ) : (
            <View style={styles.handleContainer}>
              <View style={[styles.handle, { backgroundColor: theme.colors.outline }]} />
            </View>
          )}

          <View style={styles.content}>{children}</View>
        </View>
      </Animated.View>
    </Portal>
  );
};

/** Alias for bottom sheet usage */
export const GlassBottomSheet = GlassModal;

const styles = StyleSheet.create({
  backdrop: {
    ...StyleSheet.absoluteFill,
  },
  backdropOverlay: {
    ...StyleSheet.absoluteFill,
  },
  centeredContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    paddingHorizontal: spacing.md,
    paddingBottom: spacing.xl,
  },
  panel: {
    borderRadius: 24,
    borderWidth: 1,
    overflow: 'hidden',
    maxHeight: '80%',
    flexShrink: 1,
  },
  handleContainer: {
    alignItems: 'center',
    paddingTop: spacing.sm,
  },
  header: {
    alignItems: 'center',
    paddingTop: spacing.sm,
    paddingBottom: spacing.md,
    paddingHorizontal: spacing.lg,
  },
  handle: {
    width: 36,
    height: 4,
    borderRadius: 2,
    marginBottom: spacing.md,
  },
  title: {
    fontWeight: '700',
  },
  content: {
    padding: spacing.lg,
    paddingTop: spacing.sm,
    flexShrink: 1,
  },
});
