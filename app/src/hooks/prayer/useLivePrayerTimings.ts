import { useState, useEffect, useCallback, useMemo } from 'react';
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
    
    const mapped: UIPrayerTiming[] = prayers.map((p) => {
      const log = logs.find(l => l.prayer === p.name.toUpperCase());
      return {
        ...p,
        status: log ? log.status : 'PENDING',
        isCurrent: false, // will set below
      };
    });

    if (mapped.length > 0) {
      const currentMs = now.getTime();
      
      // Find the next prayer
      for (let i = 0; i < mapped.length; i++) {
        const pDate = parseTime(mapped[i].time).getTime();
        if (pDate > currentMs) {
          next = mapped[i];
          current = i > 0 ? mapped[i - 1] : null; // If Fajr is next, current is null (or Isha from yesterday, but we'll say null for now)
          break;
        }
      }
      
      // If all passed today, next is Fajr tomorrow, current is Isha
      if (!next) {
        current = mapped[mapped.length - 1]; // Isha
        next = mapped[0]; // Fajr
      }
      
      // If Fajr is next, current might be Isha from yesterday (represented as Isha)
      if (next.name === 'Fajr' && !current) {
        current = mapped[mapped.length - 1]; // Isha
      }

      if (current) {
        const currIndex = mapped.findIndex(p => p.name === current!.name);
        if (currIndex !== -1) {
          mapped[currIndex].isCurrent = true;
        }
      }
    }
    
    return { currentPrayer: current, nextPrayer: next, uiPrayers: mapped };
  }, [prayers, logs, now]);

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
