import { useState, useCallback, useEffect } from 'react';
import { prayersApi, AnalyticsData } from '@/api/prayers.api';

export function useAnalytics() {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const [period, setPeriod] = useState<'7d' | '30d' | '90d' | 'all'>('7d');

  const fetchAnalytics = useCallback(async () => {
    try {
      setIsLoading(true);
      setIsError(false);
      const result = await prayersApi.getAnalytics(period);
      setData(result);
    } catch (error) {
      console.error('Failed to fetch analytics:', error);
      setIsError(true);
    } finally {
      setIsLoading(false);
    }
  }, [period]);

  useEffect(() => {
    fetchAnalytics();
  }, [fetchAnalytics]);

  return {
    data,
    isLoading,
    isError,
    period,
    setPeriod,
    refetch: fetchAnalytics,
  };
}
