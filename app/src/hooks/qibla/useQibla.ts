import { useState, useEffect, useCallback } from 'react';
import * as Location from 'expo-location';
import { useLocation } from '@/context/LocationContext';

const KAABA_LAT = 21.422487;
const KAABA_LNG = 39.826206;

function toRad(deg: number) {
  return (deg * Math.PI) / 180;
}

function toDeg(rad: number) {
  return (rad * 180) / Math.PI;
}

// Great-circle bearing from (lat1, lng1) to (lat2, lng2)
function calculateBearing(lat1: number, lng1: number, lat2: number, lng2: number) {
  const rLat1 = toRad(lat1);
  const rLat2 = toRad(lat2);
  const dLng = toRad(lng2 - lng1);

  const y = Math.sin(dLng) * Math.cos(rLat2);
  const x = Math.cos(rLat1) * Math.sin(rLat2) - Math.sin(rLat1) * Math.cos(rLat2) * Math.cos(dLng);
  
  return (toDeg(Math.atan2(y, x)) + 360) % 360;
}

// Haversine formula to calculate distance in km
function calculateDistance(lat1: number, lng1: number, lat2: number, lng2: number) {
  const R = 6371; // Earth's radius in km
  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * 
    Math.sin(dLng/2) * Math.sin(dLng/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
  return R * c;
}

export function useQibla() {
  const { location, error: locationError } = useLocation();
  const [heading, setHeading] = useState<number | null>(null);
  const [accuracy, setAccuracy] = useState<Location.LocationHeadingObject['accuracy']>(3);
  const [isCalibrating, setIsCalibrating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let subscription: Location.LocationSubscription | null = null;

    async function subscribeToHeading() {
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
          setError('Location permission required.');
          return;
        }

        const isHeadingAvailable = await Location.hasServicesEnabledAsync(); // basic check
        if (!isHeadingAvailable) {
           // We might still be able to watch heading, but if GPS is totally off it might fail.
        }

        subscription = await Location.watchHeadingAsync((headingObj) => {
          // trueHeading is preferred if available (iOS), otherwise use magHeading
          const currentHeading = headingObj.trueHeading >= 0 ? headingObj.trueHeading : headingObj.magHeading;
          setHeading(currentHeading);
          setAccuracy(headingObj.accuracy);
        });
      } catch (err) {
        console.warn('Failed to start heading sensor:', err);
        setError('Compass unavailable on this device.');
      }
    }

    subscribeToHeading();

    return () => {
      if (subscription) {
        subscription.remove();
      }
    };
  }, []);

  const userLat = location?.latitude;
  const userLng = location?.longitude;

  const qiblaBearing = userLat && userLng ? calculateBearing(userLat, userLng, KAABA_LAT, KAABA_LNG) : null;
  const distanceKm = userLat && userLng ? calculateDistance(userLat, userLng, KAABA_LAT, KAABA_LNG) : null;

  let turnDirection: 'LEFT' | 'RIGHT' | 'NONE' = 'NONE';
  let turnDegrees = 0;
  let isFacingQibla = false;

  if (heading !== null && qiblaBearing !== null) {
    let diff = (qiblaBearing - heading + 360) % 360;
    if (diff > 180) {
      diff -= 360;
    }
    
    turnDegrees = Math.round(Math.abs(diff));
    isFacingQibla = turnDegrees <= 5;

    if (!isFacingQibla) {
      turnDirection = diff > 0 ? 'RIGHT' : 'LEFT';
    }
  }

  return {
    heading,
    qiblaBearing,
    distanceKm,
    accuracy,
    error: error || locationError,
    turnDirection,
    turnDegrees,
    isFacingQibla,
    isCalibrating,
    setIsCalibrating,
  };
}
