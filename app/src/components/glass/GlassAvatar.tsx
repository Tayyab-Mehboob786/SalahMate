/**
 * SalahMate — GlassAvatar Component
 *
 * Clean circular profile badge with soft emerald container background
 * and primary-colored initials. No blur effects — simple and elegant.
 */

import React from 'react';
import { StyleSheet, View, Image } from 'react-native';
import type { StyleProp, ViewStyle, ImageSourcePropType } from 'react-native';
import { Text, useTheme } from 'react-native-paper';
import { shadows } from '@/theme';
import type { SalahMateTheme } from '@/theme';

export interface GlassAvatarProps {
  initials?: string;
  source?: ImageSourcePropType;
  size?: number;
  icon?: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  accessibilityLabel?: string;
  textColor?: string;
  backgroundColor?: string;
  borderColor?: string;
}

export const GlassAvatar: React.FC<GlassAvatarProps> = ({
  initials = 'SM',
  source,
  size = 48,
  icon,
  style,
  accessibilityLabel,
  textColor,
  backgroundColor,
  borderColor,
}) => {
  const theme = useTheme<SalahMateTheme>();

  const borderRadius = size / 2;

  return (
    <View
      accessible
      accessibilityRole="image"
      accessibilityLabel={accessibilityLabel ?? `Avatar for ${initials}`}
      style={[
        styles.container,
        {
          width: size,
          height: size,
          borderRadius,
          backgroundColor: backgroundColor ?? (theme.dark ? 'rgba(25, 105, 140, 0.22)' : '#E8F4F8'),
          borderColor: borderColor ?? (theme.dark ? 'rgba(25, 105, 140, 0.30)' : 'rgba(25, 105, 140, 0.18)'),
        },
        shadows.sm,
        style,
      ]}
    >
      <View style={styles.content}>
        {source ? (
          <Image source={source} style={{ width: size, height: size, borderRadius }} />
        ) : icon ?? (
          <Text
            variant="labelLarge"
            style={[
              styles.initials,
              {
                color: textColor ?? (theme.dark ? '#7FC8E8' : '#145874'),
                fontSize: size * 0.36,
              },
            ]}
          >
            {initials.slice(0, 2).toUpperCase()}
          </Text>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderWidth: 1,
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    position: 'relative',
    zIndex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  initials: {
    fontWeight: '700',
    letterSpacing: 0.3,
  },
});
