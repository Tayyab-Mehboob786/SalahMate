import { PrayerTimes } from '../types/prayer-times.type';

export interface PrayerTimesProvider {
  /**
   * Retrieves today's prayer times for the given coordinates and calculation method.
   *
   * @param lat Latitude
   * @param lng Longitude
   * @param method Calculation Method ID (e.g., 1 for Karachi)
   */
  getTodayPrayerTimes(lat: number, lng: number, method?: number): Promise<PrayerTimes>;
}

export const PRAYER_TIMES_PROVIDER = Symbol('PRAYER_TIMES_PROVIDER');
