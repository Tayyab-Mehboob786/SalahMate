import { useState, useEffect, useCallback, useMemo } from 'react';
import { useFocusEffect } from 'expo-router';
import { useSharedPrayerTimes } from '@/context';
import { prayersApi, PrayerLog, PrayerStatus } from '@/api/prayers.api';
import type { PrayerName } from '@/types/prayer.types';

export interface UIPrayerTiming {
  name: PrayerName;
  time: string;
  icon: string;
  status: PrayerStatus | 'PENDING';
  isCurrent: boolean;
}

export interface LivePrayerData {
  prayers: UIPrayerTiming[];
  currentPrayer: UIPrayerTiming | null;
  nextPrayer: UIPrayerTiming | null;
  countdown: string;
  sunriseTime: string;
  isLoadingLogs: boolean;
  refetchLogs: () => Promise<void>;
}

const PRAYER_ORDER: PrayerName[] = ['Fajr', 'Dhuhr', 'Asr', 'Maghrib', 'Isha'];

const parseTime = (timeStr: string) => {
  const [hours, minutes] = timeStr.split(':').map(Number);
  const date = new Date();
  date.setHours(hours, minutes, 0, 0);
  return date;
};

const formatCountdown = (diffMs: number) => {
  if (diffMs < 0) return '00:00:00';
  const hours = Math.floor(diffMs / (1000 * 60 * 60));
  const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((diffMs % (1000 * 60)) / 1000);
  
  const pad = (num: number) => num.toString().padStart(2, '0');
  
  if (hours > 0) return `${pad(hours)}h ${pad(minutes)}m ${pad(seconds)}s`;
  return `${pad(minutes)}m ${pad(seconds)}s`;
};

export function useLivePrayerTimings(): LivePrayerData {
  const { data: prayerTimesData } = useSharedPrayerTimes();
  
  const [logs, setLogs] = useState<PrayerLog[]>([]);
  const [isLoadingLogs, setIsLoadingLogs] = useState(true);
  const [now, setNow] = useState(new Date());

  // Update time every second for countdown
  useEffect(() => {
    const interval = setInterval(() => {
      setNow(new Date());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const fetchLogs = useCallback(async () => {
    try {
      setIsLoadingLogs(true);
      const todayLogs = await prayersApi.getToday();
      setLogs(todayLogs);
    } catch (error) {
      console.error('Failed to fetch today\'s prayer logs in timings:', error);
    } finally {
      setIsLoadingLogs(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      fetchLogs();
    }, [fetchLogs])
  );

  useEffect(() => {
    fetchLogs();
  }, [fetchLogs]);

  const prayers = useMemo(() => {
    if (!prayerTimesData) return [];
    
    return [
      { name: 'Fajr' as PrayerName, time: prayerTimesData.timings.fajr, icon: 'weather-sunset-up' },
      { name: 'Dhuhr' as PrayerName, time: prayerTimesData.timings.dhuhr, icon: 'weather-sunny' },
      { name: 'Asr' as PrayerName, time: prayerTimesData.timings.asr, icon: 'weather-partly-cloudy' },
      { name: 'Maghrib' as PrayerName, time: prayerTimesData.timings.maghrib, icon: 'weather-sunset-down' },
      { name: 'Isha' as PrayerName, time: prayerTimesData.timings.isha, icon: 'weather-night' },
    ];
  }, [prayerTimesData]);

  // Determine current/next based on real time
  const { currentPrayer, nextPrayer, uiPrayers } = useMemo(() => {
    let current: UIPrayerTiming | null = null;
    let next: UIPrayerTiming | null = null;
    const currentMs = now.getTime();
    const sunriseTimeStr = prayerTimesData?.timings.sunrise || '';
    const sunriseMs = sunriseTimeStr ? parseTime(sunriseTimeStr).getTime() : 0;

    if (prayers.length > 0) {
      // Find the next prayer
      for (let i = 0; i < prayers.length; i++) {
        const pDate = parseTime(prayers[i].time).getTime();
        if (pDate > currentMs) {
          next = { ...prayers[i], status: 'PENDING', isCurrent: false };
          current = i > 0 ? { ...prayers[i - 1], status: 'PENDING', isCurrent: true } : null;
          break;
        }
      }
      
      // If all passed today, next is Fajr tomorrow, current is Isha
      if (!next) {
        current = { ...prayers[prayers.length - 1], status: 'PENDING', isCurrent: true }; // Isha
        next = { ...prayers[0], status: 'PENDING', isCurrent: false }; // Fajr
      }
      
      if (next.name === 'Fajr' && !current) {
        current = { ...prayers[prayers.length - 1], status: 'PENDING', isCurrent: true }; // Isha
      }

      // Fajr expires at Sunrise time (not Dhuhr). If sunrise has passed, Fajr is no longer active.
      if (current?.name === 'Fajr' && sunriseMs > 0 && currentMs >= sunriseMs) {
        current = null;
      }
    }

    const mapped: UIPrayerTiming[] = prayers.map((p) => {
      const log = logs.find(l => l.prayer === p.name.toUpperCase());
      const isCurrent = current?.name === p.name;
      const pDate = parseTime(p.time).getTime();
      
      let hasPassed = false;
      if (p.name === 'Fajr') {
        // Fajr expires at Sunrise time (NOT Dhuhr)!
        hasPassed = sunriseMs > 0 ? currentMs >= sunriseMs : (pDate < currentMs && !isCurrent);
      } else {
        hasPassed = pDate < currentMs && !isCurrent;
      }

      let status: PrayerStatus | 'PENDING' = 'PENDING';
      if (log) {
        status = log.status;
      } else if (hasPassed) {
        status = 'MISSED';
      }

      return {
        ...p,
        status,
        isCurrent,
      };
    });

    return { currentPrayer: current, nextPrayer: next, uiPrayers: mapped };
  }, [prayers, logs, now, prayerTimesData]);

  const countdown = useMemo(() => {
    if (!nextPrayer) return '00:00:00';
    let nextTime = parseTime(nextPrayer.time);
    
    // If next prayer is Fajr and it's after Isha, it's tomorrow
    if (nextPrayer.name === 'Fajr' && now.getHours() >= 12) {
      nextTime.setDate(nextTime.getDate() + 1);
    }
    
    return formatCountdown(nextTime.getTime() - now.getTime());
  }, [nextPrayer, now]);

  return {
    prayers: uiPrayers,
    currentPrayer,
    nextPrayer,
    countdown,
    sunriseTime: prayerTimesData?.timings.sunrise || '',
    isLoadingLogs,
    refetchLogs: fetchLogs,
  };
}
