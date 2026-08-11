import React, { useRef, useMemo } from 'react';
import { View, StyleSheet, FlatList, Dimensions, Pressable, NativeSyntheticEvent, NativeScrollEvent } from 'react-native';
import { Text, useTheme } from 'react-native-paper';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { AppIcon } from '@/components/common/AppIcon';
import { ScreenContainer } from '@/components/layout/ScreenContainer';
import { MushafPage, ReaderBottomBar, ReaderLoadingSkeleton } from '../components';
import { useMushafReader } from '../hooks/useMushafReader';
import { spacing } from '@/theme';
import type { SalahMateTheme } from '@/theme';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';

const { width } = Dimensions.get('window');

export const MushafReaderScreen = () => {
  const theme = useTheme<SalahMateTheme>();
  const router = useRouter();
  const params = useLocalSearchParams();
  const initialPage = params.page ? parseInt(params.page as string, 10) : 1;

  const { currentPage, changePage, pagesData, isLoading, totalPages } = useMushafReader(initialPage);
  
  const flatListRef = useRef<FlatList>(null);

  // We create a virtual array of pages [1, 2, ..., 604] but inverted for RTL reading
  // Inverted FlatList means index 0 is on the right, index 1 is to its left.
  // So data=[1, 2, 3] inverted means: [3] [2] [1]. 
  // Wait, if we invert, we want Page 1 on the far right, Page 2 on its left.
  // So the array should literally be [1, 2, 3... 604].
  const pageNumbers = useMemo(() => Array.from({ length: totalPages }).map((_, i) => i + 1), [totalPages]);

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    // Calculate current page index based on scroll position
    const offsetX = event.nativeEvent.contentOffset.x;
    const newIndex = Math.round(offsetX / width);
    
    // Safety check
    if (newIndex >= 0 && newIndex < totalPages) {
      const newPageNumber = pageNumbers[newIndex];
      if (newPageNumber !== currentPage) {
        changePage(newPageNumber);
      }
    }
  };

  const goToPage = (pageNumber: number) => {
    if (pageNumber >= 1 && pageNumber <= totalPages) {
      changePage(pageNumber);
      const targetIndex = pageNumber - 1;
      flatListRef.current?.scrollToIndex({ index: targetIndex, animated: true });
    }
  };

  const renderItem = ({ item }: { item: number }) => {
    const pageData = pagesData[item];
    
    if (!pageData) {
      return (
        <View style={{ width, justifyContent: 'center', alignItems: 'center' }}>
          <ReaderLoadingSkeleton />
        </View>
      );
    }

    return (
      <View style={{ width }}>
        <MushafPage data={pageData} width={width} />
      </View>
    );
  };

  // Top Bar rendering
  const renderTopBar = () => {
    const currentPageData = pagesData[currentPage];
    
    // Safely deduce the primary Surah from the first Ayah on the page
    let surahName = 'Quran Reader';
    if (currentPageData && currentPageData.ayahs.length > 0) {
      const primarySurahId = currentPageData.ayahs[0].surahId;
      const matchingSurah = currentPageData.surahs.find(s => s.id === primarySurahId);
      if (matchingSurah) {
        surahName = matchingSurah.nameTranslated;
      }
    }

    return (
      <View style={[styles.header, { backgroundColor: theme.colors.surface, borderBottomColor: theme.colors.border }]}>
        <Pressable onPress={() => router.back()} style={styles.backBtn}>
          <AppIcon name="arrow-left" size={24} color={theme.colors.onSurface} />
        </Pressable>
        
        <View style={styles.headerCenter}>
          <Text variant="titleMedium" style={{ fontWeight: 'bold' }}>
            {surahName}
          </Text>
        </View>

        <Pressable style={styles.menuBtn}>
          <AppIcon name="dots-vertical" size={24} color={theme.colors.onSurfaceVariant} />
        </Pressable>
      </View>
    );
  };

  // Safe to read Juz/Surah from current page
  const currentPageData = pagesData[currentPage];
  let currentSurahName = '';
  let currentJuz = 1;

  if (currentPageData && currentPageData.ayahs.length > 0) {
    const primarySurahId = currentPageData.ayahs[0].surahId;
    const matchingSurah = currentPageData.surahs.find(s => s.id === primarySurahId);
    if (matchingSurah) {
      currentSurahName = matchingSurah.nameTranslated;
    }
    currentJuz = currentPageData.juzNumber;
  }

  if (isLoading && !currentPageData) {
    return (
      <ScreenContainer scrollable={false}>
        {renderTopBar()}
        <ReaderLoadingSkeleton />
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer scrollable={false}>
      {renderTopBar()}
      
      <Animated.View style={styles.readerContainer} entering={FadeIn.duration(400)} exiting={FadeOut}>
        <FlatList
          ref={flatListRef}
          data={pageNumbers}
          keyExtractor={(item) => item.toString()}
          renderItem={renderItem}
          horizontal
          pagingEnabled
          inverted // Enables Right-to-Left swiping for Mushaf
          showsHorizontalScrollIndicator={false}
          onMomentumScrollEnd={handleScroll}
          initialScrollIndex={currentPage - 1}
          getItemLayout={(data, index) => ({
            length: width,
            offset: width * index,
            index,
          })}
          windowSize={3} // Current, Prev, Next
          maxToRenderPerBatch={3}
          removeClippedSubviews={true}
        />
      </Animated.View>

      <ReaderBottomBar 
        pageNumber={currentPage}
        juzNumber={currentJuz}
        surahName={currentSurahName}
        canGoNext={currentPage < totalPages}
        canGoPrev={currentPage > 1}
        onNextPress={() => goToPage(currentPage + 1)} 
        onPrevPress={() => goToPage(currentPage - 1)} 
      />
    </ScreenContainer>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: spacing.xl,
    paddingBottom: spacing.sm,
    paddingHorizontal: spacing.md,
    borderBottomWidth: 1,
  },
  backBtn: {
    padding: 4,
  },
  menuBtn: {
    padding: 4,
  },
  headerCenter: {
    alignItems: 'center',
  },
  readerContainer: {
    flex: 1,
  }
});
