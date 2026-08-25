import { useState, useEffect, useCallback, useRef } from 'react';
import { getPage, getSurahs } from '@/api/quran.api';
import { ReaderService } from '../services/reader.service';
import { MushafPageData, SurahInfo } from '../types/reader.types';

export const useMushafReader = (initialPage: number = 1, translation?: string, reciterId?: number) => {
  const [currentPage, setCurrentPage] = useState<number>(initialPage);
  const [pagesData, setPagesData] = useState<Record<number, MushafPageData>>({});
  const [isLoading, setIsLoading] = useState<boolean>(true);
  
  const pagesDataRef = useRef(pagesData);
  useEffect(() => {
    pagesDataRef.current = pagesData;
  }, [pagesData]);

  // Load a specific page if not already loaded
  const loadPage = useCallback(async (page: number) => {
    if (page < 1 || page > 604) return;
    
    // If we already have it in cache, skip fetching
    if (pagesDataRef.current[page]) return;

    try {
      const data = await getPage(page, translation, reciterId);
      const allSurahs = await getSurahs();

      // Extract unique surahs in this page
      const surahIds = Array.from(new Set(data.ayahs.map(a => a.surahId)));
      const surahs: SurahInfo[] = surahIds.map(id => {
        const s = allSurahs.find(x => x.id === id);
        return {
          id: s!.id,
          nameArabic: s!.nameArabic,
          nameTranslated: s!.nameTranslated,
          revelationPlace: s!.revelationPlace as any,
          versesCount: s!.versesCount,
        };
      });

      const pageData: MushafPageData = {
        pageNumber: data.pageNumber,
        juzNumber: data.ayahs[0]?.juzNumber || 1,
        surahs,
        ayahs: data.ayahs.map(a => ({
          id: a.id,
          surahId: a.surahId,
          ayahNumber: a.verseNumber,
          textArabic: a.textUthmani,
          translation: a.translation,
          audioUrl: a.audioUrl,
        })),
      };

      setPagesData((prev) => ({ ...prev, [page]: pageData }));
    } catch (error) {
      console.error(`Failed to load page ${page}`, error);
    }
  }, [translation, reciterId]);

  // Handle translation or reciter change
  useEffect(() => {
    setPagesData({}); // Clear cache on changes
    pagesDataRef.current = {}; // Also clear ref immediately
    const initialize = async () => {
      setIsLoading(true);
      // Load current, next, and previous pages for smooth swiping
      await Promise.all([
        loadPage(currentPage),
        loadPage(currentPage + 1),
        loadPage(currentPage - 1),
      ]);
      setIsLoading(false);
    };
    
    initialize();
  }, [translation, reciterId, loadPage]); // Re-run when dependencies change

  // Initial load
  useEffect(() => {
    // Only run this specifically for initial page load if needed, 
    // but the translation useEffect will catch the first mount anyway because `translation` will be evaluated.
    // Wait, the above useEffect will run on mount, but it uses `currentPage`. 
    // So we don't need a separate mount useEffect if we merge them, but to be safe:
  }, [initialPage]);

  // When page changes, load adjacent pages and save progress
  const changePage = useCallback((newPage: number) => {
    if (newPage < 1 || newPage > 604) return;
    
    setCurrentPage(newPage);
    
    // Preload next/prev in background
    loadPage(newPage + 1);
    loadPage(newPage - 1);

    // Save progress using the first Surah ID on the page (if data exists)
    const pageData = pagesDataRef.current[newPage];
    if (pageData && pageData.surahs.length > 0) {
      ReaderService.saveProgress(newPage, pageData.surahs[0].id);
    }
  }, [loadPage]);

  return {
    currentPage,
    changePage,
    pagesData,
    isLoading,
    totalPages: 604,
  };
};
