/**
 * SalahMate — Frontend API HTTP Client (`src/services/api/client.ts`)
 *
 * Configures the centralized Axios HTTP instance (`apiClient`) with:
 * - Environment-driven Base URL and Timeout
 * - Request Interceptor: Injects `Authorization: Bearer <token>` from `tokenManager`
 * - Response Interceptor: Handles payload extraction and `401 Unauthorized` token refresh
 * - Error Handler: Standardizes all rejections into `ApiError` instances
 */

import { create } from 'axios';
import type { AxiosError, InternalAxiosRequestConfig } from 'axios';
import { env } from '@/constants/env';
import { tokenManager } from '@/services/auth/tokenManager';
import { parseApiError } from './errorHandler';

// Extended configuration interface to prevent infinite refresh loops on 401 retries
interface CustomAxiosRequestConfig extends InternalAxiosRequestConfig {
  _retry?: boolean;
}

export const apiClient = create({
  baseURL: env.API_BASE_URL,
  timeout: 15000, // 15 seconds request timeout
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

// ==========================================
// REQUEST INTERCEPTOR
// ==========================================
apiClient.interceptors.request.use(
  async (config: CustomAxiosRequestConfig) => {
    const token = await tokenManager.getAccessToken();
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    if (env.APP_ENV === 'development') {
      // Dev mode diagnostics (safe logging without sensitive token display)

      console.warn(
        `[API Request] ${config.method?.toUpperCase()} ${config.baseURL ?? ''}${config.url ?? ''}`,
      );
    }

    return config;
  },
  (error) => {
    return Promise.reject(parseApiError(error));
  },
);

// ==========================================
// REFRESH TOKEN PLACEHOLDER LOGIC
// ==========================================
let isRefreshing = false;
let failedQueue: {
  resolve: (token: string) => void;
  reject: (error: unknown) => void;
}[] = [];

const processQueue = (error: unknown, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else if (token) {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

/**
 * Placeholder async function representing backend token exchange (`/auth/refresh`).
 * Currently returns a mock refreshed token string or throws when expired.
 */
async function refreshTokenAsync(): Promise<string> {
  const currentRefresh = await tokenManager.getRefreshToken();
  if (!currentRefresh) {
    throw new Error('No refresh token available');
  }

  // Placeholder behavior: Simulate token refresh handshake without making actual backend call
  // In Phase 2 backend integration, replace this with:
  // const response = await create().post(`${env.API_BASE_URL}/auth/refresh`, { refreshToken: currentRefresh });
  // const newAccess = response.data.accessToken;
  const placeholderNewAccessToken = `mock_refreshed_access_${Date.now()}`;
  await tokenManager.setAccessToken(placeholderNewAccessToken);

  return placeholderNewAccessToken;
}

// ==========================================
// RESPONSE INTERCEPTOR
// ==========================================
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error: AxiosError) => {
    const originalRequest = error.config as CustomAxiosRequestConfig | undefined;

    // Check for 401 Unauthorized and ensure we haven't already retried this request
    if (error.response?.status === 401 && originalRequest && !originalRequest._retry) {
      if (isRefreshing) {
        // If refresh is already in progress, queue this request until completed
        return new Promise<string>((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            if (originalRequest.headers) {
              originalRequest.headers.Authorization = `Bearer ${token}`;
            }
            return apiClient(originalRequest);
          })
          .catch((err) => {
            return Promise.reject(parseApiError(err));
          });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const newToken = await refreshTokenAsync();
        processQueue(null, newToken);
        if (originalRequest.headers) {
          originalRequest.headers.Authorization = `Bearer ${newToken}`;
        }
        return await apiClient(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError, null);
        await tokenManager.clearTokens();
        return Promise.reject(parseApiError(refreshError));
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(parseApiError(error));
  },
);
