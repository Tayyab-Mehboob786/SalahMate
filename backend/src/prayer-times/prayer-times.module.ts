import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { PrayerTimesController } from './controller/prayer-times.controller';
import { PrayerTimesService } from './service/prayer-times.service';
import { AladhanPrayerTimesProvider, PRAYER_TIMES_PROVIDER } from './providers';

@Module({
  imports: [HttpModule],
  controllers: [PrayerTimesController],
  providers: [
    PrayerTimesService,
    {
      provide: PRAYER_TIMES_PROVIDER,
      useClass: AladhanPrayerTimesProvider,
    },
  ],
  exports: [PrayerTimesService],
})
export class PrayerTimesModule {}
