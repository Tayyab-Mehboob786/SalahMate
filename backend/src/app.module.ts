import { Module, MiddlewareConsumer, NestModule } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { configuration, envValidationSchema } from './config';
import { PrismaModule } from './prisma/prisma.module';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { MailModule } from './mail/mail.module';
import { ThrottlerModule } from '@nestjs/throttler';
import { RequestLoggerMiddleware } from './common/middlewares/request-logger.middleware';
import { PrayersModule } from './prayers/prayers.module';
import { PrayerTimesModule } from './prayer-times/prayer-times.module';
import { AiModule } from './ai/ai.module';
import { QuranModule } from './quran/quran.module';
import { GoalsModule } from './goals/goals.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: configuration,
      validationSchema: envValidationSchema,
      validationOptions: {
        abortEarly: true,
      },
    }),
    PrismaModule,
    UsersModule,
    AuthModule,
    MailModule,
    ThrottlerModule.forRoot([
      {
        ttl: 60000,
        limit: 10,
      },
    ]),
    PrayersModule,
    PrayerTimesModule,
    AiModule,
    QuranModule,
    GoalsModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(RequestLoggerMiddleware).forRoutes('*');
  }
}
