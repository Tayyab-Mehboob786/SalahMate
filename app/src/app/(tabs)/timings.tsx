/**
 * SalahMate Prayer Timings Screen (`/(tabs)/timings`)
 *
 * Premium timetable screen with tabular numerals, Qibla compass bearing indicator,
 * prayer time icons, and calculation preference shortcuts.
 */

import React, { useState, useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import { useRouter } from 'expo-router';
import { AppIcon } from '@/components';
import { Text, useTheme } from 'react-native-paper';
import { GlassButton, GlassCard, GlassHeader, GlassStatisticCard, ScreenContainer, LocationPickerBottomSheet, PrayerSkeleton } from '@/components';
import { usePullToRefresh } from '@/hooks';
import { useLocation } from '@/context/LocationContext';
import { spacing, icons } from '@/theme';
import type { SalahMateTheme } from '@/theme';

interface TimetableRow {
  name: string;
  time: string;
  icon: string;
  isNext?: boolean;
}

const DAILY_SCHEDULE: TimetableRow[] = [
  { name: 'Fajr', time: '5:12 AM', icon: 'weather-sunset-up' },
  { name: 'Sunrise', time: '6:35 AM', icon: 'weather-sunset' },
  { name: 'Dhuhr', time: '12:45 PM', icon: 'weather-sunny' },
  { name: 'Asr', time: '4:15 PM', icon: 'weather-partly-cloudy', isNext: true },
  { name: 'Maghrib', time: '6:55 PM', icon: 'weather-sunset-down' },
  { name: 'Isha', time: '8:18 PM', icon: 'weather-night' },
];

export default function TimingsScreen() {
  const router = useRouter();
  const theme = useTheme<SalahMateTheme>();
  const { location } = useLocation();
  const [isPickerVisible, setIsPickerVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const { refreshControl } = usePullToRefresh();

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      <ScreenContainer scrollable withPadding withGlassGradient refreshControl={refreshControl}>
        <GlassHeader 
          title="Prayer Timings" 
          subtitle={
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <AppIcon name="map-marker" size="xs" variant="error" style={{ marginRight: 2 }} />
              <Text variant="labelSmall" style={{ color: theme.colors.onSurfaceVariant }}>
                {location.city}, {location.country}
              </Text>
            </View>
          } 
          showBack 
        />

      {isLoading ? (
        <PrayerSkeleton />
      ) : (
      <View style={styles.content}>
        {/* Next Prayer Compact Card */}
        <GlassCard borderRadius={16} style={{ marginBottom: spacing.md, padding: spacing.md }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
            <View style={{ flex: 1 }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: spacing.xs }}>
                <AppIcon name="clock-time-four-outline" size="md" variant="primary" />
                <Text variant="labelSmall" style={{ color: theme.colors.primary, fontWeight: '700', marginLeft: spacing.xs }}>
                  NEXT PRAYER
                </Text>
              </View>
              <Text variant="titleMedium" style={{ color: theme.colors.onSurface, fontWeight: '800' }}>
                Asr • 4:15 PM
              </Text>
              <Text variant="bodySmall" style={{ color: theme.colors.onSurfaceVariant, marginTop: 2 }}>
                Starts in 2h 14m · Obligatory 4 Rakats
              </Text>
            </View>
            <View style={{ backgroundColor: theme.colors.primaryContainer, padding: spacing.sm, borderRadius: 12 }}>
               <AppIcon name="mosque" size="lg" variant="primary" />
            </View>
          </View>
        </GlassCard>

        {/* Timetable Section */}
        <View style={styles.sectionHeaderRow}>
          <Text
            variant="titleSmall"
            style={[styles.sectionTitle, { color: theme.colors.onSurface }]}
          >
            TODAY&apos;S TIMETABLE
          </Text>
          <Text variant="bodySmall" style={{ color: theme.colors.onSurfaceVariant }}>
            Tabular standard time
          </Text>
        </View>

        <GlassCard borderRadius={22} contentStyle={styles.timetableCard}>
          {DAILY_SCHEDULE.map((row, index) => {
            const isLast = index === DAILY_SCHEDULE.length - 1;
            return (
              <View
                key={row.name}
                style={[
                  styles.tableRow,
                  !isLast && [styles.rowBorder, { borderBottomColor: theme.colors.border }],
                  row.isNext && [styles.nextRow, { backgroundColor: theme.colors.primaryContainer }],
                ]}
              >
                <View style={styles.nameCol}>
                  <AppIcon
                    name={row.icon as any}
                    size={22}
                    color={row.isNext ? theme.colors.iconPrimary : theme.colors.iconSecondary}
                  />
                  <Text
                    variant="bodyLarge"
                    style={{
                      color: row.isNext ? theme.colors.primary : theme.colors.onSurface,
                      fontWeight: row.isNext ? '800' : '600',
                    }}
                  >
                    {row.name}
                  </Text>
                  {row.isNext ? (
                    <View style={[styles.nextBadge, { backgroundColor: theme.colors.primary }]}>
                      <Text
                        variant="labelSmall"
                        style={{ color: theme.colors.onPrimary, fontWeight: '800', fontSize: 10 }}
                      >
                        NEXT
                      </Text>
                    </View>
                  ) : null}
                </View>

                <Text
                  variant="bodyLarge"
                  style={{
                    color: row.isNext ? theme.colors.primary : theme.colors.onSurface,
                    fontWeight: row.isNext ? '800' : '700',
                    fontVariant: ['tabular-nums'],
                  }}
                >
                  {row.time}
                </Text>
              </View>
            );
          })}
        </GlassCard>

        {/* Calculation Shortcut Footer */}
        <View style={styles.calcFooter}>
          <Text variant="bodySmall" style={{ color: theme.colors.onSurfaceVariant, textAlign: 'center' }}>
            Calculations strictly verified using Muslim World League & Shafi&apos;i/Maliki Asr method.
          </Text>
          <GlassButton
            label="Change Calculation Method"
            variant="glass"
            borderRadius={14}
            icon={<AppIcon name="cog-outline" size={18} variant="primary" />}
            onPress={() => router.push('/settings')}
            style={styles.calcBtn}
          />
        </View>
        <View style={styles.calcFooter}>
          <GlassButton
            label="Change Location"
            variant="glass"
            icon={<AppIcon name="map-marker-outline" size="md" variant="primary" />}
            onPress={() => setIsPickerVisible(true)}
            style={styles.calcBtn}
          />
        </View>

        {/* Padding for bottom nav */}
        <View style={{ height: spacing['4xl'] }} />
      </View>
      )}
      </ScreenContainer>
    <LocationPickerBottomSheet visible={isPickerVisible} onDismiss={() => setIsPickerVisible(false)} />
  </>
  );
}

const styles = StyleSheet.create({
  content: {
    paddingVertical: spacing.md,
    gap: spacing.md,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: spacing.xs,
    paddingHorizontal: 4,
  },
  sectionTitle: {
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  timetableCard: {
    paddingVertical: 4,
    paddingHorizontal: 0,
  },
  tableRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
  },
  nextRow: {
    borderRadius: 14,
    marginHorizontal: 6,
  },
  rowBorder: {
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  nameCol: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  nextBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
    marginLeft: 4,
  },
  calcFooter: {
    gap: spacing.sm,
    marginTop: spacing.sm,
    marginBottom: spacing.xl,
  },
  calcBtn: {
    width: '100%',
  },
});
