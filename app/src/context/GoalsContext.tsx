import React, { createContext, useContext, useState, useCallback, useMemo, useEffect } from 'react';
import * as SecureStore from 'expo-secure-store';

export type GoalCategory = 'Quran' | 'Prayer' | 'Adhkar' | 'Learning' | 'Custom';

export interface GoalReminder {
  type: 'daily' | 'weekly' | 'custom';
  time: string; // HH:mm format
}

export interface Goal {
  id: string;
  title: string;
  category: GoalCategory;
  startDate: string; // ISO date string
  targetDate: string; // ISO date string
  totalUnits: number; // e.g., 604 pages, 30 days
  completedUnits: number;
  unitLabel: string; // 'pages', 'days', 'surahs'
  reminderConfig: GoalReminder | null;
  isCompleted: boolean;
}

export interface GoalsContextType {
  goals: Goal[];
  addGoal: (goal: Omit<Goal, 'id' | 'completedUnits' | 'isCompleted'>) => void;
  updateGoalProgress: (id: string, newCompletedUnits: number) => void;
  deleteGoal: (id: string) => void;
  getTodaysTarget: (goal: Goal) => number;
}

const GOALS_STORAGE_KEY = 'salahmate_goals_data';

// Simple storage wrapper (similar to ThemeContext)
let storage: {
  getString: (key: string) => string | undefined;
  set: (key: string, value: string) => void;
};

try {
  const mmkvModule = require('react-native-mmkv');
  const mmkvInstance = mmkvModule.createMMKV({ id: 'salahmate-goals-storage' });
  storage = {
    getString: (key: string) => mmkvInstance.getString(key),
    set: (key: string, value: string) => mmkvInstance.set(key, value),
  };
} catch {
  storage = {
    getString: (key: string) => {
      try {
        const val = SecureStore.getItem(key);
        return val !== null ? val : undefined;
      } catch {
        return undefined;
      }
    },
    set: (key: string, value: string) => {
      try {
        SecureStore.setItemAsync(key, value).catch(() => {});
      } catch {}
    },
  };
}

export const GoalsContext = createContext<GoalsContextType>({
  goals: [],
  addGoal: () => {},
  updateGoalProgress: () => {},
  deleteGoal: () => {},
  getTodaysTarget: () => 0,
});

export const GoalsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [goals, setGoalsState] = useState<Goal[]>(() => {
    const savedGoals = storage.getString(GOALS_STORAGE_KEY);
    return savedGoals ? JSON.parse(savedGoals) : [];
  });

  const saveGoals = useCallback((newGoals: Goal[]) => {
    setGoalsState(newGoals);
    storage.set(GOALS_STORAGE_KEY, JSON.stringify(newGoals));
  }, []);

  const addGoal = useCallback((newGoalData: Omit<Goal, 'id' | 'completedUnits' | 'isCompleted'>) => {
    const newGoal: Goal = {
      ...newGoalData,
      id: Math.random().toString(36).substring(2, 11),
      completedUnits: 0,
      isCompleted: false,
    };
    saveGoals([...goals, newGoal]);
  }, [goals, saveGoals]);

  const updateGoalProgress = useCallback((id: string, newCompletedUnits: number) => {
    const updatedGoals = goals.map(g => {
      if (g.id === id) {
        const isCompleted = newCompletedUnits >= g.totalUnits;
        return { ...g, completedUnits: newCompletedUnits, isCompleted };
      }
      return g;
    });
    saveGoals(updatedGoals);
  }, [goals, saveGoals]);

  const deleteGoal = useCallback((id: string) => {
    const updatedGoals = goals.filter(g => g.id !== id);
    saveGoals(updatedGoals);
  }, [goals, saveGoals]);

  const getTodaysTarget = useCallback((goal: Goal) => {
    if (goal.isCompleted) return 0;
    const start = new Date(goal.startDate);
    const end = new Date(goal.targetDate);
    const today = new Date();
    
    // Total days for the goal
    const totalDays = Math.max(1, Math.ceil((end.getTime() - start.getTime()) / (1000 * 3600 * 24)));
    // Days remaining from today
    const daysRemaining = Math.max(1, Math.ceil((end.getTime() - today.getTime()) / (1000 * 3600 * 24)));
    
    const remainingUnits = goal.totalUnits - goal.completedUnits;
    if (remainingUnits <= 0) return 0;
    
    // Average daily target required to finish on time
    return Math.ceil(remainingUnits / daysRemaining);
  }, []);

  const value = useMemo(() => ({
    goals,
    addGoal,
    updateGoalProgress,
    deleteGoal,
    getTodaysTarget,
  }), [goals, addGoal, updateGoalProgress, deleteGoal, getTodaysTarget]);

  return (
    <GoalsContext.Provider value={value}>
      {children}
    </GoalsContext.Provider>
  );
};

export function useGoals() {
  return useContext(GoalsContext);
}
