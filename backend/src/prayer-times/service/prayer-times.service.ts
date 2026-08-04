import { Injectable, Inject } from '@nestjs/common';
import { PRAYER_TIMES_PROVIDER } from '../providers';
import type { PrayerTimesProvider } from '../providers';
import { PrayerTimes } from '../types/prayer-times.type';

@Injectable()
export class PrayerTimesService {
  constructor(
    @Inject(PRAYER_TIMES_PROVIDER)
    private readonly provider: PrayerTimesProvider,
  ) {}

  async getTodayTimings(lat: number, lng: number, method?: number): Promise<PrayerTimes> {
    return this.provider.getTodayPrayerTimes(lat, lng, method);
  }
}
