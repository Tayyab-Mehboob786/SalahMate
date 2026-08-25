import { Injectable, Inject } from '@nestjs/common';
import type { QuranProviderInterface } from '../interfaces/quran-provider.interface';
import { Surah, Page, Juz, Ayah } from '../models/quran.models';

const TRANSLATION_MAP: Record<string, number> = {
  'en': 20, // Saheeh International
  'ur': 97, // Tafheem e Qur'an - Syed Abul A'la Maududi
};

@Injectable()
export class ReaderService {
  constructor(
    @Inject('QuranProvider')
    private readonly quranProvider: QuranProviderInterface,
  ) {}

  async getAllSurahs(): Promise<Surah[]> {
    return this.quranProvider.getSurahs();
  }

  async getSurahDetail(surahId: number): Promise<Surah | null> {
    return this.quranProvider.getSurah(surahId);
  }

  async getPage(pageNumber: number, translation?: string, reciterId?: number): Promise<Page> {
    const translationId = translation ? TRANSLATION_MAP[translation] : undefined;
    return this.quranProvider.getPage(pageNumber, translationId, reciterId);
  }

  async getJuz(juzNumber: number, translation?: string, reciterId?: number): Promise<Juz> {
    const translationId = translation ? TRANSLATION_MAP[translation] : undefined;
    return this.quranProvider.getJuz(juzNumber, translationId, reciterId);
  }
}
