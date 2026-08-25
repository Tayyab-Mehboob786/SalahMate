import React, { useState, useCallback } from 'react';
import { StyleSheet, View, Pressable, RefreshControl, Dimensions } from 'react-native';
import { useRouter } from 'expo-router';
import { AppIcon, ScreenContainer, LocationPickerBottomSheet, PrayerSkeleton } from '@/components';
import { Text, useTheme } from 'react-native-paper';
import { useLocation } from '@/context/LocationContext';
import { useSharedPrayerTimes } from '@/context';
import { useLivePrayerTimings, UIPrayerTiming } from '@/hooks/prayer/useLivePrayerTimings';
import { spacing } from '@/theme';
import type { SalahMateTheme } from '@/theme';
import Animated, { FadeIn, FadeInUp, Layout } from 'react-native-reanimated';

// ----------------------------------------------------------------------
// Memoized Hero Card Section
// ----------------------------------------------------------------------
const HeroSection = React.memo(({ 
  locationText, 
  gregorianDate, 
  hijriDate, 
  currentPrayer, 
  nextPrayer, 
  countdown,
}: { 
  locationText: string;
  gregorianDate: string;
  hijriDate: string;
  currentPrayer: UIPrayerTiming | null;
  nextPrayer: UIPrayerTiming | null;
  countdown: string;
}) => {
  return (
    <Animated.View entering={FadeIn.duration(400)} style={styles.heroSection}>
      {/* Top Location & Date */}
      <View style={styles.heroHeader}>
        <Text style={styles.heroLocationText} numberOfLines={1}>
          {locationText}
        </Text>
        <Text style={styles.heroDateText}>
          {gregorianDate} • {hijriDate}
        </Text>
      </View>

      <View style={styles.heroDivider} />

      {/* Current & Next Prayer Columns */}
      <View style={styles.heroBody}>
        {/* Current Prayer */}
        <View style={styles.heroCol}>
          <AppIcon name="human-handsup" size={24} color="#FFFFFF" style={{ marginBottom: 6 }} />
          <Text style={styles.heroLabelText}>CURRENT PRAYER</Text>
          <Text style={styles.heroPrayerName}>{currentPrayer ? currentPrayer.name : 'None'}</Text>
          <Text style={styles.heroPrayerTime}>{currentPrayer ? currentPrayer.time : '--:--'}</Text>
        </View>

        <View style={styles.heroVerticalDivider} />

        {/* Next Prayer */}
        <View style={styles.heroCol}>
          <AppIcon name="mosque" size={24} color="#FFFFFF" style={{ marginBottom: 6 }} />
          <Text style={styles.heroLabelText}>NEXT PRAYER</Text>
          <Text style={styles.heroPrayerName}>{nextPrayer ? nextPrayer.name : '--'}</Text>
          <Text style={styles.heroCountdownText}>Starts in {countdown}</Text>
        </View>
      </View>
    </Animated.View>
  );
});

