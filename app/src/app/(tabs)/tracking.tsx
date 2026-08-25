import React, { useState, useEffect, useCallback } from 'react';
import { StyleSheet, View, Alert, ActivityIndicator, Pressable } from 'react-native';
import { Text, useTheme } from 'react-native-paper';
import { ScreenContainer, CircularProgress } from '@/components';
import { PrayerCard, PrayerStatus } from '@/components/tracker';
import { usePrayerProgress } from '@/hooks/prayer/usePrayerProgress';
import type { PrayerName } from '@/types/prayer.types';
import { prayersApi, StreakData } from '@/api/prayers.api';
import { useSharedPrayerTimes } from '@/context';
import { useAuth } from '@/hooks/auth/useAuth';
import { AppIcon } from '@/components/common/AppIcon';
import { spacing } from '@/theme';
import { useRouter } from 'expo-router';

interface UIPrayerData {
  id?: string;
  name: PrayerName;
  time: string;
  icon: string;
  status: PrayerStatus;
}

const DEFAULT_PRAYERS: { name: PrayerName; time: string; icon: string }[] = [
  { name: 'Fajr', time: '--:--', icon: 'weather-sunset-up' },
  { name: 'Dhuhr', time: '--:--', icon: 'weather-sunny' },
  { name: 'Asr', time: '--:--', icon: 'weather-partly-cloudy' },
  { name: 'Maghrib', time: '--:--', icon: 'weather-sunset-down' },
  { name: 'Isha', time: '--:--', icon: 'weather-night' },
];

