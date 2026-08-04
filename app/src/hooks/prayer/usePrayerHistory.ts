import { useState, useCallback, useRef } from 'react';
import { prayersApi, PrayerHistoryItem } from '@/api/prayers.api';

export function usePrayerHistory() {
  const [data, setData] = useState<PrayerHistoryItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isFetchingNextPage, setIsFetchingNextPage] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasNextPage, setHasNextPage] = useState(true);
  const pageRef = useRef(1);

  const fetchHistory = useCallback(async (page: number, isRefresh = false) => {
    try {
      if (isRefresh) {
        setIsRefreshing(true);
        setError(null);
      } else if (page === 1) {
        setIsLoading(true);
        setError(null);
      } else {
        setIsFetchingNextPage(true);
      }

      const response = await prayersApi.getHistory(page, 10);

      setData((prev) => {
        if (page === 1) return response.data;
        const newIds = new Set(response.data.map(d => d.date));
        const filteredPrev = prev.filter(p => !newIds.has(p.date));
        return [...filteredPrev, ...response.data];
      });

      setHasNextPage(response.meta.page < response.meta.totalPages);
      pageRef.current = page;
    } catch (err: any) {
      setError(err.message || 'Failed to load history');
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
      setIsFetchingNextPage(false);
    }
  }, []);

  const loadFirstPage = useCallback(() => {
    return fetchHistory(1, false);
  }, [fetchHistory]);

  const refresh = useCallback(() => {
    return fetchHistory(1, true);
  }, [fetchHistory]);

  const loadNextPage = useCallback(() => {
    if (!hasNextPage || isFetchingNextPage || isLoading || isRefreshing) return;
    return fetchHistory(pageRef.current + 1, false);
  }, [fetchHistory, hasNextPage, isFetchingNextPage, isLoading, isRefreshing]);

  return {
    data,
    isLoading,
    isFetchingNextPage,
    isRefreshing,
    error,
    hasNextPage,
    loadFirstPage,
    refresh,
    loadNextPage,
  };
}
