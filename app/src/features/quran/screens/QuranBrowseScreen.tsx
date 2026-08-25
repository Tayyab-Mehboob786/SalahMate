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
      params: { mode: 'surah', surahId: surah.id, surahName: surah.nameTranslated, page: startPage }
    });
  };

  const handleJuzPress = (juz: JuzItem) => {
    router.push({
      pathname: '/quran/reader',
      params: { mode: 'juz', juz: juz.juzNumber, page: juz.pageStart }
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
    <ScreenContainer 
      scrollable={false} 
      edges={['top', 'left', 'right']}
      backgroundImage={require('../../../../assets/backgrounds/quran-background.png')}
    >
      {/* Reused custom app bar but with different props */}
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <Pressable onPress={() => router.back()} style={styles.backBtn}>
            <AppIcon name="arrow-left" size={24} color="#8EDCB8" />
          </Pressable>
          <View>
            <Text variant="titleLarge" style={[styles.headerTitle, { color: '#FFFFFF' }]}>
              Browse Quran
            </Text>
            <Text variant="bodySmall" style={{ color: 'rgba(255,255,255,0.7)', textAlign: 'center' }}>
              114 Surahs • 30 Juz
            </Text>
          </View>
          {/* Empty view for balance if needed, but flex seems to handle it */}
          <View style={{ width: 24, marginLeft: spacing.md }} />
        </View>

        <View style={styles.searchBox}>
          <AppIcon name="magnify" size={20} color="rgba(255,255,255,0.5)" />
          <TextInput 
            style={styles.searchInput}
            placeholder="Search Surah..."
            placeholderTextColor="rgba(255,255,255,0.5)"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery.length > 0 && (
            <Pressable onPress={() => setSearchQuery('')}>
              <AppIcon name="close-circle" size={18} color="rgba(255,255,255,0.5)" />
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
  },
  headerTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
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
    height: 48,
    borderRadius: 24,
    marginBottom: spacing.md,
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
  },
  searchInput: {
    flex: 1,
    marginLeft: spacing.sm,
    fontSize: 16,
    color: '#FFFFFF',
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