export default function TrackingScreen() {
  const router = useRouter();
  const [prayers, setPrayers] = useState<UIPrayerData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);
  const [streakData, setStreakData] = useState<StreakData | null>(null);
  const [isStreakLoading, setIsStreakLoading] = useState(true);
  
  const { data: prayerTimesData, isLoading: isPrayerTimesLoading, isError: isPrayerTimesError } = useSharedPrayerTimes();
  const { user } = useAuth();
  const firstName = user?.firstName || 'Tayyab';

  const checkPrayerWindow = useCallback((index: number, list: { time: string }[]) => {
    const target = list[index];
    if (!target || !target.time || target.time === '--:--' || !target.time.includes(':')) {
      return { hasEntered: false, hasPassed: false };
    }

    const now = new Date();
    const currentMs = now.getTime();

    const parseToDate = (timeStr: string) => {
      const [h, m] = timeStr.split(':').map(Number);
      const d = new Date();
      d.setHours(h, m, 0, 0);
      return d;
    };

    const startMs = parseToDate(target.time).getTime();
    const hasEntered = currentMs >= startMs;

    let hasPassed = false;
    if (index === 0) {
      // Fajr: Expire / Qaza window ends at Sunrise (NOT Dhuhr)!
      const sunriseTimeStr = prayerTimesData?.timings.sunrise;
      if (sunriseTimeStr && sunriseTimeStr !== '--:--' && sunriseTimeStr.includes(':')) {
        const sunriseMs = parseToDate(sunriseTimeStr).getTime();
        hasPassed = currentMs >= sunriseMs;
      } else if (index < list.length - 1) {
        const nextTimeStr = list[index + 1].time;
        if (nextTimeStr && nextTimeStr !== '--:--' && nextTimeStr.includes(':')) {
          const nextMs = parseToDate(nextTimeStr).getTime();
          hasPassed = currentMs >= nextMs;
        }
      }
    } else if (index < list.length - 1) {
      const nextTimeStr = list[index + 1].time;
      if (nextTimeStr && nextTimeStr !== '--:--' && nextTimeStr.includes(':')) {
        const nextMs = parseToDate(nextTimeStr).getTime();
        hasPassed = currentMs >= nextMs;
      }
    } else {
      const endOfDay = new Date();
      endOfDay.setHours(23, 59, 59, 999);
      hasPassed = currentMs > endOfDay.getTime();
    }

    return { hasEntered, hasPassed };
  }, [prayerTimesData]);

  const loadTodayPrayers = useCallback(async () => {
    try {
      const logs = await prayersApi.getToday();
      
      // Extract times array in DEFAULT_PRAYERS order
      const timesList = DEFAULT_PRAYERS.map((defaultPrayer) => {
        let liveTime = '--:--';
        if (prayerTimesData && !isPrayerTimesError) {
          const key = defaultPrayer.name.toLowerCase() as keyof typeof prayerTimesData.timings;
          liveTime = prayerTimesData.timings[key] || '--:--';
        }
        return { time: liveTime };
      });

      const mappedPrayers: UIPrayerData[] = DEFAULT_PRAYERS.map((defaultPrayer, idx) => {
        const backendPrayerName = defaultPrayer.name.toUpperCase();
        const existingLog = logs.find((log) => log.prayer === backendPrayerName);
        const liveTime = timesList[idx].time;
        const { hasPassed } = checkPrayerWindow(idx, timesList);

        let uiStatus: PrayerStatus = 'Pending';
        if (existingLog) {
          if (existingLog.status === 'COMPLETED') uiStatus = 'Completed';
          else if (existingLog.status === 'MISSED') uiStatus = 'Missed';
          else if (existingLog.status === 'QADA') uiStatus = 'Qada';
        } else if (hasPassed) {
          uiStatus = 'Missed';
        }

        return {
          ...defaultPrayer,
          time: liveTime,
          id: existingLog?.id,
          status: uiStatus,
        };
      });

      setPrayers(mappedPrayers);
    } catch (error: any) {
      const message = error.response?.data?.message || error.message || 'Failed to fetch today\'s prayers.';
      Alert.alert('Error', message);
    } finally {
      setIsLoading(false);
    }
  }, [prayerTimesData, isPrayerTimesError, checkPrayerWindow]);

  const loadStreak = useCallback(async () => {
    try {
      const data = await prayersApi.getStreak();
      setStreakData(data);
    } catch (error) {
      console.error('Failed to load streak data:', error);
    } finally {
      setIsStreakLoading(false);
    }
  }, []);

  useEffect(() => {
    loadTodayPrayers();
    loadStreak();
  }, [loadTodayPrayers, loadStreak]);

  const handleActionPress = async (name: PrayerName, currentStatus: PrayerStatus) => {
    if (isUpdating) return;

    try {
      const targetIndex = prayers.findIndex(p => p.name === name);
      if (targetIndex === -1) return;

      const targetPrayer = prayers[targetIndex];
      const timesList = prayers.map(p => ({ time: p.time }));
      const { hasEntered, hasPassed } = checkPrayerWindow(targetIndex, timesList);

      // Prevent user from marking a prayer before its time has entered
      if (!hasEntered && currentStatus === 'Pending') {
        Alert.alert(
          'Prayer Time Not Entered',
          `You cannot mark ${name} as prayed until its time enters at ${targetPrayer.time}.`
        );
        return;
      }

      setIsUpdating(true);
      const backendPrayerName = name.toUpperCase();

      if (currentStatus === 'Pending') {
        // If the prayer window has ended (next prayer entered), log as QADA. Otherwise log as COMPLETED!
        const initialStatus = hasPassed ? 'QADA' : 'COMPLETED';
        await prayersApi.createLog(backendPrayerName, initialStatus);
      } else if (currentStatus === 'Missed') {
        if (targetPrayer.id) {
          await prayersApi.updateLog(targetPrayer.id, 'QADA');
        } else {
          await prayersApi.createLog(backendPrayerName, 'QADA');
        }
      } else if (currentStatus === 'Completed' || currentStatus === 'Qada') {
        if (targetPrayer.id) {
          await prayersApi.deleteLog(targetPrayer.id);
        }
      }

      await Promise.all([loadTodayPrayers(), loadStreak()]);
    } catch (error: any) {
      const message = error.response?.data?.message || error.message || 'Failed to update prayer log.';
      Alert.alert('Error', message);
    } finally {
      setIsUpdating(false);
    }
  };

  const { completedCount, motivationMessage } = usePrayerProgress(prayers);
  const progressPercentage = (completedCount / 5) * 100;
  const currentStreak = streakData?.currentStreak || 0;
  
  // Find Next Prayer
  const nextPrayer = prayers.find(p => p.status === 'Pending') || prayers[prayers.length - 1] || DEFAULT_PRAYERS[0];
  const nextPrayerText = `${nextPrayer.name} • ${nextPrayer.time}`;

  return (
    <ScreenContainer 
      scrollable 
      backgroundImage={require('../../../assets/backgrounds/track-mosque.png')}
    >
      <View style={styles.headerWrapper}>
        <Pressable 
          style={({ pressed }) => [styles.headerBtn, pressed && { opacity: 0.7 }]}
          onPress={() => router.replace('/')}
        >
          <AppIcon name="chevron-left" size={24} color="#FFFFFF" />
        </Pressable>

        <Text style={styles.headerTitle}>Prayer Tracking</Text>

        <View style={{ width: 44, height: 44 }} />
      </View>
      
      {isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#FFF" />
        </View>
      ) : (
        <>
          <View style={styles.dashboardCard}>
            <View style={styles.progressRow}>
              <View style={styles.ringContainer}>
                <CircularProgress 
                  statuses={prayers.map(p => p.status)}
                  percentage={Math.round(progressPercentage)} 
                  radius={42} 
                  strokeWidth={8} 
                  color="#2ECC71" 
                  trackColor="rgba(255,255,255,0.15)"
                />
              </View>

              <View style={styles.progressInfoCol}>
                <Text style={styles.progressTitleText}>Daily Progress</Text>
                <Text style={styles.progressCountText}>{completedCount} / 5 Prayers</Text>
                
                <View style={styles.motivationPill}>
                  <Text style={styles.motivationText} numberOfLines={2}>
                    {motivationMessage}
                  </Text>
                </View>
              </View>
            </View>

            <View style={styles.historyBtnWrapper}>
              <Pressable 
                onPress={() => router.push('/prayer-history' as any)} 
                style={({ pressed }) => [
                  styles.historyBtn,
                  pressed && { backgroundColor: 'rgba(255,255,255,0.1)' }
                ]}
              >
                <AppIcon name="history" size={16} color="#FFFFFF" />
                <Text style={styles.historyBtnText}>Prayer History</Text>
                <AppIcon name="chevron-right" size={16} color="rgba(255,255,255,0.7)" />
              </Pressable>
            </View>
          </View>

          <View style={[styles.cardsContainer, isUpdating && styles.updatingContainer]}>
            {prayers.map((prayer, index) => (
              <PrayerCard
                key={prayer.name}
                name={prayer.name}
                time={prayer.time}
                icon={prayer.icon}
                status={prayer.status}
                index={index}
                onActionPress={handleActionPress}
              />
            ))}
          </View>
        </>
      )}
    </ScreenContainer>
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
  historyBtnWrapper: {
    width: '100%',
    alignItems: 'center',
    marginTop: 16,
  },
  historyBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 24,
    backgroundColor: 'rgba(0,0,0,0.3)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.15)',
    gap: 6,
  },
  historyBtnText: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 13,
  },
  dashboardCard: {
    marginHorizontal: 16,
    marginBottom: 24,
    backgroundColor: 'rgba(0,0,0,0.35)',
    borderRadius: 24,
    padding: 20,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.15)',
  },
  progressRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  ringContainer: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
  progressInfoCol: {
    flex: 1,
    marginLeft: 20,
    justifyContent: 'center',
  },
  progressTitleText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 2,
  },
  progressCountText: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.8)',
    marginBottom: 8,
  },
  motivationPill: {
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
  },
  motivationText: {
    fontSize: 11,
    color: '#FFFFFF',
    fontWeight: '500',
    lineHeight: 16,
  },
  cardDivider: {
    height: 1,
    backgroundColor: 'rgba(255,255,255,0.15)',
    marginBottom: 16,
  },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  statBox: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  statIconBox: {
    width: 36,
    height: 36,
    borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.15)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  statTextCol: {
    flex: 1,
  },
  statLabel: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.8)',
    marginBottom: 2,
  },
  statValue: {
    fontSize: 15,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  cardsContainer: {
    paddingBottom: 100,
  },
  updatingContainer: {
    opacity: 0.7,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 100,
  },
});
