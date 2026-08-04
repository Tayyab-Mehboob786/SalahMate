import { AppIcon } from '@/components';
import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, useTheme } from 'react-native-paper';
import { GlassCard } from '@/components/glass/GlassCard';
import { spacing } from '@/theme';
import type { SalahMateTheme } from '@/theme';

interface DailySummaryCardProps {
  streak: number;
  nextPrayerName: string;
  nextPrayerTime: string;
}

export const DailySummaryCard: React.FC<DailySummaryCardProps> = ({
  streak,
  nextPrayerName,
  nextPrayerTime,
}) => {
  const theme = useTheme<SalahMateTheme>();

  return (
    <GlassCard borderRadius={18} style={styles.card}>
      <View style={styles.container}>
        {/* Left Column: Streak */}
        <View style={styles.column}>
          <View style={styles.headerRow}>
            <AppIcon name="fire" size={16} color={theme.colors.tertiary} />
            <Text variant="labelSmall" style={{ color: theme.colors.tertiary, fontWeight: '700', marginLeft: 4 }}>
              Current Streak
            </Text>
          </View>
          <Text variant="titleMedium" style={{ color: theme.colors.onSurface, fontWeight: '800', marginTop: 4 }}>
            {streak} {streak === 0 || streak === 1 ? 'Day' : 'Days'}
          </Text>
        </View>

        {/* Divider */}
        <View style={[styles.divider, { backgroundColor: theme.dark ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.15)' }]} />

        {/* Right Column: Next Prayer */}
        <View style={styles.column}>
          <View style={styles.headerRow}>
            <AppIcon name="mosque" size={16} color={theme.colors.primary} />
            <Text variant="labelSmall" style={{ color: theme.colors.primary, fontWeight: '700', marginLeft: 4 }}>
              Next Prayer
            </Text>
          </View>
          <Text variant="titleMedium" style={{ color: theme.colors.onSurface, fontWeight: '800', marginTop: 4 }}>
            {nextPrayerName} • {nextPrayerTime}
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
    alignItems: 'center',
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  divider: {
    width: 1,
    height: 48,
    marginHorizontal: spacing.md,
  },
});
