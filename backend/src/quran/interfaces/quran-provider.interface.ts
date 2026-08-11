import { Surah, Ayah, Page, Juz, Translation } from '../models/quran.models';

export interface QuranProviderInterface {
  getSurahs(): Promise<Surah[]>;
  getSurah(id: number): Promise<Surah | null>;
  getPage(pageNumber: number): Promise<Page>;
  getJuz(juzNumber: number): Promise<Juz>;
  getAyahs(surahId: number, from?: number, to?: number): Promise<Ayah[]>;
  search(query: string): Promise<Ayah[]>;
  getTranslations(): Promise<Translation[]>; // To be enhanced with specific IDs
  getAudio(): Promise<any[]>; // Placeholder for audio definitions
}
