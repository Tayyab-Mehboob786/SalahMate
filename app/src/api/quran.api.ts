import apiClient from './axios';
import { API_ENDPOINTS } from '../constants/api';
import { ApiSurah, ApiPage, ApiJuz, ApiTranslation } from '../features/quran/types/api.types';

let surahsCache: ApiSurah[] | null = null;

export const getSurahs = async (): Promise<ApiSurah[]> => {
  if (surahsCache) return surahsCache;
  const response = await apiClient.get<ApiSurah[]>(API_ENDPOINTS.QURAN.SURAHS);
  console.log('[Quran] API Surah count:', response.data.length);
  surahsCache = response.data;
  return response.data;
};

export const getAudioReciters = async (): Promise<any[]> => {
  const response = await apiClient.get<any[]>(API_ENDPOINTS.QURAN.AUDIO);
  return response.data;
};

export const getSurah = async (id: number): Promise<ApiSurah> => {
  const response = await apiClient.get<ApiSurah>(`${API_ENDPOINTS.QURAN.SURAH}/${id}`);
  return response.data;
};

export const getPage = async (pageNumber: number, translation?: string, reciterId?: number): Promise<ApiPage> => {
  const params: Record<string, string | number> = {};
  if (translation && translation !== 'none') params.translation = translation;
  if (reciterId) params.reciter = reciterId;
  const response = await apiClient.get<ApiPage>(`${API_ENDPOINTS.QURAN.PAGE}/${pageNumber}`, {
    params,
  });
  return response.data;
};

export const getJuz = async (juzNumber: number, translation?: string, reciterId?: number): Promise<ApiJuz> => {
  const params: Record<string, string | number> = {};
  if (translation && translation !== 'none') params.translation = translation;
  if (reciterId) params.reciter = reciterId;
  const response = await apiClient.get<ApiJuz>(`${API_ENDPOINTS.QURAN.JUZ}/${juzNumber}`, {
    params,
  });
  return response.data;
};

export const searchQuran = async (query: string): Promise<any[]> => {
  const response = await apiClient.get<any[]>(API_ENDPOINTS.QURAN.SEARCH, {
    params: { q: query },
  });
  return response.data;
};

export const getTranslations = async (): Promise<ApiTranslation[]> => {
  const response = await apiClient.get<ApiTranslation[]>(API_ENDPOINTS.QURAN.TRANSLATIONS);
  return response.data;
};
