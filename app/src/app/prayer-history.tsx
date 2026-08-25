import React, { useEffect, useCallback } from 'react';
import { View, StyleSheet, FlatList, ActivityIndicator, Pressable } from 'react-native';
import { useTheme, Text } from 'react-native-paper';
import { useRouter } from 'expo-router';
import { ScreenContainer, AppIcon } from '@/components';
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
    if (isFetchingNextPage) {
      return (
        <View style={styles.footerLoader}>
          <ActivityIndicator size="small" color="#FFFFFF" />
        </View>
      );
    }
    
    if (hasNextPage) {
      return (
        <Pressable 
          style={({ pressed }) => [
            styles.viewMoreBtn,
            pressed && { opacity: 0.8 }
          ]}
          onPress={loadNextPage}
        >
          <Text style={styles.viewMoreText}>View More</Text>
        </Pressable>
      );
    }

    return <View style={{ height: 48 }} />;
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
        ListFooterComponent={renderFooter}
        showsVerticalScrollIndicator={false}
      />
    );
  };

  return (
    <ScreenContainer 
      scrollable={false}
      backgroundImage={require('../../assets/backgrounds/track-mosque.png')}
    >
      <View style={styles.headerWrapper}>
        <Pressable 
          style={({ pressed }) => [styles.headerBtn, pressed && { opacity: 0.7 }]}
          onPress={() => router.back()}
        >
          <AppIcon name="chevron-left" size={24} color="#FFFFFF" />
        </Pressable>
        <Text style={styles.headerTitle}>Prayer History</Text>
        <View style={{ width: 44, height: 44 }} />
      </View>
      {renderContent()}
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  headerWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 24,
  },
  headerBtn: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#FFFFFF',
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
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
  viewMoreBtn: {
    marginHorizontal: 16,
    marginVertical: 16,
    paddingVertical: 14,
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  viewMoreText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});
