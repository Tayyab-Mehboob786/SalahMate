/**
 * SalahMate — GlassStatisticCard Component
 *
 * Clean metric panel for Dashboard stats, streaks, and analytics.
 * White card with a subtle emerald/gold accent left border strip.
 * Crystal clear typography with proper hierarchy.
 */

import React from 'react';
import { StyleSheet, View } from 'react-native';
import type { StyleProp, ViewStyle } from 'react-native';
import { Text, useTheme } from 'react-native-paper';
import { spacing } from '@/theme';
import type { SalahMateTheme } from '@/theme';
import { GlassCard } from './GlassCard';

export interface GlassStatisticCardProps {
  value: string;
  label: string;
  subtitle?: string;
  icon?: React.ReactNode;
  glowVariant?: 'primary' | 'accent';
  onPress?: () => void;
  style?: StyleProp<ViewStyle>;
}

export const GlassStatisticCard: React.FC<GlassStatisticCardProps> = ({
  value,
  label,
  subtitle,
  icon,
  glowVariant = 'primary',
  onPress,
  style,
}) => {
  const theme = useTheme<SalahMateTheme>();

  const accentColor = glowVariant === 'accent' ? theme.colors.tertiary : theme.colors.primary;

  return (
    <GlassCard onPress={onPress} style={style} borderRadius={16}>
      <View style={styles.row}>
        {/* Left accent strip */}
        <View style={[styles.accentStrip, { backgroundColor: accentColor }]} />

        <View style={styles.textContent}>
          <View style={styles.headerRow}>
            <Text
              variant="labelMedium"
              style={[styles.label, { color: theme.colors.onSurfaceVariant }]}
            >
              {label}
            </Text>
            {icon ? <View style={styles.iconBadge}>{icon}</View> : null}
          </View>

          <Text variant="headlineSmall" style={[styles.value, { color: theme.colors.onSurface }]}>
            {value}
          </Text>

          {subtitle ? (
            <Text
              variant="bodySmall"
              style={[styles.subtitle, { color: theme.colors.onSurfaceVariant }]}
            >
              {subtitle}
            </Text>
          ) : null}
        </View>
      </View>
    </GlassCard>
  );
};

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'stretch',
  },
  accentStrip: {
    width: 4,
    borderRadius: 2,
    marginRight: spacing.md,
    minHeight: 48,
  },
  textContent: {
    flex: 1,
    paddingVertical: spacing.xs,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  label: {
    fontWeight: '600',
    letterSpacing: 0.3,
    textTransform: 'uppercase',
    fontSize: 11,
  },
  iconBadge: {
    padding: spacing.xs,
    borderRadius: 8,
  },
  value: {
    fontWeight: '700',
    letterSpacing: -0.5,
    marginBottom: 2,
  },
  subtitle: {
    marginTop: spacing.xs,
    fontWeight: '500',
  },
});
