export interface Ayah {
  id: number;
  surahId: number;
  ayahNumber: number;
  textArabic: string;
  translation?: string;
  audioUrl?: string;
}

export interface SurahInfo {
  id: number;
  nameArabic: string;
  nameTranslated: string;
  revelationPlace: 'makkah' | 'madinah';
  versesCount: number;
}

export interface MushafPageData {
  pageNumber: number;
  juzNumber: number;
  surahs: SurahInfo[];
  ayahs: Ayah[];
}

export interface ReadingProgress {
  pageNumber: number;
  surahId: number;
  timestamp: string;
}
