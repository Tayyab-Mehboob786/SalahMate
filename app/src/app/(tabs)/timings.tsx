import React, { useState, useCallback } from 'react';
import { StyleSheet, View, Pressable, RefreshControl } from 'react-native';
import { useRouter } from 'expo-router';
import { AppIcon } from '@/components';
import { Text, useTheme } from 'react-native-paper';
import { GlassButton, GlassCard, GlassHeader, ScreenContainer, LocationPickerBottomSheet, PrayerSkeleton } from '@/components';
import { useLocation } from '@/context/LocationContext';
import { useSharedPrayerTimes } from '@/context';
import { useLivePrayerTimings, UIPrayerTiming } from '@/hooks/prayer/useLivePrayerTimings';
import { spacing, shadows } from '@/theme';
import type { SalahMateTheme } from '@/theme';
import Animated, { FadeIn, FadeInUp, Layout } from 'react-native-reanimated';

// ----------------------------------------------------------------------
// Memoized Hero Card
// ----------------------------------------------------------------------
const HeroCard = React.memo(({ 
  locationText, 
  gregorianDate, 
  hijriDate, 
  currentPrayer, 
  nextPrayer, 
  countdown,
  theme 
}: { 
  locationText: string;
  gregorianDate: string;
  hijriDate: string;
  currentPrayer: UIPrayerTiming | null;
  nextPrayer: UIPrayerTiming | null;
  countdown: string;
  theme: SalahMateTheme;
}) => {
  return (
    <Animated.View entering={FadeIn.duration(400)}>
      <GlassCard borderRadius={24} style={styles.heroCard}>
        {/* Top Header */}
        <View style={styles.heroHeader}>
          <View style={styles.heroLocation}>
            <AppIcon name="map-marker" size="sm" variant="error" style={{ marginRight: 4 }} />
            <Text variant="labelMedium" style={{ color: theme.colors.onSurfaceVariant, fontWeight: '600' }} numberOfLines={1}>
              {locationText}
            </Text>
          </View>
          <View style={{ alignItems: 'flex-end' }}>
            <Text variant="labelSmall" style={{ color: theme.colors.primary, fontWeight: '700' }}>
              {gregorianDate}
            </Text>
            <Text variant="bodySmall" style={{ color: theme.colors.onSurfaceVariant }}>
              {hijriDate}
            </Text>
          </View>
        </View>

        <View style={[styles.heroDivider, { backgroundColor: theme.colors.border }]} />

        {/* Current & Next Prayer */}
        <View style={styles.heroBody}>
          <View style={styles.heroCol}>
            <Text variant="labelSmall" style={{ color: theme.colors.onSurfaceVariant, textTransform: 'uppercase', letterSpacing: 0.5 }}>
              Current Prayer
            </Text>
            <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 4 }}>
              <Text variant="headlineSmall" style={{ color: theme.colors.onSurface, fontWeight: '800' }}>
                {currentPrayer ? currentPrayer.name : 'None'}
              </Text>
            </View>
            <Text variant="titleMedium" style={{ color: theme.colors.primary, fontWeight: '700', marginTop: 2 }}>
              {currentPrayer ? currentPrayer.time : '--:--'}
            </Text>
          </View>

          <View style={[styles.heroVerticalDivider, { backgroundColor: theme.colors.border }]} />

          <View style={styles.heroCol}>
            <Text variant="labelSmall" style={{ color: theme.colors.onSurfaceVariant, textTransform: 'uppercase', letterSpacing: 0.5 }}>
              Next Prayer
            </Text>
            <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 4 }}>
              <AppIcon name={nextPrayer?.icon as any || 'clock-outline'} size={18} color={theme.colors.onSurface} style={{ marginRight: 6 }} />
              <Text variant="headlineSmall" style={{ color: theme.colors.onSurface, fontWeight: '800' }}>
                {nextPrayer ? nextPrayer.name : '--'}
              </Text>
            </View>
            <Text variant="labelSmall" style={{ color: theme.colors.primary, fontWeight: '600', marginTop: 4 }}>
              Starts in
            </Text>
            <Text variant="titleMedium" style={{ color: theme.colors.onSurface, fontWeight: '700', fontVariant: ['tabular-nums'] }}>
              {countdown}
            </Text>
          </View>
        </View>
      </GlassCard>
    </Animated.View>
  );
});

