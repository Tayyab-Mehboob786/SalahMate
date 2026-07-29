/**
 * SalahMate — Application Constants
 *
 * Immutable values used throughout the app.
 * Never import environment variables here — use env.ts instead.
 */

export const APP_NAME = 'SalahMate';
export const APP_VERSION = '1.0.0';

/**
 * The five daily obligatory prayers in chronological order.
 */
export const PRAYERS = ['Fajr', 'Dhuhr', 'Asr', 'Maghrib', 'Isha'] as const;

export type PrayerName = (typeof PRAYERS)[number];

/**
 * Prayer status options for tracking.
 */
export const PRAYER_STATUS = {
  PENDING: 'pending',
  PRAYED: 'prayed',
  MISSED: 'missed',
  LATE: 'late',
} as const;

export type PrayerStatus = (typeof PRAYER_STATUS)[keyof typeof PRAYER_STATUS];

/**
 * Pagination defaults for list views.
 */
export const PAGINATION = {
  DEFAULT_PAGE_SIZE: 20,
  MAX_PAGE_SIZE: 50,
} as const;

/**
 * Async storage keys — centralised to prevent key collisions.
 */
export const STORAGE_KEYS = {
  AUTH_TOKEN: 'auth_token',
  REFRESH_TOKEN: 'refresh_token',
  USER_PREFERENCES: 'user_preferences',
  ONBOARDING_COMPLETE: 'onboarding_complete',
  THEME_MODE: 'theme_mode',
  NOTIFICATION_SETTINGS: 'notification_settings',
} as const;

/**
 * Cache durations (in milliseconds) for React Query.
 */
export const CACHE_TIME = {
  /** 5 minutes — prayer times, dashboard data */
  SHORT: 5 * 60 * 1000,
  /** 30 minutes — analytics, profile data */
  MEDIUM: 30 * 60 * 1000,
  /** 24 hours — static data, settings */
  LONG: 24 * 60 * 60 * 1000,
} as const;
