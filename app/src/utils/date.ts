/**
 * SalahMate — Date & Time Utilities
 *
 * Pure helper functions for date formatting and manipulation.
 * No external date library — uses native Intl API.
 */

/**
 * Format a Date object to a localized time string (e.g., "5:30 AM").
 */
export function formatTime(date: Date): string {
  return date.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });
}

/**
 * Format a Date object to a localized date string (e.g., "Jul 16, 2026").
 */
export function formatDate(date: Date): string {
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

/**
 * Format a Date object to a short weekday (e.g., "Mon").
 */
export function formatWeekday(date: Date): string {
  return date.toLocaleDateString('en-US', { weekday: 'short' });
}

/**
 * Get the difference between two dates in minutes.
 */
export function diffInMinutes(a: Date, b: Date): number {
  return Math.round((a.getTime() - b.getTime()) / (1000 * 60));
}

/**
 * Check if a Date is today.
 */
export function isToday(date: Date): boolean {
  const today = new Date();
  return (
    date.getFullYear() === today.getFullYear() &&
    date.getMonth() === today.getMonth() &&
    date.getDate() === today.getDate()
  );
}

/**
 * Get the start of the day (00:00:00) for a given Date.
 */
export function startOfDay(date: Date): Date {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d;
}

/**
 * Format minutes remaining into a human-readable string.
 * e.g., 90 → "1h 30m", 45 → "45m"
 */
export function formatMinutesRemaining(minutes: number): string {
  if (minutes < 0) {
    return '0m';
  }
  const hours = Math.floor(minutes / 60);
  const mins = Math.round(minutes % 60);
  if (hours > 0) {
    return `${hours}h ${mins}m`;
  }
  return `${mins}m`;
}
