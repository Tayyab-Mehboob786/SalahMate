import { Injectable, Inject } from '@nestjs/common';
import type { QuranProviderInterface } from '../interfaces/quran-provider.interface';

@Injectable()
export class AudioService {
  constructor(
    @Inject('QuranProvider')
    private readonly quranProvider: QuranProviderInterface,
  ) {}

  async getAudioFiles(): Promise<any[]> {
    return this.quranProvider.getAudio();
  }
}
