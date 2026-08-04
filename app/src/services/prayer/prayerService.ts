/**
 * SalahMate — Prayer Tracking & Timing Service (`src/services/prayer/prayerService.ts`)
 *
 * Typed frontend service contract for retrieving daily prayer schedules, Qibla calculations,
 * and logging user prayer completions.
 * Currently returns resolved placeholder responses without making actual backend calls
 * or embedding business logic, structured for seamless Phase 2 backend integration.
 */

import { API_ENDPOINTS } from '@/constants/api';
import type {
  DailyPrayerSchedule,
  PrayerLogRecord,
  PrayerLogStatus,
  PrayerName,
  StreakStats,
} from '@/types/prayer.types';
import { apiClient } from '../api/client';

export interface GetPrayerTimesParams {
  date: string; // YYYY-MM-DD
  latitude?: number;
  longitude?: number;
  calculationMethod?: string;
}

export interface LogPrayerPayload {
  date: string;
  prayerName: PrayerName;
  status: PrayerLogStatus;
}

export const prayerService = {
  /**
   * Placeholder for fetching daily prayer schedule (`GET /prayer/times`).
   */
  async getPrayerTimes(params: GetPrayerTimesParams): Promise<DailyPrayerSchedule> {
    void apiClient;
    const mockSchedule: DailyPrayerSchedule = {
      date: params.date,
      hijriDate: '1447-01-20',
      times: {
        Fajr: '05:12',
        Sunrise: '06:35',
        Dhuhr: '12:45',
        Asr: '16:15',
        Maghrib: '18:55',
        Isha: '20:18',
      },
    };
    return mockSchedule;
  },

  /**
   * Placeholder for logging a prayer (`POST /prayer/log`).
   */
  async trackPrayer(payload: LogPrayerPayload): Promise<PrayerLogRecord> {
    const record: PrayerLogRecord = {
      id: `log_${Date.now()}`,
      userId: 'usr_mock_123',
      date: payload.date,
      prayerName: payload.prayerName,
      status: payload.status,
      loggedAt: new Date().toISOString(),
    };
    return record;
  },

  /**
   * Placeholder for retrieving prayer log history (`GET /prayer/history`).
   */
  async getTrackedHistory(startDate: string, _endDate: string): Promise<PrayerLogRecord[]> {
    void API_ENDPOINTS.PRAYER.HISTORY;
    return [
      {
        id: 'log_prev_1',
        userId: 'usr_mock_123',
        date: startDate,
        prayerName: 'Fajr',
        status: 'Completed',
        loggedAt: new Date().toISOString(),
      },
      {
        id: 'log_prev_2',
        userId: 'usr_mock_123',
        date: startDate,
        prayerName: 'Dhuhr',
        status: 'Completed',
        loggedAt: new Date().toISOString(),
      },
    ];
  },

};
