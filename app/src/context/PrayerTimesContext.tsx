import React, { createContext, useContext, useEffect, useState, useCallback, useMemo } from 'react';
import { useLocation } from './LocationContext';
import { useSettings } from './SettingsContext';
import { useAuth } from '@/hooks/auth/useAuth';
import { prayerTimesApi, PrayerTimesData } from '@/api/prayer-times.api';

export interface PrayerTimesContextType {
  data: PrayerTimesData | null;
  isLoading: boolean;
  isError: boolean;
  refetch: () => Promise<void>;
  getNextPrayer: () => { name: string; time: string } | null;
}

export const PrayerTimesContext = createContext<PrayerTimesContextType>({
  data: null,
  isLoading: true,
  isError: false,
  refetch: async () => {},
  getNextPrayer: () => null,
});

export const PrayerTimesProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { location } = useLocation();
  const { settings } = useSettings();
  const { isAuthenticated } = useAuth();
  const [data, setData] = useState<PrayerTimesData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isError, setIsError] = useState<boolean>(false);

  const lat = location?.latitude;
  const lng = location?.longitude;
  const method = settings.prayerMethod;

  const fetchTimings = useCallback(async () => {
    if (!lat || !lng || !isAuthenticated) {
      if (!isAuthenticated) {
        setIsLoading(false);
      }
      return;
    }

    try {
      setIsLoading(true);
      setIsError(false);
      
      console.log(`[PrayerTimes] Backend request URL: GET /prayer-times/today?lat=${lat}&lng=${lng}&method=${method}`);
      const timings = await prayerTimesApi.getTodayTimings(lat, lng, method);
      
      // Fallback: If backend returns '20-02-1448', convert it to month name
      if (timings.hijriDate && timings.hijriDate.includes('-')) {
        const parts = timings.hijriDate.split('-');
        if (parts.length === 3) {
          const hijriMonths = [
            "Muharram", "Safar", "Rabi Al-Awwal", "Rabi Al-Thani",
            "Jumada Al-Ula", "Jumada Al-Akhirah", "Rajab", "Sha'aban",
            "Ramadan", "Shawwal", "Dhu Al-Qadah", "Dhu Al-Hijjah"
          ];
          const monthIndex = parseInt(parts[1], 10) - 1;
          if (monthIndex >= 0 && monthIndex < 12) {
            timings.hijriDate = `${parseInt(parts[0], 10)} ${hijriMonths[monthIndex]} ${parts[2]} AH`;
          }
        }
      }

      setData(timings);
    } catch (error) {
      console.error('Failed to fetch prayer timings:', error);
      setIsError(true);
      setData(null);
    } finally {
      setIsLoading(false);
    }
  }, [lat, lng, method, isAuthenticated]);

  useEffect(() => {
    fetchTimings();
  }, [fetchTimings]);

  const getNextPrayer = useCallback(() => {
    if (!data) return null;

    const now = new Date();
    const currentMinutes = now.getHours() * 60 + now.getMinutes();

    const parseTime = (timeStr: string) => {
      // timeStr is usually like "05:12" or "15:45"
      const [hours, minutes] = timeStr.split(':').map(Number);
      return hours * 60 + minutes;
    };

    const prayerSchedule = [
      { name: 'Fajr', timeStr: data.timings.fajr, minutes: parseTime(data.timings.fajr) },
      { name: 'Dhuhr', timeStr: data.timings.dhuhr, minutes: parseTime(data.timings.dhuhr) },
      { name: 'Asr', timeStr: data.timings.asr, minutes: parseTime(data.timings.asr) },
      { name: 'Maghrib', timeStr: data.timings.maghrib, minutes: parseTime(data.timings.maghrib) },
      { name: 'Isha', timeStr: data.timings.isha, minutes: parseTime(data.timings.isha) },
    ];

    for (const prayer of prayerSchedule) {
      if (currentMinutes < prayer.minutes) {
        return { name: prayer.name, time: prayer.timeStr };
      }
    }

    // If all prayers have passed (after Isha), next is Fajr tomorrow
    return { name: 'Fajr', time: data.timings.fajr };
  }, [data]);

  const value = useMemo(() => ({
    data,
    isLoading,
    isError,
    refetch: fetchTimings,
    getNextPrayer
  }), [data, isLoading, isError, fetchTimings, getNextPrayer]);

  return (
    <PrayerTimesContext.Provider value={value}>
      {children}
    </PrayerTimesContext.Provider>
  );
};

export function useSharedPrayerTimes() {
  return useContext(PrayerTimesContext);
}
