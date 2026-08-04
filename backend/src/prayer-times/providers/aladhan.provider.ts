import { Injectable, HttpException, HttpStatus, Logger } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { PrayerTimesProvider } from './prayer-times-provider.interface';
import { PrayerTimes } from '../types/prayer-times.type';

@Injectable()
export class AladhanPrayerTimesProvider implements PrayerTimesProvider {
  private readonly logger = new Logger(AladhanPrayerTimesProvider.name);

  constructor(private readonly httpService: HttpService) {}

  async getTodayPrayerTimes(lat: number, lng: number, method = 1): Promise<PrayerTimes> {
    try {
      const url = `http://api.aladhan.com/v1/timings?latitude=${lat}&longitude=${lng}&method=${method}`;
      
      const response = await firstValueFrom(this.httpService.get(url, { timeout: 5000 }));
      const responseData = response.data;

      if (!responseData || responseData.code !== 200 || !responseData.data) {
        throw new HttpException('Invalid response from Aladhan API', HttpStatus.BAD_GATEWAY);
      }

      const data = responseData.data;
      const timings = data.timings;
      const date = data.date;

      return {
        gregorianDate: date.gregorian.date,
        hijriDate: `${date.hijri.day} ${date.hijri.month.en} ${date.hijri.year} AH`,
        timings: {
          fajr: timings.Fajr,
          sunrise: timings.Sunrise,
          dhuhr: timings.Dhuhr,
          asr: timings.Asr,
          maghrib: timings.Maghrib,
          isha: timings.Isha,
        },
        timezone: data.meta.timezone,
        calculationMethod: data.meta.method?.name || 'Unknown',
      };
    } catch (error: any) {
      this.logger.error(`Failed to fetch prayer times: ${error.message}`);
      
      if (error instanceof HttpException) {
        throw error;
      }
      
      throw new HttpException(
        'Prayer Times service is currently unavailable',
        HttpStatus.BAD_GATEWAY,
      );
    }
  }
}