// ----------------------------------------------------------------------
// Memoized Prayer List Item
// ----------------------------------------------------------------------
const PrayerListItem = React.memo(({ 
  prayer, 
  index, 
}: { 
  prayer: UIPrayerTiming; 
  index: number; 
}) => {
  const isCurrent = prayer.isCurrent;
  
  const renderStatusBadge = () => {
    if (isCurrent) {
      return (
        <View style={styles.currentBadge}>
          <Text style={styles.currentBadgeText}>CURRENT</Text>
        </View>
      );
    }
    
    if (prayer.status === 'COMPLETED') {
      return (
        <View style={styles.pendingBadgeRow}>
          <AppIcon name="check-circle" size={16} color="#2ECC71" style={{ marginRight: 6 }} />
          <Text style={[styles.pendingBadgeText, { color: '#2ECC71' }]}>Completed</Text>
        </View>
      );
    }

    if (prayer.status === 'QADA') {
      return (
        <View style={styles.pendingBadgeRow}>
          <AppIcon name="clock-outline" size={16} color="#F1C40F" style={{ marginRight: 6 }} />
          <Text style={[styles.pendingBadgeText, { color: '#F1C40F' }]}>Qaza</Text>
        </View>
      );
    }

    if (prayer.status === 'MISSED') {
      return (
        <View style={styles.pendingBadgeRow}>
          <AppIcon name="close-circle" size={16} color="#E74C3C" style={{ marginRight: 6 }} />
          <Text style={[styles.pendingBadgeText, { color: '#E74C3C' }]}>Missed</Text>
        </View>
      );
    }

    return (
      <View style={styles.pendingBadgeRow}>
        <View style={styles.pendingCircle} />
        <Text style={styles.pendingBadgeText}>Pending</Text>
      </View>
    );
  };
  
  return (
    <Animated.View 
      entering={FadeInUp.delay(index * 100).duration(300)} 
      layout={Layout.springify()}
    >
      <View style={[styles.prayerCard, isCurrent && styles.prayerCardCurrent]}>
        <View style={styles.prayerCardLeft}>
          <View style={styles.prayerIconBox}>
            <AppIcon name={prayer.icon as any} size={20} color="#FFFFFF" />
          </View>
          <Text style={styles.prayerCardName}>{prayer.name}</Text>
        </View>

        <View style={styles.prayerCardRight}>
          {renderStatusBadge()}
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
        backgroundImage={require('../../../assets/backgrounds/timings-mosque.png')}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#FFFFFF" />}
      >
        {/* Custom Header */}
        <View style={styles.headerWrapper}>
          <Pressable 
            style={({ pressed }) => [styles.headerBtn, pressed && { opacity: 0.7 }]}
            onPress={() => router.replace('/')}
          >
            <AppIcon name="chevron-left" size={24} color="#FFFFFF" />
          </Pressable>

          <Text style={styles.headerTitle}>Prayer Timings</Text>

          <Pressable 
            style={({ pressed }) => [styles.headerBtn, pressed && { opacity: 0.7 }]}
            onPress={() => router.push('/qibla')}
          >
            <AppIcon name="compass-outline" size={20} color="#FFFFFF" />
          </Pressable>
        </View>

        <View style={styles.container}>
          {isLoading ? (
            <View style={{ paddingHorizontal: spacing.lg, marginTop: 20 }}>
              <PrayerSkeleton />
            </View>
          ) : isError || !data ? (
            <View style={styles.stateContainer}>
              <AppIcon name="alert-circle-outline" size="xl" color="#FFFFFF" />
              <Text style={styles.stateText}>Location unavailable</Text>
              <Text style={styles.stateSubText}>
                Please enable location services{'\n'}or choose a city manually.
              </Text>
              <Pressable style={styles.retryBtn} onPress={onRefresh}>
                <Text style={styles.retryBtnText}>Retry</Text>
              </Pressable>
            </View>
          ) : (
            <View style={styles.content}>
              
              {/* Massive Glass Wrapper */}
              <View style={styles.unifiedGlassWrapper}>
                
                {/* Hero Section */}
                <HeroSection 
                  locationText={renderLocationText()}
                  gregorianDate={data.gregorianDate}
                  hijriDate={data.hijriDate}
                  currentPrayer={currentPrayer}
                  nextPrayer={nextPrayer}
                  countdown={countdown}
                />

                {/* Timetable List */}
                <View style={styles.listContainer}>
                  {prayers.map((prayer, index) => (
                    <PrayerListItem key={prayer.name} prayer={prayer} index={index} />
                  ))}
                </View>

                {/* Settings / Location Buttons */}
                <View style={styles.footerActionsRow}>
                  <Pressable 
                    onPress={() => setIsPickerVisible(true)}
                    style={({ pressed }) => [
                      styles.footerBtn,
                      pressed && { backgroundColor: 'rgba(255,255,255,0.15)' }
                    ]}
                  >
                    <AppIcon name="map-marker-outline" size={16} color="#FFFFFF" style={{ marginRight: 6 }} />
                    <Text style={styles.footerBtnText} numberOfLines={1}>Change Location</Text>
                  </Pressable>
                </View>

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
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 24,
  },
  headerBtn: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 22,
    lineHeight: 30,
    fontWeight: '700',
    color: '#FFFFFF',
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
    paddingVertical: 4,
  },
  container: {
    flex: 1,
  },
  content: {
    paddingHorizontal: 16,
  },
  stateContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 100,
    paddingHorizontal: 24,
  },
  stateText: {
    marginTop: 16,
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
    textAlign: 'center',
  },
  stateSubText: {
    marginTop: 8,
    fontSize: 14,
    color: 'rgba(255,255,255,0.8)',
    textAlign: 'center',
  },
  retryBtn: {
    marginTop: 20,
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.3)',
  },
  retryBtnText: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 16,
  },
  // Unified Wrapper
  unifiedGlassWrapper: {
    backgroundColor: 'rgba(0,0,0,0.3)',
    borderRadius: 24,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
    padding: 16,
    marginBottom: 20,
  },
  // Hero Section
  heroSection: {
    marginBottom: 20,
  },
  heroHeader: {
    alignItems: 'center',
    marginBottom: 16,
  },
  heroLocationText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  heroDateText: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.8)',
  },
  heroDivider: {
    height: 1,
    backgroundColor: 'rgba(255,255,255,0.15)',
    marginBottom: 20,
    marginHorizontal: 8,
  },
  heroBody: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  heroCol: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  heroVerticalDivider: {
    width: 1,
    height: '100%',
    backgroundColor: 'rgba(255,255,255,0.15)',
    marginHorizontal: 12,
  },
  heroLabelText: {
    fontSize: 10,
    color: 'rgba(255,255,255,0.7)',
    fontWeight: '700',
    letterSpacing: 0.5,
    marginBottom: 6,
  },
  heroPrayerName: {
    fontSize: 28,
    lineHeight: 36,
    paddingVertical: 2,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  heroPrayerTime: {
    fontSize: 16,
    fontWeight: '500',
    color: 'rgba(255,255,255,0.9)',
  },
  heroCountdownText: {
    fontSize: 13,
    fontWeight: '500',
    color: 'rgba(255,255,255,0.9)',
  },
  // List Container
  listContainer: {
    gap: 8,
    marginBottom: 20,
  },
  prayerCard: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.15)',
  },
  prayerCardCurrent: {
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderColor: '#3498db',
    borderWidth: 1.5,
  },
  prayerCardLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  prayerIconBox: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  prayerCardName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  prayerCardRight: {
    width: 110,
    alignItems: 'flex-end',
  },
  pendingBadgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  pendingCircle: {
    width: 12,
    height: 12,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.7)',
    marginRight: 6,
  },
  pendingBadgeText: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.8)',
    fontWeight: '500',
  },
  currentBadge: {
    backgroundColor: 'rgba(52, 152, 219, 0.5)',
    borderColor: '#3498db',
    borderWidth: 1,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  currentBadgeText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  // Footer
  footerActionsRow: {
    flexDirection: 'row',
    gap: 12,
  },
  footerBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    borderRadius: 16,
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.15)',
  },
  footerBtnText: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 13,
  },
});
