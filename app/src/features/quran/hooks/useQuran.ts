import { useState, useCallback } from 'react';
import { quranApiService } from '../services/quran.service';
import { Surah, Page } from '../types/quran.types';

export const useQuran = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const fetchSurahs = useCallback(async (): Promise<Surah[]> => {
    try {
      setLoading(true);
      return await quranApiService.getSurahs();
    } catch (e: any) {
      setError(e.message);
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchPage = useCallback(async (pageNumber: number): Promise<Page | null> => {
    try {
      setLoading(true);
      return await quranApiService.getPage(pageNumber);
    } catch (e: any) {
      setError(e.message);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  return { fetchSurahs, fetchPage, loading, error };
};
