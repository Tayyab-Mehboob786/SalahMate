import apiClient from './axios';
import { API_ENDPOINTS } from '@/constants/api';

export interface PrayerTimesData {
  gregorianDate: string;
  hijriDate: string;
  timings: {
    fajr: string;
    sunrise: string;
    dhuhr: string;
    asr: string;
    maghrib: string;
    isha: string;
  };
  timezone: string;
  calculationMethod: string;
}

export interface GetPrayerTimesResponse {
  success: boolean;
  data: PrayerTimesData;
}

export const prayerTimesApi = {
  getTodayTimings: async (lat: number, lng: number, method?: number): Promise<PrayerTimesData> => {
    const response = await apiClient.get<GetPrayerTimesResponse>(API_ENDPOINTS.PRAYER_TIMES.TODAY, {
      params: { lat, lng, method },
    });
    return response.data.data;
  },
};
