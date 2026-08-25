import apiClient from './axios';
import { API_ENDPOINTS } from '../constants/api';

export type GoalCategory = 'QURAN' | 'PRAYER' | 'ADHKAR' | 'LEARNING' | 'CUSTOM';
export type PrayerTarget = 'FAJR' | 'DHUHR' | 'ASR' | 'MAGHRIB' | 'ISHA';
export type GoalLifecycleStatus = 'ACTIVE' | 'COMPLETED' | 'EXPIRED';

export interface GoalProgress {
  completedUnits: number;
  totalUnits: number;
  remainingUnits: number;
  progressPercentage: number;
  isCompleted: boolean;
}

export interface GoalReminderConfig {
  type: 'daily' | 'weekly' | 'custom';
  time: string; // HH:mm format
}

export interface Goal {
  id: string;
  userId: string;
  title: string;
  category: GoalCategory;
  prayerTarget?: PrayerTarget | null;
  startDate: string;
  targetDate: string;
  totalUnits: number;
  unitLabel: string;
  completedUnits: number;
  reminderConfig?: GoalReminderConfig | null;
  isCompleted: boolean;
  lifecycleStatus: GoalLifecycleStatus;
  createdAt: string;
  updatedAt: string;
  progress: GoalProgress;
}

export interface CreateGoalPayload {
  title: string;
  category: GoalCategory;
  prayerTarget?: PrayerTarget | null;
  startDate: string;
  targetDate: string;
  totalUnits: number;
  unitLabel: string;
  reminderConfig?: GoalReminderConfig | null;
}

export interface UpdateGoalPayload {
  title?: string;
  category?: GoalCategory;
  prayerTarget?: PrayerTarget | null;
  targetDate?: string;
  totalUnits?: number;
  unitLabel?: string;
  reminderConfig?: GoalReminderConfig | null;
}

export const goalsApi = {
  getGoals: async (): Promise<Goal[]> => {
    const response = await apiClient.get<Goal[]>(API_ENDPOINTS.GOALS.BASE);
    return response.data;
  },

  getActiveGoal: async (): Promise<Goal | null> => {
    const response = await apiClient.get<Goal | null>(API_ENDPOINTS.GOALS.ACTIVE);
    return response.data;
  },

  getGoalById: async (id: string): Promise<Goal> => {
    const response = await apiClient.get<Goal>(`${API_ENDPOINTS.GOALS.BASE}/${id}`);
    return response.data;
  },

  createGoal: async (payload: CreateGoalPayload): Promise<Goal> => {
    const response = await apiClient.post<Goal>(API_ENDPOINTS.GOALS.BASE, payload);
    return response.data;
  },

  updateGoal: async (id: string, payload: UpdateGoalPayload): Promise<Goal> => {
    const response = await apiClient.patch<Goal>(`${API_ENDPOINTS.GOALS.BASE}/${id}`, payload);
    return response.data;
  },

  logProgress: async (id: string, increment: number): Promise<Goal> => {
    const response = await apiClient.post<Goal>(`${API_ENDPOINTS.GOALS.BASE}/${id}/progress`, { increment });
    return response.data;
  },

  deleteGoal: async (id: string): Promise<{ message: string }> => {
    const response = await apiClient.delete<{ message: string }>(`${API_ENDPOINTS.GOALS.BASE}/${id}`);
    return response.data;
  },
};
