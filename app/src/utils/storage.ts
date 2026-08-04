import * as SecureStore from 'expo-secure-store';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';

const ACCESS_TOKEN_KEY = 'salahmate_access_token';
const REFRESH_TOKEN_KEY = 'salahmate_refresh_token';

export const storage = {
  saveAccessToken: async (token: string): Promise<void> => {
    if (Platform.OS === 'web') {
      await AsyncStorage.setItem(ACCESS_TOKEN_KEY, token);
    } else {
      await SecureStore.setItemAsync(ACCESS_TOKEN_KEY, token);
    }
  },

  saveRefreshToken: async (token: string): Promise<void> => {
    if (Platform.OS === 'web') {
      await AsyncStorage.setItem(REFRESH_TOKEN_KEY, token);
    } else {
      await SecureStore.setItemAsync(REFRESH_TOKEN_KEY, token);
    }
  },

  getAccessToken: async (): Promise<string | null> => {
    if (Platform.OS === 'web') {
      return await AsyncStorage.getItem(ACCESS_TOKEN_KEY);
    }
    return await SecureStore.getItemAsync(ACCESS_TOKEN_KEY);
  },

  getRefreshToken: async (): Promise<string | null> => {
    if (Platform.OS === 'web') {
      return await AsyncStorage.getItem(REFRESH_TOKEN_KEY);
    }
    return await SecureStore.getItemAsync(REFRESH_TOKEN_KEY);
  },

  clearTokens: async (): Promise<void> => {
    if (Platform.OS === 'web') {
      await AsyncStorage.removeItem(ACCESS_TOKEN_KEY);
      await AsyncStorage.removeItem(REFRESH_TOKEN_KEY);
    } else {
      await SecureStore.deleteItemAsync(ACCESS_TOKEN_KEY);
      await SecureStore.deleteItemAsync(REFRESH_TOKEN_KEY);
    }
  },
};
