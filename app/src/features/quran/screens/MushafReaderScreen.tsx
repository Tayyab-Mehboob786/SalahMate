import React, { useRef, useMemo, useState, useEffect, useCallback } from 'react';
import { View, StyleSheet, FlatList, Dimensions, Pressable, NativeSyntheticEvent, NativeScrollEvent, ScrollView } from 'react-native';
import { Text, useTheme, Menu, Divider } from 'react-native-paper';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { AppIcon } from '@/components/common/AppIcon';
import { ScreenContainer } from '@/components/layout/ScreenContainer';
import { MushafPage, ReaderBottomBar, ReaderLoadingSkeleton } from '../components';
import { useMushafReader } from '../hooks/useMushafReader';
import { MushafPageData } from '../types/reader.types';
import { spacing } from '@/theme';
import type { SalahMateTheme } from '@/theme';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getAudioReciters } from '@/api/quran.api';
import { ApiReciter } from '../types/api.types';
import { useQuranAudio } from '../hooks/useQuranAudio';
import { ActivityIndicator } from 'react-native-paper';

const TRANSLATION_PREF_KEY = 'quran_translation_pref';
const RECITER_PREF_KEY = 'quran_reciter_pref';
const AUDIO_MODE_PREF_KEY = 'quran_audio_mode_pref';

const { width } = Dimensions.get('window');

const FONT_SIZES = [
  { label: 'Small', value: 20 },
  { label: 'Normal', value: 24 },
  { label: 'Large', value: 28 },
  { label: 'Extra Large', value: 32 },
  { label: 'Huge', value: 36 },
];

