import React, { useState, useEffect, useMemo } from 'react';
import { View, StyleSheet, FlatList, TextInput, Pressable } from 'react-native';
import { Text, useTheme } from 'react-native-paper';
import { ScreenContainer, AppIcon } from '@/components';
import { QuranAppBar, SegmentedTabs, QuranListSkeleton, QuranSurahCard, QuranJuzCard, SurahItem, JuzItem } from '../components';
import { spacing } from '@/theme';
import type { SalahMateTheme } from '@/theme';
import { useLocalSearchParams, useRouter } from 'expo-router';
import Animated, { FadeIn } from 'react-native-reanimated';

import { getSurahs } from '@/api/quran.api';
import { ApiSurah } from '../types/api.types';
import { getSurahStartPage, JUZ_METADATA } from '../utils/mushaf.utils';

export const QuranBrowseScreen = () => {
  const theme = useTheme<SalahMateTheme>();
  const router = useRouter();
  const params = useLocalSearchParams();
  
  const [activeTab, setActiveTab] = useState<string>(
    (params.tab as string) || 'surahs'
  );
  const [searchQuery, setSearchQuery] = useState('');
  const [surahs, setSurahs] = useState<ApiSurah[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSurahs = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await getSurahs();
      console.log('[QuranBrowseScreen] surahs.length:', data.length);
      setSurahs(data);
    } catch (err) {
      setError('Unable to load Quran right now.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSurahs();
  }, []);

  const filteredSurahs = useMemo(() => {
    if (!searchQuery) return surahs;
    const lowerQuery = searchQuery.toLowerCase();
    return surahs.filter(s => 
      s.nameSimple.toLowerCase().includes(lowerQuery) ||
      s.nameTranslated.toLowerCase().includes(lowerQuery) ||
      s.id.toString() === lowerQuery ||
      s.nameArabic.includes(lowerQuery)
    );
  }, [searchQuery, surahs]);

  const handleSurahPress = (surah: ApiSurah) => {
    const startPage = getSurahStartPage(surah.id);
    router.push({
      pathname: '/quran/reader',
      params: { surahId: surah.id, surahName: surah.nameTranslated, page: startPage }
    });
  };

  const handleJuzPress = (juz: JuzItem) => {
    router.push({
      pathname: '/quran/reader',
      params: { juz: juz.juzNumber, page: juz.pageStart }
    });
  };

  const renderEmptyState = () => (
    <View style={styles.emptyContainer}>
      <AppIcon name="text-box-search-outline" size={48} color={theme.colors.onSurfaceVariant} />
      <Text variant="titleMedium" style={[styles.emptyText, { color: theme.colors.onSurfaceVariant }]}>
        No Surahs found.
      </Text>
    </View>
  );

  const renderErrorState = () => (
    <View style={styles.emptyContainer}>
      <AppIcon name="wifi-off" size={48} color={theme.colors.error} />
      <Text variant="titleMedium" style={[styles.emptyText, { color: theme.colors.onSurface }]}>
        {error}
      </Text>
      <Pressable onPress={fetchSurahs} style={[styles.retryBtn, { backgroundColor: theme.colors.primary }]}>
        <Text style={{ color: theme.colors.onPrimary, fontWeight: 'bold' }}>Retry</Text>
      </Pressable>
    </View>
  );

  return (
    <ScreenContainer scrollable={false} edges={['top', 'left', 'right']}>
      {/* Reused custom app bar but with different props */}
      <View style={[styles.header, { backgroundColor: theme.colors.background }]}>
        <View style={styles.headerTop}>
          <Pressable onPress={() => router.back()} style={styles.backBtn}>
            <AppIcon name="arrow-left" size={24} color={theme.colors.onBackground} />
          </Pressable>
          <View>
            <Text variant="titleLarge" style={[styles.headerTitle, { color: theme.colors.onBackground }]}>
              Browse Quran
            </Text>
            <Text variant="bodySmall" style={{ color: theme.colors.onSurfaceVariant }}>
              114 Surahs • 30 Juz
            </Text>
          </View>
        </View>

        <View style={[styles.searchBox, { backgroundColor: theme.colors.surfaceVariant }]}>
          <AppIcon name="magnify" size={20} color={theme.colors.onSurfaceVariant} />
          <TextInput 
            style={[styles.searchInput, { color: theme.colors.onSurface }]}
            placeholder="Search Surah..."
            placeholderTextColor={theme.colors.onSurfaceVariant}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery.length > 0 && (
            <Pressable onPress={() => setSearchQuery('')}>
              <AppIcon name="close-circle" size={18} color={theme.colors.onSurfaceVariant} />
            </Pressable>
          )}
        </View>

        <SegmentedTabs 
          tabs={['surahs', 'juz']} 
          activeTab={activeTab} 
          onTabChange={setActiveTab} 
        />
      </View>

      <View style={styles.listContainer}>
        {isLoading ? (
          <Animated.View entering={FadeIn.duration(400)}>
            <QuranListSkeleton />
          </Animated.View>
        ) : error ? (
          <Animated.View entering={FadeIn.duration(400)} style={{ flex: 1 }}>
            {renderErrorState()}
          </Animated.View>
        ) : (
          <Animated.View entering={FadeIn.duration(400)} style={{ flex: 1 }}>
            {activeTab === 'surahs' && (
              <FlatList
                data={filteredSurahs}
                keyExtractor={(item) => item.id.toString()}
                style={{ flex: 1 }}
                renderItem={({ item }) => <QuranSurahCard surah={item as any} onPress={() => handleSurahPress(item)} />}
                contentContainerStyle={styles.flatListContent}
                ListEmptyComponent={renderEmptyState}
                ListFooterComponent={<View style={{ height: 300 }} />}
                showsVerticalScrollIndicator={false}
              />
            )}
            
            {activeTab === 'juz' && (
              <FlatList
                data={JUZ_METADATA}
                keyExtractor={(item) => item.juzNumber.toString()}
                style={{ flex: 1 }}
                renderItem={({ item }) => <QuranJuzCard juz={item} onPress={() => handleJuzPress(item)} />}
                contentContainerStyle={styles.flatListContent}
                ListFooterComponent={<View style={{ height: 300 }} />}
                showsVerticalScrollIndicator={false}
              />
            )}

          </Animated.View>
        )}
      </View>
    </ScreenContainer>
  );
};

const styles = StyleSheet.create({
  header: {
    paddingTop: spacing.xl,
    paddingBottom: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.05)',
  },
  headerTop: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    marginBottom: spacing.md,
  },
  backBtn: {
    marginRight: spacing.md,
    padding: 4,
  },
  headerTitle: {
    fontWeight: '700',
  },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: spacing.md,
    paddingHorizontal: spacing.md,
    height: 44,
    borderRadius: 22,
    marginBottom: spacing.md,
  },
  searchInput: {
    flex: 1,
    marginLeft: spacing.sm,
    fontSize: 16,
  },
  listContainer: {
    flex: 1,
  },
  flatListContent: {
    paddingTop: spacing.md,
    paddingBottom: 180, // Large padding to completely clear bottom safe area and tab bar
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: spacing['4xl'],
  },
  emptyText: {
    marginTop: spacing.md,
  },
  retryBtn: {
    marginTop: spacing.xl,
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.sm,
    borderRadius: 24,
  }
});
