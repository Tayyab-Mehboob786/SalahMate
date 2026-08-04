import { useMemo } from 'react';
import { useTheme } from 'react-native-paper';
import {
  calculatePercentage,
  getMotivationMessage,
  getProgressColor,
} from '@/utils/prayerProgress';
import type { SalahMateTheme } from '@/theme';

export interface PrayerProgressInput {
  status: string;
}

export function usePrayerProgress(prayers: PrayerProgressInput[]) {
  const theme = useTheme<SalahMateTheme>();

  return useMemo(() => {
    const totalCount = prayers.length || 5;
    const completedCount = prayers.filter(
      (p) => p.status === 'Completed' || p.status === 'Qada'
    ).length;

    const percentage = calculatePercentage(completedCount, totalCount);
    const motivationMessage = getMotivationMessage(percentage);
    const progressColor = getProgressColor(percentage, theme);

    return {
      completedCount,
      totalCount,
      percentage,
      motivationMessage,
      progressColor,
    };
  }, [prayers, theme]);
}
