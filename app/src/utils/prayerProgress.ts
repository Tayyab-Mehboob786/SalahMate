import type { SalahMateTheme } from '@/theme';

/**
 * Calculates the percentage of completed prayers.
 */
export const calculatePercentage = (completed: number, total: number): number => {
  if (total <= 0) return 0;
  return Math.round((completed / total) * 100);
};

/**
 * Returns a dynamic motivation message based on the completion percentage.
 */
export const getMotivationMessage = (percentage: number): string => {
  if (percentage === 100) return '🕌 Alhamdulillah! You completed all five prayers today.';
  if (percentage >= 80) return '⭐ Excellent consistency today!';
  if (percentage >= 60) return '💚 More than halfway there!';
  if (percentage >= 40) return '🌤 You\'re making progress.';
  if (percentage >= 20) return '🤲 Great start! Keep going.';
  return '🌱 A beautiful day to begin your prayers.';
};

/**
 * Returns a dynamic progress color based on completion percentage.
 */
export const getProgressColor = (percentage: number, theme: SalahMateTheme): string => {
  if (percentage === 100) return theme.colors.success || '#4CAF50';
  if (percentage >= 60) return theme.colors.primary;
  if (percentage >= 40) return theme.colors.secondary;
  if (percentage >= 20) return theme.colors.tertiary || '#FF9800';
  return theme.colors.onSurfaceVariant;
};
