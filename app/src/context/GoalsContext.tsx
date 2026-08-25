import React, { createContext, useContext, useState, useCallback, useMemo, useEffect } from 'react';
import { goalsApi, Goal, GoalCategory, PrayerTarget, GoalReminderConfig, GoalLifecycleStatus } from '../api/goals.api';
import { useAuth } from '@/hooks/auth/useAuth';

export type { Goal, GoalCategory, PrayerTarget, GoalReminderConfig, GoalLifecycleStatus };

export interface AddGoalInput {
  title: string;
  category: string; // 'Quran' | 'Prayer' | 'Adhkar' | 'Learning' | 'Custom' or 'QURAN' etc.
  prayerTarget?: PrayerTarget | null;
  startDate: string;
  targetDate: string;
  totalUnits: number;
  unitLabel: string;
  reminderConfig?: GoalReminderConfig | null;
}

export interface GoalsContextType {
  goals: Goal[];
  activeGoal: Goal | null;
  isLoading: boolean;
  error: string | null;
  addGoal: (goal: AddGoalInput) => Promise<Goal | null>;
  updateGoalProgress: (id: string, increment: number) => Promise<Goal | null>;
  deleteGoal: (id: string) => Promise<void>;
  getTodaysTarget: (goal: Goal) => number;
  refreshGoals: () => Promise<void>;
}

export const GoalsContext = createContext<GoalsContextType>({
  goals: [],
  activeGoal: null,
  isLoading: true,
  error: null,
  addGoal: async () => null,
  updateGoalProgress: async () => null,
  deleteGoal: async () => {},
  getTodaysTarget: () => 0,
  refreshGoals: async () => {},
});

export const GoalsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const [goals, setGoals] = useState<Goal[]>([]);
  const [activeGoal, setActiveGoal] = useState<Goal | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchGoals = useCallback(async () => {
    if (!isAuthenticated) {
      setGoals([]);
      setActiveGoal(null);
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      setError(null);
      const [fetchedGoals, active] = await Promise.all([
        goalsApi.getGoals(),
        goalsApi.getActiveGoal(),
      ]);
      setGoals(fetchedGoals);
      setActiveGoal(active);
    } catch (e: any) {
      if (e?.response?.status === 401 || e?.status === 401) {
        setGoals([]);
        setActiveGoal(null);
      } else {
        console.error('Failed to fetch goals:', e?.message || e);
        setError(e?.message || 'Failed to load goals');
      }
    } finally {
      setIsLoading(false);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    fetchGoals();
  }, [fetchGoals]);

  const addGoal = useCallback(async (input: AddGoalInput): Promise<Goal | null> => {
    try {
      const backendCategory = input.category.toUpperCase() as GoalCategory;
      const created = await goalsApi.createGoal({
        title: input.title,
        category: backendCategory,
        prayerTarget: input.prayerTarget || null,
        startDate: input.startDate,
        targetDate: input.targetDate,
        totalUnits: input.totalUnits,
        unitLabel: input.unitLabel,
        reminderConfig: input.reminderConfig || null,
      });

      // Instantly sync React state
      setGoals(prev => [created, ...prev]);
      if (!activeGoal && !created.isCompleted) {
        setActiveGoal(created);
      }
      return created;
    } catch (e: any) {
      console.error('Failed to create goal:', e?.message || e);
      return null;
    }
  }, [activeGoal]);

  const deleteGoal = useCallback(async (id: string) => {
    try {
      await goalsApi.deleteGoal(id);
      setGoals(prev => prev.filter(g => g.id !== id));
      if (activeGoal?.id === id) {
        setActiveGoal(null);
      }
    } catch (e: any) {
      console.error('Failed to delete goal:', e?.message || e);
    }
  }, [activeGoal]);

  const updateGoalProgress = useCallback(async (id: string, increment: number): Promise<Goal | null> => {
    try {
      const updated = await goalsApi.logProgress(id, increment);
      setGoals(prev => prev.map(g => g.id === id ? updated : g));
      if (activeGoal?.id === id) {
        if (updated.progress?.isCompleted || updated.isCompleted) {
          // Refetch active goal or set to next uncompleted active goal
          const newActive = await goalsApi.getActiveGoal();
          setActiveGoal(newActive);
        } else {
          setActiveGoal(updated);
        }
      }
      return updated;
    } catch (e: any) {
      console.error('Failed to log goal progress:', e?.message || e);
      return null;
    }
  }, [activeGoal]);

  const getTodaysTarget = useCallback((goal: Goal) => {
    const isCompleted = goal.progress?.isCompleted ?? goal.isCompleted;
    if (isCompleted) return 0;
    const end = new Date(goal.targetDate);
    const today = new Date();
    const daysRemaining = Math.max(1, Math.ceil((end.getTime() - today.getTime()) / (1000 * 3600 * 24)));
    const remainingUnits = goal.progress ? goal.progress.remainingUnits : (goal.totalUnits - (goal.completedUnits || 0));
    if (remainingUnits <= 0) return 0;
    return Math.ceil(remainingUnits / daysRemaining);
  }, []);

  const value = useMemo(() => ({
    goals,
    activeGoal,
    isLoading,
    error,
    addGoal,
    updateGoalProgress,
    deleteGoal,
    getTodaysTarget,
    refreshGoals: fetchGoals,
  }), [goals, activeGoal, isLoading, error, addGoal, updateGoalProgress, deleteGoal, getTodaysTarget, fetchGoals]);

  return (
    <GoalsContext.Provider value={value}>
      {children}
    </GoalsContext.Provider>
  );
};

export function useGoals() {
  return useContext(GoalsContext);
}
