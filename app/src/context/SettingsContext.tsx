import React, { createContext, useContext, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface AppSettings {
  prayerMethod: number; // 1 for MWL, 2 for ISNA, etc.
  juristicMethod: number; // 0 for Standard, 1 for Hanafi
  timeFormat: '12h' | '24h';
  hijriAdjustment: number;
}

export interface SettingsContextType {
  settings: AppSettings;
  updateSetting: <K extends keyof AppSettings>(key: K, value: AppSettings[K]) => Promise<void>;
  isLoading: boolean;
}

const defaultSettings: AppSettings = {
  prayerMethod: 1, // MWL
  juristicMethod: 0, // Standard
  timeFormat: '12h',
  hijriAdjustment: 0,
};

export const SettingsContext = createContext<SettingsContextType>({
  settings: defaultSettings,
  updateSetting: async () => {},
  isLoading: true,
});

export const SettingsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [settings, setSettings] = useState<AppSettings>(defaultSettings);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const stored = await AsyncStorage.getItem('@salahmate_settings');
      if (stored) {
        setSettings({ ...defaultSettings, ...JSON.parse(stored) });
      }
    } catch (e) {
      console.error('Failed to load settings:', e);
    } finally {
      setIsLoading(false);
    }
  };

  const updateSetting = async <K extends keyof AppSettings>(key: K, value: AppSettings[K]) => {
    try {
      const newSettings = { ...settings, [key]: value };
      setSettings(newSettings);
      await AsyncStorage.setItem('@salahmate_settings', JSON.stringify(newSettings));
    } catch (e) {
      console.error('Failed to save settings:', e);
    }
  };

  return (
    <SettingsContext.Provider value={{ settings, updateSetting, isLoading }}>
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = () => useContext(SettingsContext);
