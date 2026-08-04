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
    VERIFY_EMAIL: '/auth/verify-email',
    LOGOUT: '/auth/logout',
    REFRESH_TOKEN: '/auth/refresh',
    FORGOT_PASSWORD: '/auth/forgot-password',
    RESET_PASSWORD: '/auth/reset-password',
  },

  // User
  USER: {
    PROFILE: '/users/profile',
    UPDATE_PROFILE: '/users/profile',
    UPDATE_THEME: '/users/theme',
    CHANGE_PASSWORD: '/users/change-password',
    UPLOAD_AVATAR: '/users/avatar',
  },

  // Prayer
  PRAYER: {
    BASE: '/prayers',
    TODAY: '/prayers/today',
    HISTORY: '/prayers/history',
    STREAK: '/prayers/streak',
    ANALYTICS: '/prayers/analytics',
  },

  // Prayer Timings (Phase 11.1)
  PRAYER_TIMES: {
    TODAY: '/prayer-times/today',
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

import { Platform } from 'react-native';

export const API_BASE_URL = Platform.OS === 'web' 
  ? 'http://localhost:3000' 
  : 'http://192.168.18.141:3000';
  
export const API_TIMEOUT = 10000;
