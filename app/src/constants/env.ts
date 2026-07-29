/**
 * SalahMate — Environment Configuration
 *
 * Reads environment variables from .env via expo-constants.
 * All env access is centralised here — never read process.env directly.
 *
 * Setup:
 *   1. Copy .env.example → .env
 *   2. Fill in your values
 *   3. Access via: import { env } from '@/constants/env';
 */

import Constants from 'expo-constants';

interface AppEnv {
  API_BASE_URL: string;
  APP_ENV: 'development' | 'staging' | 'production';
}

const expoExtra = Constants.expoConfig?.extra ?? {};

export const env: AppEnv = {
  API_BASE_URL: (expoExtra.API_BASE_URL as string) || 'http://localhost:3000',
  APP_ENV: (expoExtra.APP_ENV as AppEnv['APP_ENV']) || 'development',
};
