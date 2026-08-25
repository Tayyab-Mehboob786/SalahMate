import apiClient from '@/api/axios';
import { Surah, Page, Juz, Ayah, Translation } from '../types/quran.types';

export const quranApiService = {
  getSurahs: async (): Promise<Surah[]> => {
    const response = await apiClient.get<Surah[]>('/quran/surahs');
    return response.data;
  },
  
  getSurah: async (id: number): Promise<Surah> => {
    const response = await apiClient.get<Surah>(`/quran/surah/${id}`);
    return response.data;
  },

  getPage: async (pageNumber: number, translation?: string): Promise<Page> => {
    const response = await apiClient.get<Page>(`/quran/page/${pageNumber}`, {
      params: { translation },
    });
    return response.data;
  },

  getJuz: async (juzNumber: number, translation?: string): Promise<Juz> => {
    const response = await apiClient.get<Juz>(`/quran/juz/${juzNumber}`, {
      params: { translation },
    });
    return response.data;
  },

  search: async (query: string): Promise<Ayah[]> => {
    const response = await apiClient.get<Ayah[]>(`/quran/search`, { params: { q: query } });
    return response.data;
  },

  getTranslations: async (): Promise<Translation[]> => {
    const response = await apiClient.get<Translation[]>('/quran/translations');
    return response.data;
  },

  getAudio: async (): Promise<any[]> => {
    const response = await apiClient.get<any[]>('/quran/audio');
    return response.data;
  }
};
