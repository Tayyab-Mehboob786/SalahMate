/**
 * SalahMate — GlassBackground Component
 *
 * A screen wrapper that displays a full-screen mosque background image.
 * Uses a slight dark or light overlay to ensure text readability over the image.
 */

import React from 'react';
import { ImageBackground, StyleSheet, View } from 'react-native';
import type { ImageSourcePropType, StyleProp, ViewStyle } from 'react-native';
import { useGlassTheme } from '@/theme/glass';

export interface GlassBackgroundProps {
  source: ImageSourcePropType;
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  overlayOpacity?: number;
}

export const GlassBackground: React.FC<GlassBackgroundProps> = ({
  source,
  children,
  style,
  overlayOpacity = 0.15,
}) => {
  const glass = useGlassTheme();

  return (
    <ImageBackground 
      source={source} 
      style={[styles.background, style]} 
      resizeMode="cover"
      blurRadius={6} // Added blur for better UI/UX
    >
      <View style={[styles.overlay, { backgroundColor: `rgba(255, 255, 255, ${overlayOpacity})` }]} />
      {children}
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
  },
});
