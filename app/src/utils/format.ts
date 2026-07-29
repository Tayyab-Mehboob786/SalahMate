/**
 * SalahMate — String/Number Formatting Utilities
 *
 * Pure formatting helpers.
 */

/**
 * Capitalize the first letter of a string.
 */
export function capitalize(str: string): string {
  if (!str) {
    return '';
  }
  return str.charAt(0).toUpperCase() + str.slice(1);
}

/**
 * Truncate a string to a max length, appending "…" if truncated.
 */
export function truncate(str: string, maxLength: number): string {
  if (str.length <= maxLength) {
    return str;
  }
  return `${str.slice(0, maxLength - 1)}…`;
}

/**
 * Format a number as a percentage string (e.g., 0.85 → "85%").
 */
export function toPercent(value: number, decimals = 0): string {
  return `${(value * 100).toFixed(decimals)}%`;
}

/**
 * Format a streak count with appropriate suffix.
 * e.g., 1 → "1 day", 5 → "5 days"
 */
export function formatStreak(days: number): string {
  return `${days} ${days === 1 ? 'day' : 'days'}`;
}

/**
 * Get initials from a full name (e.g., "Muhammad Ali" → "MA").
 */
export function getInitials(name: string): string {
  return name
    .split(' ')
    .filter(Boolean)
    .map((part) => part[0]?.toUpperCase() ?? '')
    .slice(0, 2)
    .join('');
}