// ----------------------------------------------------------------------
// Memoized Prayer List Item
// ----------------------------------------------------------------------
const PrayerListItem = React.memo(({ 
  prayer, 
  index, 
  theme 
}: { 
  prayer: UIPrayerTiming; 
  index: number; 
  theme: SalahMateTheme 
}) => {
  const isCurrent = prayer.isCurrent;
  const isCompleted = prayer.status === 'COMPLETED';
  const isMissed = prayer.status === 'MISSED';
  
  return (
    <Animated.View 
      entering={FadeInUp.delay(index * 100).duration(300)} 
      layout={Layout.springify()}
    >
      <View
        style={[
          styles.prayerCard,
          { backgroundColor: theme.colors.surfaceVariant, borderColor: theme.colors.border },
          isCurrent && {
            borderColor: theme.colors.primary,
            backgroundColor: theme.colors.primary,
            borderWidth: 2,
            ...shadows.sm,
            paddingVertical: spacing.lg,
          }
        ]}
      >
        <View style={styles.prayerCardLeft}>
          <View style={[styles.prayerIconBox, { backgroundColor: isCurrent ? theme.colors.onPrimary : theme.colors.surface }]}>
            <AppIcon 
              name={prayer.icon as any} 
              size={20} 
              color={isCurrent ? theme.colors.primary : theme.colors.iconSecondary} 
            />
          </View>
          <View>
            <Text variant="titleMedium" style={{ color: isCurrent ? theme.colors.onPrimary : theme.colors.onSurface, fontWeight: '700' }}>
              {prayer.name}
            </Text>
            {isCurrent && (
              <View style={[styles.currentBadge, { backgroundColor: theme.colors.onPrimary }]}>
                <Text style={[styles.currentBadgeText, { color: theme.colors.primary }]}>CURRENT</Text>
              </View>
            )}
          </View>
        </View>

        <View style={styles.prayerCardRight}>
          <Text variant="titleMedium" style={{ color: isCurrent ? theme.colors.onPrimary : theme.colors.onSurface, fontWeight: '700', fontVariant: ['tabular-nums'] }}>
            {prayer.time}
          </Text>
          <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 4 }}>
            {isCompleted ? (
              <>
                <AppIcon name="check-circle" size={14} color={isCurrent ? theme.colors.onPrimary : theme.colors.primary} style={{ marginRight: 4 }} />
                <Text variant="labelSmall" style={{ color: isCurrent ? theme.colors.onPrimary : theme.colors.primary, fontWeight: '600' }}>Completed</Text>
              </>
            ) : isMissed ? (
              <>
                <AppIcon name="close-circle" size={14} color={isCurrent ? '#FFB4AB' : theme.colors.error} style={{ marginRight: 4 }} />
                <Text variant="labelSmall" style={{ color: isCurrent ? '#FFB4AB' : theme.colors.error, fontWeight: '600' }}>Missed</Text>
              </>
            ) : (
              <>
                <AppIcon name="circle-outline" size={14} color={isCurrent ? 'rgba(255,255,255,0.7)' : theme.colors.onSurfaceVariant} style={{ marginRight: 4 }} />
                <Text variant="labelSmall" style={{ color: isCurrent ? 'rgba(255,255,255,0.9)' : theme.colors.onSurfaceVariant }}>Pending</Text>
              </>
            )}
          </View>
        </View>
      </View>
    </Animated.View>
  );
});

