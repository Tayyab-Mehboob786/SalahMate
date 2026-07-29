import React, { createContext, useContext, useEffect, useState, useCallback, useMemo } from 'react';
import * as Location from 'expo-location';
import * as SecureStore from 'expo-secure-store';

export interface LocationData {
  city: string;
  country: string;
  latitude: number;
  longitude: number;
}

export interface LocationContextType {
  location: LocationData;
  isAuto: boolean;
  isDetecting: boolean;
  error: string | null;
  refreshLocation: () => Promise<void>;
  setManualLocation: (location: LocationData) => void;
  setAutoLocation: (isAuto: boolean) => Promise<void>;
}

const LOCATION_STORAGE_KEY = 'salahmate_location_data';
const IS_AUTO_STORAGE_KEY = 'salahmate_is_auto_location';

const DEFAULT_LOCATION: LocationData = {
  city: 'Makkah',
  country: 'Saudi Arabia',
  latitude: 21.4225,
  longitude: 39.8262,
};

// Simple storage wrapper (similar to ThemeContext)
let storage: {
  getString: (key: string) => string | undefined;
  set: (key: string, value: string) => void;
};

try {
  const mmkvModule = require('react-native-mmkv');
  const mmkvInstance = mmkvModule.createMMKV({ id: 'salahmate-location-storage' });
  storage = {
    getString: (key: string) => mmkvInstance.getString(key),
    set: (key: string, value: string) => mmkvInstance.set(key, value),
  };
} catch {
  storage = {
    getString: (key: string) => {
      try {
        const val = SecureStore.getItem(key);
        return val !== null ? val : undefined;
      } catch {
        return undefined;
      }
    },
    set: (key: string, value: string) => {
      try {
        SecureStore.setItemAsync(key, value).catch(() => {});
      } catch {}
    },
  };
}

export const LocationContext = createContext<LocationContextType>({
  location: DEFAULT_LOCATION,
  isAuto: true,
  isDetecting: false,
  error: null,
  refreshLocation: async () => {},
  setManualLocation: () => {},
  setAutoLocation: async () => {},
});

export const LocationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [location, setLocationState] = useState<LocationData>(() => {
    const savedLocation = storage.getString(LOCATION_STORAGE_KEY);
    return savedLocation ? JSON.parse(savedLocation) : DEFAULT_LOCATION;
  });
  
  const [isAuto, setIsAutoState] = useState<boolean>(() => {
    const savedIsAuto = storage.getString(IS_AUTO_STORAGE_KEY);
    return savedIsAuto !== undefined ? savedIsAuto === 'true' : true;
  });

  const [isDetecting, setIsDetecting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const saveLocationState = useCallback((newLocation: LocationData, newIsAuto: boolean) => {
    setLocationState(newLocation);
    setIsAutoState(newIsAuto);
    storage.set(LOCATION_STORAGE_KEY, JSON.stringify(newLocation));
    storage.set(IS_AUTO_STORAGE_KEY, newIsAuto ? 'true' : 'false');
  }, []);

  const detectLocation = useCallback(async () => {
    setIsDetecting(true);
    setError(null);
    try {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setError('Permission to access location was denied. Using manual location.');
        setIsAutoState(false);
        storage.set(IS_AUTO_STORAGE_KEY, 'false');
        setIsDetecting(false);
        return;
      }

      let currentPosition = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });
      
      let reverseGeocode = await Location.reverseGeocodeAsync({
        latitude: currentPosition.coords.latitude,
        longitude: currentPosition.coords.longitude,
      });

      if (reverseGeocode && reverseGeocode.length > 0) {
        const geo = reverseGeocode[0];
        const newLoc = {
          city: geo.city || geo.subregion || geo.region || 'Unknown City',
          country: geo.country || 'Unknown Country',
          latitude: currentPosition.coords.latitude,
          longitude: currentPosition.coords.longitude,
        };
        saveLocationState(newLoc, true);
      }
    } catch (err) {
      console.error('Error detecting location:', err);
      setError('Could not detect location. Please try again or use manual location.');
    } finally {
      setIsDetecting(false);
    }
  }, [saveLocationState]);

  useEffect(() => {
    // Only detect on launch if it's auto and we don't have a reliable saved location 
    // or if the user wants it to always refresh on launch. For now, we rely on the saved state 
    // unless this is the absolute first launch.
    const savedIsAuto = storage.getString(IS_AUTO_STORAGE_KEY);
    if (savedIsAuto === undefined || (savedIsAuto === 'true' && !storage.getString(LOCATION_STORAGE_KEY))) {
       detectLocation();
    }
  }, [detectLocation]);

  const refreshLocation = useCallback(async () => {
    if (isAuto) {
      await detectLocation();
    }
  }, [isAuto, detectLocation]);

  const setManualLocation = useCallback((newLocation: LocationData) => {
    saveLocationState(newLocation, false);
  }, [saveLocationState]);

  const setAutoLocation = useCallback(async (auto: boolean) => {
    if (auto) {
      await detectLocation();
    } else {
      setIsAutoState(false);
      storage.set(IS_AUTO_STORAGE_KEY, 'false');
    }
  }, [detectLocation]);

  const value = useMemo(() => ({
    location,
    isAuto,
    isDetecting,
    error,
    refreshLocation,
    setManualLocation,
    setAutoLocation,
  }), [location, isAuto, isDetecting, error, refreshLocation, setManualLocation, setAutoLocation]);

  return (
    <LocationContext.Provider value={value}>
      {children}
    </LocationContext.Provider>
  );
};

export function useLocation() {
  return useContext(LocationContext);
}
