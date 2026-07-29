/**
 * SalahMate — Authentication Token Manager (`src/services/auth/tokenManager.ts`)
 *
 * Manages secure storage and retrieval of OAuth / JWT session tokens (`ACCESS_TOKEN`, `REFRESH_TOKEN`).
 * Uses `expo-secure-store` on native iOS and Android devices, with an in-memory fallback
 * for Web and development testing environments.
 */

import { Platform } from 'react-native';
import * as SecureStore from 'expo-secure-store';

const ACCESS_TOKEN_KEY = 'salahmate_access_token';
const REFRESH_TOKEN_KEY = 'salahmate_refresh_token';

// In-memory cache fallback when SecureStore is unavailable (e.g. Web or unit tests)
const inMemoryTokens: { [key: string]: string | null } = {
  [ACCESS_TOKEN_KEY]: null,
  [REFRESH_TOKEN_KEY]: null,
};

async function isSecureStoreSupported(): Promise<boolean> {
  if (Platform.OS === 'web') {
    return false;
  }
  try {
    return await SecureStore.isAvailableAsync();
  } catch {
    return false;
  }
}

export const tokenManager = {
  /**
   * Retrieves the current access token from storage.
   */
  async getAccessToken(): Promise<string | null> {
    const supported = await isSecureStoreSupported();
    if (!supported) {
      return inMemoryTokens[ACCESS_TOKEN_KEY];
    }
    try {
      return await SecureStore.getItemAsync(ACCESS_TOKEN_KEY);
    } catch {
      return inMemoryTokens[ACCESS_TOKEN_KEY];
    }
  },

  /**
   * Stores the access token securely.
   */
  async setAccessToken(token: string): Promise<void> {
    inMemoryTokens[ACCESS_TOKEN_KEY] = token;
    const supported = await isSecureStoreSupported();
    if (supported) {
      try {
        await SecureStore.setItemAsync(ACCESS_TOKEN_KEY, token);
      } catch {
        // Fall back to in-memory if write fails
      }
    }
  },

  /**
   * Retrieves the current refresh token from storage.
   */
  async getRefreshToken(): Promise<string | null> {
    const supported = await isSecureStoreSupported();
    if (!supported) {
      return inMemoryTokens[REFRESH_TOKEN_KEY];
    }
    try {
      return await SecureStore.getItemAsync(REFRESH_TOKEN_KEY);
    } catch {
      return inMemoryTokens[REFRESH_TOKEN_KEY];
    }
  },

  /**
   * Stores the refresh token securely.
   */
  async setRefreshToken(token: string): Promise<void> {
    inMemoryTokens[REFRESH_TOKEN_KEY] = token;
    const supported = await isSecureStoreSupported();
    if (supported) {
      try {
        await SecureStore.setItemAsync(REFRESH_TOKEN_KEY, token);
      } catch {
        // Fall back to in-memory if write fails
      }
    }
  },

  /**
   * Atomically sets both access and refresh tokens after successful auth.
   */
  async setTokens(accessToken: string, refreshToken: string): Promise<void> {
    await Promise.all([this.setAccessToken(accessToken), this.setRefreshToken(refreshToken)]);
  },

  /**
   * Clears all authentication tokens upon logout or session expiration.
   */
  async clearTokens(): Promise<void> {
    inMemoryTokens[ACCESS_TOKEN_KEY] = null;
    inMemoryTokens[REFRESH_TOKEN_KEY] = null;
    const supported = await isSecureStoreSupported();
    if (supported) {
      try {
        await Promise.all([
          SecureStore.deleteItemAsync(ACCESS_TOKEN_KEY),
          SecureStore.deleteItemAsync(REFRESH_TOKEN_KEY),
        ]);
      } catch {
        // Ignore deletion failures if items do not exist
      }
    }
  },
};
