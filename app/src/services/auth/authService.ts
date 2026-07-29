/**
 * SalahMate — Authentication Service (`src/services/auth/authService.ts`)
 *
 * Typed frontend service contract for user authentication and session operations.
 * Currently returns resolved placeholder responses without making actual backend calls
 * or embedding business logic, structured for seamless Phase 2 backend integration.
 */

import { API_ENDPOINTS } from '@/constants/api';
import type { UserProfile } from '@/types/auth.types';
import { apiClient } from '../api/client';
import { tokenManager } from './tokenManager';

export interface LoginPayload {
  email: string;
  password?: string;
}

export interface RegisterPayload {
  fullName: string;
  email: string;
  password?: string;
}

export interface AuthResponse {
  user: UserProfile;
  accessToken: string;
  refreshToken: string;
}

export const authService = {
  /**
   * Placeholder for user login endpoint (`POST /auth/login`).
   */
  async login(payload: LoginPayload): Promise<AuthResponse> {
    void API_ENDPOINTS.AUTH.LOGIN;
    void apiClient;
    const mockResponse: AuthResponse = {
      user: {
        id: 'usr_mock_123',
        name: payload.email.split('@')[0] ?? 'SalahMate User',
        email: payload.email,
        preferences: {
          calculationMethod: 'MWL',
          juristicMethod: 'Standard',
          highLatitudeRule: 'MiddleOfTheNight',
          notifications: true,
        },
      },
      accessToken: 'mock_jwt_access_token',
      refreshToken: 'mock_jwt_refresh_token',
    };

    await tokenManager.setTokens(mockResponse.accessToken, mockResponse.refreshToken);
    return mockResponse;
  },

  /**
   * Placeholder for user registration endpoint (`POST /auth/register`).
   */
  async register(payload: RegisterPayload): Promise<AuthResponse> {
    void API_ENDPOINTS.AUTH.REGISTER;
    const mockResponse: AuthResponse = {
      user: {
        id: 'usr_mock_new_456',
        name: payload.fullName,
        email: payload.email,
        preferences: {
          calculationMethod: 'MWL',
          juristicMethod: 'Standard',
          highLatitudeRule: 'MiddleOfTheNight',
          notifications: true,
        },
      },
      accessToken: 'mock_jwt_access_token_new',
      refreshToken: 'mock_jwt_refresh_token_new',
    };

    await tokenManager.setTokens(mockResponse.accessToken, mockResponse.refreshToken);
    return mockResponse;
  },

  /**
   * Placeholder for user logout (`POST /auth/logout`) and local token cleanup.
   */
  async logout(): Promise<void> {
    void API_ENDPOINTS.AUTH.LOGOUT;
    await tokenManager.clearTokens();
  },

  /**
   * Placeholder for fetching the authenticated user's profile (`GET /user/profile`).
   */
  async getProfile(): Promise<UserProfile> {
    void API_ENDPOINTS.USER.PROFILE;
    return {
      id: 'usr_mock_123',
      name: 'SalahMate User',
      email: 'user@salahmate.app',
      preferences: {
        calculationMethod: 'MWL',
        juristicMethod: 'Standard',
        highLatitudeRule: 'MiddleOfTheNight',
        notifications: true,
      },
    };
  },

  /**
   * Placeholder for initiating password reset (`POST /auth/forgot-password`).
   */
  async forgotPassword(email: string): Promise<{ success: boolean }> {
    void API_ENDPOINTS.AUTH.FORGOT_PASSWORD;
    return { success: Boolean(email) };
  },
};
