import { Injectable, Inject } from '@nestjs/common';
import type { QuranProviderInterface } from '../interfaces/quran-provider.interface';
import { Translation } from '../models/quran.models';

@Injectable()
export class TranslationService {
  constructor(
    @Inject('QuranProvider')
    private readonly quranProvider: QuranProviderInterface,
  ) {}

  async getAvailableTranslations(): Promise<Translation[]> {
    return this.quranProvider.getTranslations();
  }
}
