import { Injectable, Inject } from '@nestjs/common';
import type { QuranProviderInterface } from '../interfaces/quran-provider.interface';
import { Ayah } from '../models/quran.models';

@Injectable()
export class SearchService {
  constructor(
    @Inject('QuranProvider')
    private readonly quranProvider: QuranProviderInterface,
  ) {}

  async searchQuran(query: string): Promise<Ayah[]> {
    return this.quranProvider.search(query);
  }
}
