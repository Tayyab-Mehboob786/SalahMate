import { useState, useEffect, useCallback } from 'react';
import { getPage, getSurahs } from '@/api/quran.api';
import { ReaderService } from '../services/reader.service';
import { MushafPageData, SurahInfo } from '../types/reader.types';

export const useMushafReader = (initialPage: number = 1) => {
  const [currentPage, setCurrentPage] = useState<number>(initialPage);
  const [pagesData, setPagesData] = useState<Record<number, MushafPageData>>({});
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Load a specific page if not already loaded
  const loadPage = useCallback(async (page: number) => {
    if (page < 1 || page > 604) return;
    
    // If we already have it in cache, skip fetching
    if (pagesData[page]) return;

    try {
      const data = await getPage(page);
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
        })),
      };

      setPagesData((prev) => ({ ...prev, [page]: pageData }));
    } catch (error) {
      console.error(`Failed to load page ${page}`, error);
    }
  }, [pagesData]);

  // Initial load
  useEffect(() => {
    const initialize = async () => {
      setIsLoading(true);
      // Load current, next, and previous pages for smooth swiping
      await Promise.all([
        loadPage(initialPage),
        loadPage(initialPage + 1),
        loadPage(initialPage - 1),
      ]);
      setIsLoading(false);
    };
    
    initialize();
  }, [initialPage]);

  // When page changes, load adjacent pages and save progress
  const changePage = useCallback((newPage: number) => {
    if (newPage < 1 || newPage > 604) return;
    
    setCurrentPage(newPage);
    
    // Preload next/prev in background
    loadPage(newPage + 1);
    loadPage(newPage - 1);

    // Save progress using the first Surah ID on the page (if data exists)
    const pageData = pagesData[newPage];
    if (pageData && pageData.surahs.length > 0) {
      ReaderService.saveProgress(newPage, pageData.surahs[0].id);
    }
  }, [pagesData, loadPage]);

  return {
    currentPage,
    changePage,
    pagesData,
    isLoading,
    totalPages: 604,
  };
};
