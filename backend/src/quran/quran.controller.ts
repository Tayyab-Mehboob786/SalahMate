import { Controller, Get, Param, Query, ParseIntPipe, BadRequestException } from '@nestjs/common';
import { QuranService } from './quran.service';

@Controller('quran')
export class QuranController {
  constructor(private readonly quranService: QuranService) {}

  @Get('surahs')
  async getSurahs() {
    return this.quranService.readerService.getAllSurahs();
  }

  @Get('surah/:id')
  async getSurah(@Param('id') id: string) {
    return this.quranService.readerService.getSurahDetail(Number(id));
  }

  @Get('page/:number')
  async getPage(@Param('number', ParseIntPipe) pageNumber: number) {
    if (pageNumber < 1 || pageNumber > 604) {
      throw new BadRequestException('Page number must be between 1 and 604');
    }
    return this.quranService.readerService.getPage(pageNumber);
  }

  @Get('juz/:number')
  async getJuz(@Param('number', ParseIntPipe) juzNumber: number) {
    if (juzNumber < 1 || juzNumber > 30) {
      throw new BadRequestException('Juz number must be between 1 and 30');
    }
    return this.quranService.readerService.getJuz(juzNumber);
  }

  @Get('search')
  async search(@Query('q') query: string) {
    return this.quranService.searchService.searchQuran(query);
  }

  @Get('translations')
  async getTranslations() {
    return this.quranService.translationService.getAvailableTranslations();
  }

  @Get('audio')
  async getAudio() {
    return this.quranService.audioService.getAudioFiles();
  }
}
