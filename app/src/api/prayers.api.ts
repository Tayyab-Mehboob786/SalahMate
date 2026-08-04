import apiClient from './axios';
import { API_ENDPOINTS } from '../constants/api';

export type PrayerStatus = 'COMPLETED' | 'MISSED' | 'QADA';

export interface PrayerLog {
  id: string;
  userId: string;
  prayer: 'FAJR' | 'DHUHR' | 'ASR' | 'MAGHRIB' | 'ISHA';
  status: PrayerStatus;
  date: string;
  prayedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface StreakData {
  currentStreak: number;
  longestStreak: number;
  perfectDays: number;
  weeklyConsistency: number;
  streakStatus: 'ACTIVE' | 'AT_RISK' | 'INACTIVE';
}

export interface PrayerHistoryItem {
  date: string;
  completedCount: number;
  totalCount: number;
  percentage: number;
  statuses: {
    FAJR: PrayerStatus | null;
    DHUHR: PrayerStatus | null;
    ASR: PrayerStatus | null;
    MAGHRIB: PrayerStatus | null;
    ISHA: PrayerStatus | null;
  };
}

export interface PrayerHistoryResponse {
  data: PrayerHistoryItem[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface AnalyticsData {
  overallCompletion: number;
  currentStreak: number;
  longestStreak: number;
  perfectDays: number;
  weeklyCompletion: number;
  prayerPerformance: { prayer: string; percentage: number }[];
  monthlyTrend: { label: string; value: number; fullDate?: string }[];
}

export const prayersApi = {
  getToday: async (): Promise<PrayerLog[]> => {
    const response = await apiClient.get<PrayerLog[]>(API_ENDPOINTS.PRAYER.TODAY);
    return response.data;
  },

  getHistory: async (page: number = 1, limit: number = 10): Promise<PrayerHistoryResponse> => {
    const response = await apiClient.get<PrayerHistoryResponse>(API_ENDPOINTS.PRAYER.HISTORY, {
      params: { page, limit },
    });
    return response.data;
  },

  getStreak: async (): Promise<StreakData> => {
    const response = await apiClient.get<StreakData>(API_ENDPOINTS.PRAYER.STREAK);
    return response.data;
  },

  createLog: async (prayer: string, status: PrayerStatus): Promise<PrayerLog> => {
    const response = await apiClient.post<PrayerLog>(API_ENDPOINTS.PRAYER.BASE, {
      prayer,
      status,
    });
    return response.data;
  },

  updateLog: async (id: string, status: PrayerStatus): Promise<PrayerLog> => {
    const response = await apiClient.patch<PrayerLog>(`${API_ENDPOINTS.PRAYER.BASE}/${id}`, {
      status,
    });
    return response.data;
  },

  deleteLog: async (id: string): Promise<{ success: boolean }> => {
    const response = await apiClient.delete<{ success: boolean }>(`${API_ENDPOINTS.PRAYER.BASE}/${id}`);
    return response.data;
  },

  getAnalytics: async (period: string = '7d'): Promise<AnalyticsData> => {
    const response = await apiClient.get<AnalyticsData>(API_ENDPOINTS.PRAYER.ANALYTICS, {
      params: { period },
    });
    return response.data;
  },
};
