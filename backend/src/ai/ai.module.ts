import { Module } from '@nestjs/common';
import { AiController } from './ai.controller';
import { AiService } from './ai.service';
import { ConversationService } from './services/conversation.service';
import { ContextBuilderService } from './services/context-builder.service';
import { PromptBuilderService } from './services/prompt-builder.service';
import { ResponseEngineService } from './services/response-engine.service';
import { DummyAIProvider } from './providers/dummy.provider';
import { UsersModule } from '../users/users.module';
import { PrayersModule } from '../prayers/prayers.module';
import { PrayerTimesModule } from '../prayer-times/prayer-times.module';

@Module({
  imports: [UsersModule, PrayersModule, PrayerTimesModule],
  controllers: [AiController],
  providers: [
    AiService,
    ConversationService,
    ContextBuilderService,
    PromptBuilderService,
    ResponseEngineService,
    DummyAIProvider,
  ],
  exports: [AiService],
})
export class AiModule {}
