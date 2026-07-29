/**
 * SalahMate Analytics Screen (`/(tabs)/analytics`)
 *
 * Apple Health inspired spiritual analytics dashboard.
 * Features weekly consistency metrics, streak records, and a visual prayer breakdown
 * with progress bars and semantic prayer color accents.
 */

import React, { useState, useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import { AppIcon } from '@/components';
import { ProgressBar, Text, useTheme } from 'react-native-paper';
import { GlassCard, GlassHeader, GlassStatisticCard, ProgressRing, ScreenContainer, AnalyticsSkeleton, AnalyticsSummaryCard } from '@/components';
import { usePullToRefresh } from '@/hooks';
import { spacing, icons } from '@/theme';
import type { SalahMateTheme } from '@/theme';

const PRAYER_BREAKDOWN = [
  { name: 'Fajr', completion: 92, streak: 14, icon: 'weather-sunset-up', colorKey: 'fajr' },
  { name: 'Dhuhr', completion: 100, streak: 21, icon: 'weather-sunny', colorKey: 'dhuhr' },
  { name: 'Asr', completion: 88, streak: 12, icon: 'weather-partly-cloudy', colorKey: 'asr' },
  { name: 'Maghrib', completion: 100, streak: 30, icon: 'weather-sunset-down', colorKey: 'maghrib' },
  { name: 'Isha', completion: 85, streak: 10, icon: 'weather-night', colorKey: 'isha' },
] as const;

export default function AnalyticsScreen() {
  const theme = useTheme<SalahMateTheme>();
  const [isLoading, setIsLoading] = useState(true);
  const { refreshControl } = usePullToRefresh();

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <ScreenContainer scrollable withPadding withGlassGradient refreshControl={refreshControl}>
      <GlassHeader title="Spiritual Analytics" subtitle="Consistency & Performance" showBack />

      {isLoading ? (
        <AnalyticsSkeleton />
      ) : (
      <View style={styles.content}>
        {/* Weekly Consistency Hero */}
        <GlassCard borderRadius={24} contentStyle={styles.heroCardContent}>
          <View style={styles.heroRow}>
            <ProgressRing
              progress={0.93}
              size={90}
              strokeWidth={10}
              valueText="93%"
              labelText="30d Avg"
            />
            <View style={styles.heroInfo}>
              <View style={styles.trendBadge}>
                <AppIcon name="trending-up" size={18} variant="primary" />
                <Text
                  variant="labelMedium"
                  style={[styles.trendText, { color: theme.colors.primary }]}
                >
                  +4.5% vs Last Month
                </Text>
              </View>
              <Text variant="titleLarge" style={{ color: theme.colors.onSurface, fontWeight: '700' }}>
                Exceptional Consistency
              </Text>
              <Text variant="bodySmall" style={{ color: theme.colors.onSurfaceVariant, marginTop: 4 }}>
                You logged 130 out of 140 prayers over the last 4 weeks.
              </Text>
            </View>
          </View>
        </GlassCard>

        {/* Metrics Row */}
        <AnalyticsSummaryCard bestStreak={42} totalLogged={320} />

        {/* Prayer Breakdown Header */}
        <View style={styles.sectionHeaderRow}>
          <Text
            variant="titleSmall"
            style={[styles.sectionTitle, { color: theme.colors.onSurface }]}
          >
            PRAYER-BY-PRAYER CONSISTENCY
          </Text>
          <Text variant="bodySmall" style={{ color: theme.colors.onSurfaceVariant }}>
            Last 30 Days
          </Text>
        </View>

        {PRAYER_BREAKDOWN.map((item) => {
          const accentColor = theme.colors[item.colorKey as keyof typeof theme.colors] || theme.colors.primary;

          return (
            <GlassCard key={item.name} borderRadius={18} style={styles.breakdownCard}>
              <View style={styles.breakdownContent}>
                <View style={[styles.iconBox, { backgroundColor: theme.colors.surfaceVariant }]}>
                  <AppIcon name={item.icon as any} size="md" color={accentColor as any} />
                </View>

                <View style={styles.breakdownInfo}>
                  <View style={styles.nameRow}>
                    <Text
                      variant="titleMedium"
                      style={[styles.prayerName, { color: theme.colors.onSurface }]}
                    >
                      {item.name}
                    </Text>
                    <Text
                      variant="titleMedium"
                      style={[styles.percentText, { color: accentColor as any }]}
                    >
                      {item.completion}%
                    </Text>
                  </View>

                  <ProgressBar
                    progress={item.completion / 100}
                    color={accentColor as any}
                    style={[styles.progressBar, { backgroundColor: theme.colors.surfaceVariant }]}
                  />

                  <View style={styles.footerRow}>
                    <Text variant="bodySmall" style={{ color: theme.colors.onSurfaceVariant }}>
                      🔥 {item.streak} day streak
                    </Text>
                    <Text variant="bodySmall" style={{ color: theme.colors.onSurfaceVariant }}>
                      {Math.round((item.completion / 100) * 30)}/30 logged
                    </Text>
                  </View>
                </View>
              </View>
            </GlassCard>
          );
        })}
      </View>
      )}
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  content: {
    paddingVertical: spacing.md,
    gap: spacing.sm,
  },
  heroCardContent: {
    padding: spacing.md,
  },
  heroRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.lg,
  },
  heroInfo: {
    flex: 1,
  },
  trendBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 4,
  },
  trendText: {
    fontWeight: '800',
  },
  row: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  column: {
    flex: 1,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: spacing.sm,
    marginBottom: 2,
    paddingHorizontal: 4,
  },
  sectionTitle: {
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  breakdownCard: {
    marginVertical: 4,
  },
  breakdownContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  iconBox: {
    width: 40,
    height: 40,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  breakdownInfo: {
    flex: 1,
    gap: 6,
  },
  nameRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  prayerName: {
    fontWeight: '700',
  },
  percentText: {
    fontWeight: '800',
  },
  progressBar: {
    height: 8,
    borderRadius: 4,
  },
  footerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
});