// ----------------------------------------------------------------------
// Main Screen
// ----------------------------------------------------------------------
export default function TimingsScreen() {
  const router = useRouter();
  const theme = useTheme<SalahMateTheme>();
  const { location, isDetecting, error: locationError } = useLocation();
  const [isPickerVisible, setIsPickerVisible] = useState(false);
  
  const { data, isLoading: isPrayerTimesLoading, isError, refetch } = useSharedPrayerTimes();
  const { prayers, currentPrayer, nextPrayer, countdown, refetchLogs } = useLivePrayerTimings();
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await Promise.all([refetch(), refetchLogs()]);
    setRefreshing(false);
  }, [refetch, refetchLogs]);

  const renderLocationText = () => {
    if (isDetecting && !location) return 'Updating your location...';
    if (locationError && !location) return 'Location permission required.';
    if (isDetecting && location) return `Refreshing location... (${location.city})`;
    if (locationError && location) return `Using last known: ${location.city}`;
    return location ? `${location.city}, ${location.country}` : 'Unknown Location';
  };

  const isLoading = isPrayerTimesLoading && !data;

  return (
    <>
      <ScreenContainer 
        scrollable 
        withGlassGradient 
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={theme.colors.primary} />}
      >
        <View style={styles.headerWrapper}>
          <GlassHeader 
            title="Prayer Timings" 
            showBack 
            rightSlot={
              <Pressable onPress={() => router.push('/qibla')} style={({pressed}) => [pressed && {opacity: 0.7}]}>
                <AppIcon name="compass-outline" size="md" variant="primary" />
              </Pressable>
            }
          />
        </View>

        <View style={styles.container}>
          {isLoading ? (
            <View style={{ paddingHorizontal: spacing.lg }}>
              <PrayerSkeleton />
            </View>
          ) : isError || !data ? (
            <View style={styles.stateContainer}>
              <AppIcon name="alert-circle-outline" size="xl" variant="error" />
              <Text style={[styles.stateText, { color: theme.colors.onSurface }]}>Location unavailable</Text>
              <Text style={[styles.stateSubText, { color: theme.colors.onSurfaceVariant }]}>
                Please enable location services{'\n'}or choose a city manually.
              </Text>
              <GlassButton label="Retry" onPress={onRefresh} variant="primary" style={{ marginTop: spacing.md }} />
            </View>
          ) : (
            <View style={styles.content}>
              
              {/* Hero Card */}
              <HeroCard 
                locationText={renderLocationText()}
                gregorianDate={data.gregorianDate}
                hijriDate={data.hijriDate}
                currentPrayer={currentPrayer}
                nextPrayer={nextPrayer}
                countdown={countdown}
                theme={theme}
              />

              {/* Timetable List */}
              <View style={styles.listContainer}>
                {prayers.map((prayer, index) => (
                  <PrayerListItem key={prayer.name} prayer={prayer} index={index} theme={theme} />
                ))}
              </View>

              {/* Settings / Location Buttons */}
              <View style={styles.footerActions}>
                <Pressable 
                  onPress={() => setIsPickerVisible(true)}
                  style={({ pressed }) => [
                    styles.outlinedBtn,
                    { borderColor: theme.colors.outline },
                    pressed && { backgroundColor: theme.colors.surfaceVariant }
                  ]}
                >
                  <AppIcon name="map-marker-outline" size="sm" color={theme.colors.onSurface} style={{ marginRight: 8 }} />
                  <Text variant="labelLarge" style={{ color: theme.colors.onSurface, fontWeight: '600' }}>Change Location</Text>
                </Pressable>

                <Pressable 
                  onPress={() => router.push('/settings')}
                  style={({ pressed }) => [
                    styles.outlinedBtn,
                    { borderColor: theme.colors.outline, marginTop: spacing.sm },
                    pressed && { backgroundColor: theme.colors.surfaceVariant }
                  ]}
                >
                  <AppIcon name="cog-outline" size="sm" color={theme.colors.onSurface} style={{ marginRight: 8 }} />
                  <Text variant="labelLarge" style={{ color: theme.colors.onSurface, fontWeight: '600' }}>Calculation Method</Text>
                </Pressable>
                
                <Text variant="bodySmall" style={{ color: theme.colors.onSurfaceVariant, textAlign: 'center', marginTop: spacing.md }}>
                  Method: {data.calculationMethod}
                </Text>
              </View>

              {/* Padding for bottom nav */}
              <View style={{ height: spacing['4xl'] }} />
            </View>
          )}
        </View>
      </ScreenContainer>
      <LocationPickerBottomSheet visible={isPickerVisible} onDismiss={() => setIsPickerVisible(false)} />
    </>
  );
}

const styles = StyleSheet.create({
  headerWrapper: {
    paddingHorizontal: spacing.md,
  },
  container: {
    flex: 1,
  },
  content: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.sm,
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
  // Hero Card
  heroCard: {
    padding: spacing.lg,
    marginBottom: spacing.xl,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  heroHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  heroLocation: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    paddingRight: spacing.sm,
  },
  heroDivider: {
    height: 1,
    width: '100%',
    marginVertical: spacing.md,
    opacity: 0.5,
  },
  heroBody: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  heroCol: {
    flex: 1,
  },
  heroVerticalDivider: {
    width: 1,
    height: '100%',
    marginHorizontal: spacing.md,
    opacity: 0.5,
  },
  // List Container
  listContainer: {
    gap: spacing.sm,
  },
  prayerCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 14,
    paddingHorizontal: spacing.lg,
    borderRadius: 20,
    borderWidth: 1,
  },
  prayerCardLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  prayerIconBox: {
    width: 42,
    height: 42,
    borderRadius: 21,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.md,
  },
  currentBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
    marginTop: 2,
  },
  currentBadgeText: {
    color: '#FFF',
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  prayerCardRight: {
    alignItems: 'flex-end',
  },
  // Footer
  footerActions: {
    marginTop: spacing.xl,
  },
  outlinedBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    borderRadius: 16,
    borderWidth: 1,
  },
});
