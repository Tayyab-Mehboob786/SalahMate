/**
 * SalahMate — API Endpoint Constants
 *
 * Centralised API endpoint paths.
 * Base URL comes from env.ts — these are just the path segments.
 */

export const API_ENDPOINTS = {
  // Auth
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    LOGOUT: '/auth/logout',
    REFRESH_TOKEN: '/auth/refresh',
    FORGOT_PASSWORD: '/auth/forgot-password',
    RESET_PASSWORD: '/auth/reset-password',
  },

  // User
  USER: {
    PROFILE: '/user/profile',
    UPDATE_PROFILE: '/user/profile',
    CHANGE_PASSWORD: '/user/change-password',
  },

  // Prayer
  PRAYER: {
    TIMES: '/prayer/times',
    LOG: '/prayer/log',
    HISTORY: '/prayer/history',
    STREAK: '/prayer/streak',
  },

  // Analytics
  ANALYTICS: {
    DASHBOARD: '/analytics/dashboard',
    WEEKLY: '/analytics/weekly',
    MONTHLY: '/analytics/monthly',
  },

  // AI Motivation
  AI: {
    MOTIVATE: '/ai/motivate',
    CHAT: '/ai/chat',
  },

  // Notifications
  NOTIFICATIONS: {
    LIST: '/notifications',
    REGISTER_TOKEN: '/notifications/register-token',
    SETTINGS: '/notifications/settings',
  },
} as const;

export const API_BASE_URL = 'http://192.168.18.141:3000';
export const API_TIMEOUT = 10000;
