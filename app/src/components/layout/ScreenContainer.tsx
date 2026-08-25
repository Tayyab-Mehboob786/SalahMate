/**
 * SalahMate ScreenContainer Component (`src/components/layout/ScreenContainer.tsx`)
 *
 * Fundamental architectural layout wrapper for all application screens.
 * Integrates `SafeAreaView` with dynamic MD3 theme backgrounds and optional `LinearGradient`
 * soft backing (`withGlassGradient={true}`) adhering to the centralized Glassmorphism design system.
 */

import React from 'react';
import { ScrollView, StyleSheet, View, ImageSourcePropType } from 'react-native';
import type { RefreshControlProps, ScrollViewProps, StyleProp, ViewStyle } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { Edge } from 'react-native-safe-area-context';
import { spacing, useGlassTheme } from '@/theme';
import type { SalahMateTheme } from '@/theme';
import { BrandWatermark } from '../common/BrandWatermark';
import { GlassBackground } from '../glass/GlassBackground';

export interface ScreenContainerProps extends Omit<ScrollViewProps, 'style' | 'contentContainerStyle' | 'refreshControl'> {
  /** Screen body content */
  children: React.ReactNode;
  /** Whether the screen content should scroll when exceeding vertical boundaries */
  scrollable?: boolean;
  /** Whether standard horizontal screen padding (`16px`) is applied */
  withPadding?: boolean;
  /** Whether to apply soft background gradient for Glassmorphism screens (defaults to true) */
  withGlassGradient?: boolean;
  /** Whether to display the subtle SalahMate brand watermark behind all content */
  withBrandWatermark?: boolean;
  /** Safe area edges to respect (defaults to all safe screen boundaries) */
  edges?: Edge[];
  /** Custom outer container styles */
  style?: StyleProp<ViewStyle>;
  /** Custom inner content style when `scrollable={true}` or inside standard View */
  contentContainerStyle?: StyleProp<ViewStyle>;
  /** Optional pull-to-refresh control element when `scrollable={true}` */
  refreshControl?: React.ReactElement<RefreshControlProps>;
  /** Background image to use for the screen */
  backgroundImage?: ImageSourcePropType;
}

export const ScreenContainer: React.FC<ScreenContainerProps> = ({
  children,
  scrollable = false,
  withPadding = true,
  withGlassGradient = true,
  withBrandWatermark = false,
  edges = ['top', 'bottom', 'left', 'right'],
  style,
  contentContainerStyle,
  refreshControl,
  backgroundImage,
  ...scrollViewProps
}) => {
  const theme = useTheme<SalahMateTheme>();
  const glass = useGlassTheme();

  const baseStyle: StyleProp<ViewStyle> = [
    styles.container,
    { backgroundColor: backgroundImage ? 'transparent' : theme.colors.background },
    style,
  ];

  const innerPaddingStyle: StyleProp<ViewStyle> = withPadding ? styles.paddedContent : undefined;

  const content = (
    <SafeAreaView style={baseStyle} edges={edges}>
      {withGlassGradient && !backgroundImage ? (
        <LinearGradient
          colors={glass.backgroundGradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={StyleSheet.absoluteFill}
        />
      ) : null}

      {withBrandWatermark && <BrandWatermark />}

      {scrollable ? (
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={[styles.scrollContent, innerPaddingStyle, contentContainerStyle]}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          refreshControl={refreshControl}
          {...scrollViewProps}
        >
          {children}
        </ScrollView>
      ) : (
        <View style={[styles.staticContent, innerPaddingStyle, contentContainerStyle]}>
          {children}
        </View>
      )}
    </SafeAreaView>
  );

  if (backgroundImage) {
    return (
      <GlassBackground source={backgroundImage}>
        {content}
      </GlassBackground>
    );
  }

  return content;
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  staticContent: {
    flex: 1,
  },
  paddedContent: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
});
