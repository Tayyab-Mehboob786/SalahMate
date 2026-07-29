/**
 * SalahMate — Analytics & Reporting TypeScript Definitions (`src/types/analytics.types.ts`)
 *
 * Core interfaces defining prayer completion percentages, weekly summaries, and motivation metrics.
 */

import type { PrayerName } from './prayer.types';

export interface DailyCompletionRate {
  date: string;
  completedCount: number;
  totalObligatory: number;
  percentage: number;
}

export interface WeeklySummaryReport {
  startDate: string;
  endDate: string;
  averageCompletionRate: number;
  dailyRates: DailyCompletionRate[];
  breakdownByPrayer: Record<PrayerName, { completed: number; total: number }>;
}

export interface DashboardAnalytics {
  todayCompletion: number;
  currentStreakDays: number;
  weeklyAverage: number;
  topPerformedPrayer: PrayerName;
}