export const MushafReaderScreen = () => {
  const theme = useTheme<SalahMateTheme>();
  const router = useRouter();
  const params = useLocalSearchParams();
  const mode = (params.mode as string) || (params.surahId ? 'surah' : params.juz ? 'juz' : 'mushaf');
  const initialPage = params.page ? parseInt(params.page as string, 10) : 1;
  
  const [activeSurahId, setActiveSurahId] = useState<number | undefined>(
    params.surahId ? parseInt(params.surahId as string, 10) : undefined
  );

  const [translation, setTranslation] = useState<string>('en'); // default english
  const [reciterId, setReciterId] = useState<number | undefined>(7); // Default Mishary
  const [reciters, setReciters] = useState<ApiReciter[]>([]);
  const [audioModeEnabled, setAudioModeEnabled] = useState<boolean>(true); // default true

  const { currentPage, changePage, pagesData, isLoading, totalPages } = useMushafReader(
    initialPage, 
    translation, 
    audioModeEnabled ? reciterId : undefined
  );
  
  const [fontSize, setFontSize] = useState(24);
  const [menuVisible, setMenuVisible] = useState(false);
  const [menuLevel, setMenuLevel] = useState<'main' | 'font' | 'translation' | 'reciter'>('main');

  const { status: audioStatus, playingAyahId, playAyah, pause, resume, stop } = useQuranAudio();

  const closeMenu = () => {
    setMenuVisible(false);
    setTimeout(() => setMenuLevel('main'), 200);
  };

  useEffect(() => {
    const pageData = pagesData[currentPage];
    if (pageData && pageData.ayahs.length > 0 && !activeSurahId) {
      setActiveSurahId(pageData.ayahs[0].surahId);
    }
  }, [currentPage, pagesData, activeSurahId]);

  const getFilteredPageData = useCallback(
    (pageData: MushafPageData | undefined, targetSurah: number | undefined): MushafPageData | undefined => {
      if (!pageData) return pageData;
      if (mode !== 'surah' || !targetSurah) return pageData;

      const filteredAyahs = pageData.ayahs.filter((a: { surahId: number }) => a.surahId === targetSurah);
      const filteredSurahs = pageData.surahs.filter((s: { id: number }) => s.id === targetSurah);

      if (filteredAyahs.length === 0) return pageData;

      return {
        ...pageData,
        surahs: filteredSurahs,
        ayahs: filteredAyahs,
      };
    },
    [mode]
  );

  useEffect(() => {
    const loadPref = async () => {
      try {
        const storedTrans = await AsyncStorage.getItem(TRANSLATION_PREF_KEY);
        if (storedTrans) setTranslation(storedTrans);
        
        const storedRec = await AsyncStorage.getItem(RECITER_PREF_KEY);
        if (storedRec) setReciterId(parseInt(storedRec, 10));

        const storedAudioMode = await AsyncStorage.getItem(AUDIO_MODE_PREF_KEY);
        if (storedAudioMode) setAudioModeEnabled(storedAudioMode === 'true');
      } catch (e) {}
    };
    loadPref();

    getAudioReciters().then(res => {
      if (res && res.length > 0) setReciters(res);
    }).catch(() => {});
  }, []);

  const handleTranslationChange = async (val: string) => {
    setTranslation(val);
    closeMenu();
    try {
      await AsyncStorage.setItem(TRANSLATION_PREF_KEY, val);
    } catch (e) {}
  };

  const handleReciterChange = async (val: number) => {
    setReciterId(val);
    closeMenu();
    stop(); // Stop audio if reciter changes
    try {
      await AsyncStorage.setItem(RECITER_PREF_KEY, val.toString());
    } catch (e) {}
  };

  const toggleAudioMode = async () => {
    const newValue = !audioModeEnabled;
    setAudioModeEnabled(newValue);
    if (!newValue) {
      stop(); // stop any playing audio when disabling
      closeMenu();
    }
    try {
      await AsyncStorage.setItem(AUDIO_MODE_PREF_KEY, newValue.toString());
    } catch (e) {}
  };

  const flatListRef = useRef<FlatList>(null);

  const pageNumbers = useMemo(() => Array.from({ length: totalPages }).map((_, i) => i + 1), [totalPages]);

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const offsetX = event.nativeEvent.contentOffset.x;
    const newIndex = Math.round(offsetX / width);
    
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

  // --- AUDIO LOGIC ---
  const stateRef = useRef({ playingAyahId, currentPage, pagesData, totalPages, activeSurahId });
  useEffect(() => {
    stateRef.current = { playingAyahId, currentPage, pagesData, totalPages, activeSurahId };
  }, [playingAyahId, currentPage, pagesData, totalPages, activeSurahId]);

  const playNextAyah = async () => {
    const { playingAyahId: currentId, currentPage: currPage, pagesData: pData, totalPages: tPages, activeSurahId: curSurahId } = stateRef.current;
    if (!currentId) return;

    let nextAyah = null;
    let turnToPage = null;
    let shouldStop = false;

    // Filter pages for current mode
    const processedMap: Record<number, MushafPageData> = {};
    for (const pageStr of Object.keys(pData)) {
      const pageNum = parseInt(pageStr, 10);
      const filtered = getFilteredPageData(pData[pageNum], curSurahId);
      if (filtered) processedMap[pageNum] = filtered;
    }

    for (const pageStr of Object.keys(processedMap)) {
      const pageNum = parseInt(pageStr, 10);
      const pageData = processedMap[pageNum];
      const idx = pageData.ayahs.findIndex((a: { id: number }) => a.id === currentId);
      if (idx !== -1) {
        const currentAyah = pageData.ayahs[idx];
        const surahInfo = pageData.surahs.find((s: { id: number }) => s.id === currentAyah.surahId);
        
        if (surahInfo && currentAyah.ayahNumber === surahInfo.versesCount) {
          shouldStop = true;
          break;
        }

        if (idx < pageData.ayahs.length - 1) {
          nextAyah = pageData.ayahs[idx + 1];
          turnToPage = pageNum;
        } else {
          if (pageNum < tPages) {
            turnToPage = pageNum + 1;
            const nextPageData = getFilteredPageData(pData[turnToPage], curSurahId);
            if (nextPageData && nextPageData.ayahs.length > 0) {
              nextAyah = nextPageData.ayahs[0];
            }
          }
        }
        break;
      }
    }

    if (shouldStop || !nextAyah || !nextAyah.audioUrl) {
      stop();
      return;
    }

    if (turnToPage && turnToPage !== currPage) {
      goToPage(turnToPage);
    }
    playAyah(nextAyah.id, nextAyah.audioUrl, () => playNextAyahRef.current());
  };

  const playNextAyahRef = useRef(playNextAyah);
  playNextAyahRef.current = playNextAyah;

  const playPreviousAyah = async () => {
    const { playingAyahId: currentId, currentPage: currPage, pagesData: pData, activeSurahId: curSurahId } = stateRef.current;
    if (!currentId) return;

    let prevAyah = null;
    let turnToPage = null;

    const processedMap: Record<number, MushafPageData> = {};
    for (const pageStr of Object.keys(pData)) {
      const pageNum = parseInt(pageStr, 10);
      const filtered = getFilteredPageData(pData[pageNum], curSurahId);
      if (filtered) processedMap[pageNum] = filtered;
    }

    for (const pageStr of Object.keys(processedMap)) {
      const pageNum = parseInt(pageStr, 10);
      const pageData = processedMap[pageNum];
      const idx = pageData.ayahs.findIndex((a: { id: number }) => a.id === currentId);
      if (idx !== -1) {
        if (idx > 0) {
          prevAyah = pageData.ayahs[idx - 1];
          turnToPage = pageNum;
        } else {
          if (pageNum > 1) {
            turnToPage = pageNum - 1;
            const prevPageData = getFilteredPageData(pData[turnToPage], curSurahId);
            if (prevPageData && prevPageData.ayahs.length > 0) {
              prevAyah = prevPageData.ayahs[prevPageData.ayahs.length - 1];
            }
          }
        }
        break;
      }
    }

    if (!prevAyah || !prevAyah.audioUrl) {
      stop();
      return;
    }

    if (turnToPage && turnToPage !== currPage) {
      goToPage(turnToPage);
    }
    playAyah(prevAyah.id, prevAyah.audioUrl, () => playNextAyahRef.current());
  };

  const handlePlayPause = () => {
    if (audioStatus === 'playing') {
      pause();
    } else if (audioStatus === 'paused') {
      resume();
    } else {
      const pageData = getFilteredPageData(pagesData[currentPage], activeSurahId);
      if (pageData && pageData.ayahs.length > 0) {
        const firstAyah = pageData.ayahs[0];
        if (firstAyah.audioUrl) {
          playAyah(firstAyah.id, firstAyah.audioUrl, () => playNextAyahRef.current());
        }
      }
    }
  };
  // --- END AUDIO LOGIC ---

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
        <MushafPage 
          data={pageData} 
          width={width} 
          fontSize={fontSize} 
          playingAyahId={playingAyahId} 
          targetSurahId={activeSurahId}
        />
      </View>
    );
  };

  // Top Bar rendering
  const renderTopBar = () => {
    const currentPageData = pagesData[currentPage];
    
    // Safely deduce the primary Surah from activeSurahId or first Ayah on the page
    let surahName = 'Quran Reader';
    if (currentPageData && currentPageData.ayahs.length > 0) {
      const matchingSurah = activeSurahId
        ? currentPageData.surahs.find((s: { id: number }) => s.id === activeSurahId)
        : currentPageData.surahs.find((s: { id: number }) => s.id === currentPageData.ayahs[0].surahId);
      
      const primarySurah = matchingSurah || currentPageData.surahs.find((s: { id: number }) => s.id === currentPageData.ayahs[0].surahId);
      if (primarySurah) {
        surahName = primarySurah.nameTranslated;
      }
    }

    return (
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.backBtn}>
          <AppIcon name="arrow-left" size={24} color="#8EDCB8" />
        </Pressable>
        
        <View style={styles.headerCenter}>
          <Text variant="titleMedium" style={{ fontWeight: 'bold', color: '#FFFFFF' }}>
            {surahName}
          </Text>
        </View>

        <Menu
          visible={menuVisible}
          onDismiss={closeMenu}
          anchor={
            <Pressable style={[styles.menuBtn, { padding: 4 }]} onPress={() => setMenuVisible(true)}>
              <AppIcon name="dots-vertical" size={28} color="rgba(255,255,255,0.7)" />
            </Pressable>
          }
          contentStyle={{ backgroundColor: 'rgba(0,0,0,0.85)' }}
        >
          {menuLevel === 'main' && (
            <React.Fragment>
              <Menu.Item 
                onPress={() => setMenuLevel('font')} 
                title="Font Size" 
                trailingIcon="chevron-right"
                titleStyle={{ color: '#FFFFFF' }} 
              />
              <Divider style={{ backgroundColor: 'rgba(255,255,255,0.1)' }} />
              <Menu.Item 
                onPress={() => setMenuLevel('translation')} 
                title="Translation" 
                trailingIcon="chevron-right"
                titleStyle={{ color: '#FFFFFF' }} 
              />
              <Divider style={{ backgroundColor: 'rgba(255,255,255,0.1)' }} />
              <Menu.Item 
                onPress={toggleAudioMode} 
                title={audioModeEnabled ? "Disable Audio Mode" : "Enable Audio Mode"} 
                trailingIcon={audioModeEnabled ? "volume-high" : "volume-off"}
                titleStyle={{ color: '#FFFFFF' }} 
              />
              {audioModeEnabled && (
                <Menu.Item 
                  onPress={() => setMenuLevel('reciter')} 
                  title="Reciter" 
                  trailingIcon="chevron-right"
                  titleStyle={{ color: '#FFFFFF' }} 
                />
              )}
            </React.Fragment>
          )}

          {menuLevel === 'font' && (
            <React.Fragment>
              <Menu.Item 
                onPress={() => setMenuLevel('main')} 
                title="Back" 
                leadingIcon="chevron-left"
                titleStyle={{ color: '#8EDCB8' }} 
              />
              <Divider style={{ backgroundColor: 'rgba(255,255,255,0.2)', height: 2, marginVertical: 4 }} />
              {FONT_SIZES.map((sizeOption) => (
                <Menu.Item 
                  key={sizeOption.value}
                  onPress={() => { setFontSize(sizeOption.value); closeMenu(); }} 
                  title={sizeOption.label} 
                  titleStyle={{ color: fontSize === sizeOption.value ? '#8EDCB8' : '#FFFFFF' }}
                />
              ))}
            </React.Fragment>
          )}

          {menuLevel === 'translation' && (
            <React.Fragment>
              <Menu.Item 
                onPress={() => setMenuLevel('main')} 
                title="Back" 
                leadingIcon="chevron-left"
                titleStyle={{ color: '#8EDCB8' }} 
              />
              <Divider style={{ backgroundColor: 'rgba(255,255,255,0.2)', height: 2, marginVertical: 4 }} />
              <Menu.Item 
                onPress={() => handleTranslationChange('none')} 
                title="No Translation" 
                titleStyle={{ color: translation === 'none' ? '#8EDCB8' : '#FFFFFF', fontSize: 14 }}
              />
              <Menu.Item 
                onPress={() => handleTranslationChange('en')} 
                title="English Translation" 
                titleStyle={{ color: translation === 'en' ? '#8EDCB8' : '#FFFFFF', fontSize: 14 }}
              />
              <Menu.Item 
                onPress={() => handleTranslationChange('ur')} 
                title="Urdu Translation" 
                titleStyle={{ color: translation === 'ur' ? '#8EDCB8' : '#FFFFFF', fontSize: 14 }}
              />
            </React.Fragment>
          )}

          {menuLevel === 'reciter' && (
            <React.Fragment>
              <Menu.Item 
                onPress={() => setMenuLevel('main')} 
                title="Back" 
                leadingIcon="chevron-left"
                titleStyle={{ color: '#8EDCB8' }} 
              />
              <Divider style={{ backgroundColor: 'rgba(255,255,255,0.2)', height: 2, marginVertical: 4 }} />
              <ScrollView style={{ maxHeight: 300 }}>
                {reciters.map((reciter) => (
                  <Menu.Item 
                    key={reciter.id}
                    onPress={() => handleReciterChange(reciter.id)} 
                    title={reciter.name} 
                    titleStyle={{ color: reciterId === reciter.id ? '#8EDCB8' : '#FFFFFF', fontSize: 14 }}
                  />
                ))}
              </ScrollView>
            </React.Fragment>
          )}
        </Menu>
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
      <ScreenContainer scrollable={false} withPadding={false} backgroundImage={require('../../../../assets/backgrounds/quran-background.png')} withGlassGradient={false} withBrandWatermark={false}>
        {renderTopBar()}
        <ReaderLoadingSkeleton />
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer scrollable={false} withPadding={false} backgroundImage={require('../../../../assets/backgrounds/quran-background.png')} withGlassGradient={false} withBrandWatermark={false}>
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

      {audioModeEnabled && (
        <View style={styles.audioControlsContainer}>
           <Pressable onPress={playPreviousAyah} style={styles.audioBtn}>
             <AppIcon name="skip-previous" size={28} color="#FFFFFF" />
           </Pressable>

           <Pressable onPress={handlePlayPause} style={styles.audioBtnMain}>
             {audioStatus === 'loading' ? (
                <ActivityIndicator color="#121212" size="small" />
             ) : (
                <AppIcon name={audioStatus === 'playing' ? "pause" : "play"} size={28} color="#121212" />
             )}
           </Pressable>

           <Pressable onPress={() => playNextAyahRef.current()} style={styles.audioBtn}>
             <AppIcon name="skip-next" size={28} color="#FFFFFF" />
           </Pressable>
        </View>
      )}
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
    backgroundColor: 'rgba(0,0,0,0.35)',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.1)',
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
  },
  audioControlsContainer: {
    position: 'absolute',
    bottom: 90, // Just above ReaderBottomBar (which is height 80)
    alignSelf: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.6)',
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.sm,
    borderRadius: 30,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  audioBtn: {
    padding: spacing.sm,
    marginHorizontal: spacing.sm,
  },
  audioBtnMain: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: '#8EDCB8',
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: spacing.lg,
  },
});
