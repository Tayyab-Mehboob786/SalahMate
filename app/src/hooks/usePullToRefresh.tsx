import React, { useState, useCallback } from 'react';
import { RefreshControl } from 'react-native';
import { useTheme } from 'react-native-paper';
import type { SalahMateTheme } from '@/theme';

export const usePullToRefresh = (onRefreshData?: () => Promise<void> | void) => {
  const theme = useTheme<SalahMateTheme>();
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      if (onRefreshData) {
        await onRefreshData();
      }
      // Always add a small artificial delay so the UI animation looks premium and smooth,
      // and acts as a placeholder when no backend exists.
      await new Promise(resolve => setTimeout(resolve, 1500));
    } catch (error) {
      console.error('Refresh failed:', error);
    } finally {
      setRefreshing(false);
    }
  }, [onRefreshData]);

  const refreshControl = (
    <RefreshControl
      refreshing={refreshing}
      onRefresh={onRefresh}
      tintColor={theme.colors.primary}
      colors={[theme.colors.primary]} // For Android
      progressBackgroundColor={theme.colors.surface} // For Android
    />
  );

  return { refreshing, onRefresh, refreshControl };
};
