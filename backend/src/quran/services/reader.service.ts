import { Injectable, Inject } from '@nestjs/common';
import type { QuranProviderInterface } from '../interfaces/quran-provider.interface';
import { Surah, Page, Juz, Ayah } from '../models/quran.models';

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

  async getPage(pageNumber: number): Promise<Page> {
    return this.quranProvider.getPage(pageNumber);
  }

  async getJuz(juzNumber: number): Promise<Juz> {
    return this.quranProvider.getJuz(juzNumber);
  }
}
