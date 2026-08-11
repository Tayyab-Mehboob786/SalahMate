import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { ConfigModule } from '@nestjs/config';
import { QuranController } from './quran.controller';
import { QuranService } from './quran.service';
import { BookmarkService } from './services/bookmark.service';
import { ReaderService } from './services/reader.service';
import { ProgressService } from './services/progress.service';
import { SearchService } from './services/search.service';
import { TranslationService } from './services/translation.service';
import { AudioService } from './services/audio.service';
import { QuranApiProvider } from './providers/quran-api.provider';

@Module({
  imports: [HttpModule, ConfigModule],
  controllers: [QuranController],
  providers: [
    QuranService,
    BookmarkService,
    ReaderService,
    ProgressService,
    SearchService,
    TranslationService,
    AudioService,
    {
      provide: 'QuranProvider',
      useClass: QuranApiProvider,
    },
  ],
  exports: [QuranService],
})
export class QuranModule {}
