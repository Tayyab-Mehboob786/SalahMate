import { AppIcon } from '@/components';
import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, useTheme } from 'react-native-paper';
import { GlassCard } from '@/components/glass/GlassCard';
import { spacing, icons } from '@/theme';
import type { SalahMateTheme } from '@/theme';

interface AnalyticsSummaryCardProps {
  bestStreak: number;
  totalLogged: number;
}

export const AnalyticsSummaryCard: React.FC<AnalyticsSummaryCardProps> = ({
  bestStreak,
  totalLogged,
}) => {
  const theme = useTheme<SalahMateTheme>();

  return (
    <GlassCard borderRadius={16} style={styles.card}>
      <View style={styles.container}>
        {/* Left Column: Best Streak */}
        <View style={styles.column}>
          <View style={styles.headerRow}>
            <AppIcon name="fire" size={icons.small} color={theme.colors.tertiary} />
            <Text variant="labelSmall" style={{ color: theme.colors.tertiary, fontWeight: '700', marginLeft: spacing.xs }}>
              Best Streak
            </Text>
          </View>
          <Text variant="titleMedium" style={{ color: theme.colors.onSurface, fontWeight: '800', marginTop: spacing.xs }}>
            {bestStreak} Days
          </Text>
        </View>

        {/* Divider */}
        <View style={[styles.divider, { backgroundColor: theme.colors.border }]} />

        {/* Right Column: Total Logged */}
        <View style={styles.column}>
          <View style={styles.headerRow}>
            <AppIcon name="calendar-check" size={icons.small} color={theme.colors.primary} />
            <Text variant="labelSmall" style={{ color: theme.colors.primary, fontWeight: '700', marginLeft: spacing.xs }}>
              Total Logged
            </Text>
          </View>
          <Text variant="titleMedium" style={{ color: theme.colors.onSurface, fontWeight: '800', marginTop: spacing.xs }}>
            {totalLogged} Prayers
          </Text>
        </View>
      </View>
    </GlassCard>
  );
};

const styles = StyleSheet.create({
  card: {
    marginBottom: spacing.md,
    padding: spacing.md,
  },
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  column: {
    flex: 1,
    justifyContent: 'center',
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  divider: {
    width: 1,
    height: '100%',
    marginHorizontal: spacing.md,
  },
});
