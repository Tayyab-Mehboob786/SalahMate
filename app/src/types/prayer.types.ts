/**
 * SalahMate — Prayer Tracking & Timing TypeScript Definitions (`src/types/prayer.types.ts`)
 *
 * Core interfaces defining obligatory prayer names, daily timing schedules, and tracking logs.
 */

export type PrayerName = 'Fajr' | 'Dhuhr' | 'Asr' | 'Maghrib' | 'Isha' | 'Sunrise';

export type PrayerLogStatus = 'Completed' | 'Late' | 'Missed' | 'Unlogged';

export interface PrayerTimeItem {
  name: PrayerName;
  time: string; // ISO string or formatted HH:mm
  isNext?: boolean;
}

export interface DailyPrayerSchedule {
  date: string; // YYYY-MM-DD
  times: Record<PrayerName, string>;
  hijriDate?: string;
}

export interface PrayerLogRecord {
  id: string;
  userId: string;
  date: string;
  prayerName: PrayerName;
  status: PrayerLogStatus;
  loggedAt: string;
}

export interface StreakStats {
  currentStreak: number;
  longestStreak: number;
  totalPrayersLogged: number;
}
