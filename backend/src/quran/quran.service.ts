import { Injectable } from '@nestjs/common';
import { BookmarkService } from './services/bookmark.service';
import { ReaderService } from './services/reader.service';
import { ProgressService } from './services/progress.service';
import { SearchService } from './services/search.service';
import { TranslationService } from './services/translation.service';
import { AudioService } from './services/audio.service';

@Injectable()
export class QuranService {
  constructor(
    public readonly bookmarkService: BookmarkService,
    public readonly readerService: ReaderService,
    public readonly progressService: ProgressService,
    public readonly searchService: SearchService,
    public readonly translationService: TranslationService,
    public readonly audioService: AudioService,
  ) {}

  // The orchestrator facades the sub-services to provide a unified API 
  // for the controller, while keeping business logic separate.
}
