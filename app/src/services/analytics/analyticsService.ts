/**
 * SalahMate — Analytics Service (`src/services/analytics/analyticsService.ts`)
 *
 * Typed frontend service contract for querying user prayer completion rates,
 * streak history, and weekly/monthly dashboard summaries.
 * Currently returns resolved placeholder responses without making actual backend calls
 * or embedding business logic, structured for seamless Phase 2 backend integration.
 */

import { API_ENDPOINTS } from '@/constants/api';
import type {
  DailyCompletionRate,
  DashboardAnalytics,
  WeeklySummaryReport,
} from '@/types/analytics.types';
import { apiClient } from '../api/client';

export const analyticsService = {
  /**
   * Placeholder for fetching top-level dashboard analytics (`GET /analytics/dashboard`).
   */
  async getDashboardAnalytics(): Promise<DashboardAnalytics> {
    void API_ENDPOINTS.ANALYTICS.DASHBOARD;
    void apiClient;
    return {
      todayCompletion: 80, // e.g. 4 out of 5 obligatory prayers completed
      currentStreakDays: 14,
      weeklyAverage: 88.5,
      topPerformedPrayer: 'Maghrib',
    };
  },

  /**
   * Placeholder for fetching weekly summary report (`GET /analytics/weekly`).
   */
  async getWeeklySummary(startDate: string, endDate: string): Promise<WeeklySummaryReport> {
    void API_ENDPOINTS.ANALYTICS.WEEKLY;
    return {
      startDate,
      endDate,
      averageCompletionRate: 88.5,
      dailyRates: [
        { date: startDate, completedCount: 5, totalObligatory: 5, percentage: 100 },
        { date: endDate, completedCount: 4, totalObligatory: 5, percentage: 80 },
      ],
      breakdownByPrayer: {
        Fajr: { completed: 6, total: 7 },
        Dhuhr: { completed: 7, total: 7 },
        Asr: { completed: 6, total: 7 },
        Maghrib: { completed: 7, total: 7 },
        Isha: { completed: 5, total: 7 },
        Sunrise: { completed: 7, total: 7 },
      },
    };
  },

  /**
   * Placeholder for fetching daily completion rates across a date range (`GET /analytics/monthly`).
   */
  async getCompletionRates(month: string): Promise<DailyCompletionRate[]> {
    void API_ENDPOINTS.ANALYTICS.MONTHLY;
    return [
      { date: `${month}-01`, completedCount: 5, totalObligatory: 5, percentage: 100 },
      { date: `${month}-02`, completedCount: 4, totalObligatory: 5, percentage: 80 },
    ];
  },
};
