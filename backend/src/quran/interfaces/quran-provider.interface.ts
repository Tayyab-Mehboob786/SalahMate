import { Surah, Ayah, Page, Juz, Translation, Reciter } from '../models/quran.models';

export interface QuranProviderInterface {
  getSurahs(): Promise<Surah[]>;
  getSurah(id: number): Promise<Surah | null>;
  getPage(pageNumber: number, translationId?: number, reciterId?: number): Promise<Page>;
  getJuz(juzNumber: number, translationId?: number, reciterId?: number): Promise<Juz>;
  getAyahs(surahId: number, from?: number, to?: number): Promise<Ayah[]>;
  search(query: string): Promise<Ayah[]>;
  getTranslations(): Promise<Translation[]>; // To be enhanced with specific IDs
  getAudio(): Promise<Reciter[]>; // Placeholder for audio definitions
}
