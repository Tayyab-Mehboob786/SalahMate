import React, { useEffect, useCallback } from 'react';
import { View, StyleSheet, FlatList, ActivityIndicator, Pressable } from 'react-native';
import { useTheme } from 'react-native-paper';
import { useRouter } from 'expo-router';
import { ScreenContainer, GlassHeader, AppIcon } from '@/components';
import { HistoryCard, EmptyHistory, HistorySkeleton } from '@/components/tracker/history';
import { usePrayerHistory } from '@/hooks/prayer/usePrayerHistory';
import { usePullToRefresh } from '@/hooks';
import type { SalahMateTheme } from '@/theme';
import { spacing } from '@/theme';
import type { PrayerHistoryItem } from '@/api/prayers.api';

export default function PrayerHistoryScreen() {
  const router = useRouter();
  const theme = useTheme<SalahMateTheme>();
  const {
    data,
    isLoading,
    isFetchingNextPage,
    isRefreshing,
    hasNextPage,
    loadFirstPage,
    refresh,
    loadNextPage,
  } = usePrayerHistory();

  const { refreshControl } = usePullToRefresh(refresh);

  useEffect(() => {
    loadFirstPage();
  }, [loadFirstPage]);

  const renderItem = useCallback(({ item }: { item: PrayerHistoryItem }) => {
    return <HistoryCard item={item} />;
  }, []);

  const renderFooter = () => {
    if (!isFetchingNextPage) return <View style={{ height: 48 }} />;
    return (
      <View style={styles.footerLoader}>
        <ActivityIndicator size="small" color={theme.colors.primary} />
      </View>
    );
  };

  const renderContent = () => {
    if (isLoading) {
      return (
        <View style={styles.listContent}>
          <HistorySkeleton />
        </View>
      );
    }

    if (data.length === 0) {
      return <EmptyHistory />;
    }

    return (
      <FlatList
        data={data}
        keyExtractor={(item) => item.date}
        renderItem={renderItem}
        contentContainerStyle={styles.listContent}
        refreshControl={refreshControl}
        onEndReached={loadNextPage}
        onEndReachedThreshold={0.5}
        ListFooterComponent={renderFooter}
        showsVerticalScrollIndicator={false}
      />
    );
  };

  return (
    <View style={[styles.mainWrapper, { backgroundColor: theme.colors.background }]}>
      <ScreenContainer withGlassGradient withBrandWatermark>
        <GlassHeader
          title="Prayer History"
          leftSlot={
            <Pressable onPress={() => router.back()} style={{ padding: 4 }}>
              <AppIcon
                name="arrow-left"
                size="lg"
                variant="onSurface"
              />
            </Pressable>
          }
        />
        {renderContent()}
      </ScreenContainer>
    </View>
  );
}

const styles = StyleSheet.create({
  mainWrapper: {
    flex: 1,
  },
  listContent: {
    paddingTop: spacing.md,
    paddingBottom: 48,
  },
  footerLoader: {
    paddingVertical: spacing.lg,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
