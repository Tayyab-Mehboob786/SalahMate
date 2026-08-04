import React, { useState, useEffect, useCallback } from 'react';
import { StyleSheet, View, Alert, ActivityIndicator } from 'react-native';
import { useTheme } from 'react-native-paper';
import { ScreenContainer } from '@/components';
import { TrackingHeader, PrayerProgressCard, PrayerCard, PrayerStatus, StreakCard } from '@/components/tracker';
import { usePrayerProgress } from '@/hooks/prayer/usePrayerProgress';
import type { PrayerName } from '@/types/prayer.types';
import { prayersApi, PrayerLog, StreakData } from '@/api/prayers.api';
import { useSharedPrayerTimes } from '@/context';
import type { SalahMateTheme } from '@/theme';

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
  const theme = useTheme<SalahMateTheme>();
  const [prayers, setPrayers] = useState<UIPrayerData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);
  const [streakData, setStreakData] = useState<StreakData | null>(null);
  const [isStreakLoading, setIsStreakLoading] = useState(true);
  
  const { data: prayerTimesData, isLoading: isPrayerTimesLoading, isError: isPrayerTimesError } = useSharedPrayerTimes();

  const loadTodayPrayers = useCallback(async () => {
    try {
      const logs = await prayersApi.getToday();
      
      const mappedPrayers: UIPrayerData[] = DEFAULT_PRAYERS.map((defaultPrayer) => {
        const backendPrayerName = defaultPrayer.name.toUpperCase();
        const existingLog = logs.find((log) => log.prayer === backendPrayerName);
        
        let uiStatus: PrayerStatus = 'Pending';
        if (existingLog) {
          if (existingLog.status === 'COMPLETED') uiStatus = 'Completed';
          else if (existingLog.status === 'MISSED') uiStatus = 'Missed';
          else if (existingLog.status === 'QADA') uiStatus = 'Qada';
        }
        
        let liveTime = '--:--';
        if (prayerTimesData && !isPrayerTimesError) {
            const key = defaultPrayer.name.toLowerCase() as keyof typeof prayerTimesData.timings;
            liveTime = prayerTimesData.timings[key] || '--:--';
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
  }, [prayerTimesData, isPrayerTimesError]);

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
    setIsUpdating(true);

    try {
      const targetPrayer = prayers.find(p => p.name === name);
      if (!targetPrayer) return;

      const backendPrayerName = name.toUpperCase();

      if (currentStatus === 'Pending') {
        await prayersApi.createLog(backendPrayerName, 'COMPLETED');
      } else if (currentStatus === 'Completed') {
        if (targetPrayer.id) {
          await prayersApi.deleteLog(targetPrayer.id);
        }
      } else if (currentStatus === 'Missed') {
        if (targetPrayer.id) {
          await prayersApi.updateLog(targetPrayer.id, 'QADA');
        }
      } else if (currentStatus === 'Qada') {
        if (targetPrayer.id) {
          await prayersApi.updateLog(targetPrayer.id, 'MISSED');
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

  const {
    completedCount,
    totalCount,
    percentage,
    motivationMessage,
    progressColor,
  } = usePrayerProgress(prayers);

  return (
    <ScreenContainer scrollable withPadding withGlassGradient>
      <TrackingHeader />
      
      {isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
        </View>
      ) : (
        <>
          <PrayerProgressCard
            completedCount={completedCount}
            totalCount={totalCount}
            percentage={percentage}
            motivationMessage={motivationMessage}
            progressColor={progressColor}
          />
          
          <StreakCard data={streakData} isLoading={isStreakLoading} />

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
  cardsContainer: {
    paddingBottom: 48,
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
