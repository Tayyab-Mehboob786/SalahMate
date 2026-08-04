import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { useRouter } from 'expo-router';
import { AppIcon } from '@/components';
import { Text, useTheme } from 'react-native-paper';
import { GlassButton, GlassCard, GlassHeader, ScreenContainer, LocationPickerBottomSheet, PrayerSkeleton } from '@/components';
import { usePullToRefresh } from '@/hooks';
import { useLocation } from '@/context/LocationContext';
import { useSharedPrayerTimes } from '@/context';
import { spacing } from '@/theme';
import type { SalahMateTheme } from '@/theme';

export default function TimingsScreen() {
  const router = useRouter();
  const theme = useTheme<SalahMateTheme>();
  const { location, isDetecting, error: locationError } = useLocation();
  const [isPickerVisible, setIsPickerVisible] = useState(false);
  
  const { data, isLoading, isError, refetch } = useSharedPrayerTimes();
  const { refreshControl } = usePullToRefresh(refetch);

  const renderLocationText = () => {
    if (isDetecting && !location) return 'Updating your location...';
    if (locationError && !location) return 'Location permission required.';
    if (isDetecting && location) return `Refreshing location... (${location.city})`;
    if (locationError && location) return `Using last known: ${location.city}`;
    return location ? `${location.city}, ${location.country}` : 'Unknown Location';
  };

  return (
    <>
      <ScreenContainer scrollable withPadding withGlassGradient refreshControl={refreshControl}>
        <GlassHeader 
          title="Prayer Timings" 
          subtitle={
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <AppIcon name="map-marker" size="xs" variant="error" style={{ marginRight: 2 }} />
              <Text variant="labelSmall" style={{ color: theme.colors.onSurfaceVariant }}>
                {renderLocationText()}
              </Text>
            </View>
          } 
          showBack 
        />

        {isLoading ? (
          <PrayerSkeleton />
        ) : isError ? (
          <View style={styles.stateContainer}>
            <AppIcon name="alert-circle-outline" size="xl" variant="error" />
            <Text style={[styles.stateText, { color: theme.colors.onSurface }]}>Unable to load prayer timings.</Text>
            <Text style={[styles.stateSubText, { color: theme.colors.onSurfaceVariant }]}>Please try again.</Text>
            <GlassButton label="Retry" onPress={refetch} variant="primary" style={{ marginTop: spacing.md }} />
          </View>
        ) : !data ? (
          <View style={styles.stateContainer}>
            <AppIcon name="calendar-blank-outline" size="xl" variant="primary" />
            <Text style={[styles.stateText, { color: theme.colors.onSurface }]}>Prayer timings unavailable.</Text>
          </View>
        ) : (
          <View style={styles.content}>
            
            {/* Dates Card */}
            <GlassCard borderRadius={16} style={{ marginBottom: spacing.md, padding: spacing.md }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                <View style={{ flex: 1 }}>
                  <Text variant="labelSmall" style={{ color: theme.colors.primary, fontWeight: '700', marginBottom: spacing.xs }}>
                    TODAY
                  </Text>
                  <Text variant="titleMedium" style={{ color: theme.colors.onSurface, fontWeight: '800' }}>
                    {data.gregorianDate}
                  </Text>
                  <Text variant="bodySmall" style={{ color: theme.colors.onSurfaceVariant, marginTop: 2 }}>
                    {data.hijriDate}
                  </Text>
                </View>
                <View style={{ backgroundColor: theme.colors.primaryContainer, padding: spacing.sm, borderRadius: 12 }}>
                   <AppIcon name="calendar-month" size="lg" variant="primary" />
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
              {[
                { name: 'Fajr', time: data.timings.fajr, icon: 'weather-sunset-up' },
                { name: 'Sunrise', time: data.timings.sunrise, icon: 'weather-sunset' },
                { name: 'Dhuhr', time: data.timings.dhuhr, icon: 'weather-sunny' },
                { name: 'Asr', time: data.timings.asr, icon: 'weather-partly-cloudy' },
                { name: 'Maghrib', time: data.timings.maghrib, icon: 'weather-sunset-down' },
                { name: 'Isha', time: data.timings.isha, icon: 'weather-night' },
              ].map((row, index, arr) => {
                const isLast = index === arr.length - 1;
                return (
                  <View
                    key={row.name}
                    style={[
                      styles.tableRow,
                      !isLast && [styles.rowBorder, { borderBottomColor: theme.colors.border }],
                    ]}
                  >
                    <View style={styles.nameCol}>
                      <AppIcon
                        name={row.icon as any}
                        size={22}
                        color={theme.colors.iconSecondary}
                      />
                      <Text
                        variant="bodyLarge"
                        style={{
                          color: theme.colors.onSurface,
                          fontWeight: '600',
                        }}
                      >
                        {row.name}
                      </Text>
                    </View>

                    <Text
                      variant="bodyLarge"
                      style={{
                        color: theme.colors.onSurface,
                        fontWeight: '700',
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
                Calculations: {data.calculationMethod}
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
  stateContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 100,
    paddingHorizontal: spacing.xl,
  },
  stateText: {
    marginTop: spacing.md,
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
  },
  stateSubText: {
    marginTop: spacing.xs,
    fontSize: 14,
    textAlign: 'center',
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
  rowBorder: {
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  nameCol: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  calcFooter: {
    gap: spacing.sm,
    marginTop: spacing.sm,
    marginBottom: spacing.md,
  },
  calcBtn: {
    width: '100%',
  },
});
