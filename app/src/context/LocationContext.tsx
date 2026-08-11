import React, { createContext, useContext, useEffect, useState, useCallback, useMemo } from 'react';
import * as Location from 'expo-location';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface LocationData {
  city: string;
  country: string;
  latitude: number;
  longitude: number;
}

export interface LocationContextType {
  location: LocationData | null;
  isAuto: boolean;
  isDetecting: boolean;
  error: string | null;
  refreshLocation: () => Promise<void>;
  setManualLocation: (location: LocationData) => void;
  setAutoLocation: (isAuto: boolean) => Promise<void>;
}

// Required keys per Phase 11.2 specs
const LAT_KEY = 'lastLatitude';
const LNG_KEY = 'lastLongitude';
const UPDATED_KEY = 'lastUpdatedAt';

// Additional keys for UI display
const CITY_KEY = 'lastCity';
const COUNTRY_KEY = 'lastCountry';
const IS_AUTO_STORAGE_KEY = 'salahmate_is_auto_location';

export const LocationContext = createContext<LocationContextType>({
  location: null,
  isAuto: true,
  isDetecting: false,
  error: null,
  refreshLocation: async () => {},
  setManualLocation: () => {},
  setAutoLocation: async () => {},
});

export const LocationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [location, setLocationState] = useState<LocationData | null>(null);
  const [isAuto, setIsAutoState] = useState<boolean>(true);
  const [isDetecting, setIsDetecting] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const saveLocationState = useCallback(async (newLocation: LocationData, newIsAuto: boolean) => {
    setLocationState(newLocation);
    setIsAutoState(newIsAuto);
    
    try {
      await AsyncStorage.multiSet([
        [LAT_KEY, newLocation.latitude.toString()],
        [LNG_KEY, newLocation.longitude.toString()],
        [CITY_KEY, newLocation.city],
        [COUNTRY_KEY, newLocation.country],
        [UPDATED_KEY, new Date().toISOString()],
        [IS_AUTO_STORAGE_KEY, newIsAuto ? 'true' : 'false']
      ]);
    } catch (e) {
      console.error('Failed to save location to AsyncStorage', e);
    }
  }, []);

  const detectLocation = useCallback(async () => {
    console.log('[Location] Requesting live GPS location...');
    setIsDetecting(true);
    setError(null);
    try {
      let { status } = await Location.requestForegroundPermissionsAsync();
      console.log(`[Location] Permission status: ${status}`);
      if (status !== 'granted') {
        setError('Location permission is required to automatically determine prayer timings.');
        setIsAutoState(false);
        await AsyncStorage.setItem(IS_AUTO_STORAGE_KEY, 'false');
        setIsDetecting(false);
        return;
      }

      let currentPosition = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });
      console.log(`[Location] GPS Coordinates: Latitude: ${currentPosition.coords.latitude}, Longitude: ${currentPosition.coords.longitude}`);
      
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
        console.log(`[Location] Reverse Geocode City: ${newLoc.city}, Country: ${newLoc.country}`);
        await saveLocationState(newLoc, true);
      } else {
        console.log(`[Location] Reverse Geocode failed, using Unknown City`);
        const newLoc = {
          city: 'Unknown City',
          country: 'Unknown Country',
          latitude: currentPosition.coords.latitude,
          longitude: currentPosition.coords.longitude,
        };
        await saveLocationState(newLoc, true);
      }
    } catch (err) {
      console.error('[Location] Error detecting location:', err);
      setError('Could not detect location. Please try again or use manual location.');
    } finally {
      setIsDetecting(false);
    }
  }, [saveLocationState]);

  // Load from cache on mount
  useEffect(() => {
    const initializeLocation = async () => {
      try {
        setIsDetecting(true);
        const [latStr, lngStr, cityStr, countryStr, isAutoStr] = await Promise.all([
          AsyncStorage.getItem(LAT_KEY),
          AsyncStorage.getItem(LNG_KEY),
          AsyncStorage.getItem(CITY_KEY),
          AsyncStorage.getItem(COUNTRY_KEY),
          AsyncStorage.getItem(IS_AUTO_STORAGE_KEY)
        ]);

        let hasCache = false;

        if (latStr && lngStr) {
          if (latStr === '33.6844' && lngStr === '73.0479') {
            console.log('[Location] Cleared stale Islamabad cache.');
            await AsyncStorage.multiRemove([LAT_KEY, LNG_KEY, CITY_KEY, COUNTRY_KEY]);
            hasCache = false;
          } else {
            console.log(`[Location] Cache used: Latitude: ${latStr}, Longitude: ${lngStr}, City: ${cityStr || 'Unknown'}, Country: ${countryStr || 'Unknown'}`);
            const cachedLocation = {
              latitude: parseFloat(latStr),
              longitude: parseFloat(lngStr),
              city: cityStr || 'Unknown City',
              country: countryStr || 'Unknown Country'
            };
            setLocationState(cachedLocation);
            hasCache = true;
          }
        }

        const auto = isAutoStr !== 'false';
        setIsAutoState(auto);

        if (auto) {
          // If we have cache, we still fetch in background. If we don't, we block on it.
          if (hasCache) {
            setIsDetecting(false); // don't block UI
            detectLocation(); // refresh in background
          } else {
            await detectLocation();
          }
        } else {
          setIsDetecting(false);
        }
      } catch (e) {
        console.error('Error initializing location from cache', e);
        setIsDetecting(false);
      }
    };

    initializeLocation();
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
      await AsyncStorage.setItem(IS_AUTO_STORAGE_KEY, 'false');
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
