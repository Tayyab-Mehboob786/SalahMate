import { Injectable } from '@nestjs/common';
import { UsersService } from '../../users/users.service';
import { PrayersService } from '../../prayers/prayers.service';
import { PrayerTimesService } from '../../prayer-times/service/prayer-times.service';

@Injectable()
export class ContextBuilderService {
  constructor(
    private readonly usersService: UsersService,
    private readonly prayersService: PrayersService,
    private readonly prayerTimesService: PrayerTimesService,
  ) {}

  async buildContext(userId: string, clientContext?: Record<string, any>): Promise<Record<string, any>> {
    const user = await this.usersService.findByIdSafe(userId);
    const todayPrayers = await this.prayersService.getToday(userId);
    const streak = await this.prayersService.getStreak(userId);

    const completedPrayers = todayPrayers.filter(p => p.status === 'COMPLETED').map(p => p.prayer);
    const missedPrayers = todayPrayers.filter(p => p.status === 'MISSED').map(p => p.prayer);
    const todayCompletion = completedPrayers.length;
    const completionPercentage = Math.round((todayCompletion / 5) * 100);

    let currentPrayer = 'Unknown';
    let nextPrayer = 'Unknown';
    let hijriDate = clientContext?.hijriDate || 'Unknown';
    let gregorianDate = clientContext?.gregorianDate || new Date().toISOString().split('T')[0];
    let timeOfDay = 'Day';

    if (clientContext?.lat && clientContext?.lng) {
      try {
        const timings = await this.prayerTimesService.getTodayTimings(clientContext.lat, clientContext.lng);
        hijriDate = timings.hijriDate;
        gregorianDate = timings.gregorianDate;

        const now = new Date();
        const currentHour = now.getHours();
        const currentMinute = now.getMinutes();
        const currentTotalMinutes = currentHour * 60 + currentMinute;

        const parseTime = (timeStr: string) => {
          const [h, m] = timeStr.split(':').map(Number);
          return h * 60 + m;
        };

        const tFajr = parseTime(timings.timings.fajr);
        const tSunrise = parseTime(timings.timings.sunrise);
        const tDhuhr = parseTime(timings.timings.dhuhr);
        const tAsr = parseTime(timings.timings.asr);
        const tMaghrib = parseTime(timings.timings.maghrib);
        const tIsha = parseTime(timings.timings.isha);

        if (currentTotalMinutes < tFajr) {
          currentPrayer = 'Isha';
          nextPrayer = 'Fajr';
          timeOfDay = 'Late Night';
        } else if (currentTotalMinutes < tSunrise) {
          currentPrayer = 'Fajr';
          nextPrayer = 'Dhuhr';
          timeOfDay = 'Dawn';
        } else if (currentTotalMinutes < tDhuhr) {
          currentPrayer = 'Sunrise';
          nextPrayer = 'Dhuhr';
          timeOfDay = 'Morning';
        } else if (currentTotalMinutes < tAsr) {
          currentPrayer = 'Dhuhr';
          nextPrayer = 'Asr';
          timeOfDay = 'Afternoon';
        } else if (currentTotalMinutes < tMaghrib) {
          currentPrayer = 'Asr';
          nextPrayer = 'Maghrib';
          timeOfDay = 'Late Afternoon';
        } else if (currentTotalMinutes < tIsha) {
          currentPrayer = 'Maghrib';
          nextPrayer = 'Isha';
          timeOfDay = 'Evening';
        } else {
          currentPrayer = 'Isha';
          nextPrayer = 'Fajr';
          timeOfDay = 'Night';
        }
      } catch (e) {
        console.error('Failed to fetch timings in ContextBuilder', e);
      }
    }

    // Attempt to determine late night
    const currentHour = new Date().getHours();
    if (currentHour >= 22 || currentHour < 3) {
      timeOfDay = 'Late Night';
    }

    return {
      userName: user?.fullName || 'User',
      location: user?.city ? `${user.city}, ${user.country}` : 'Unknown',
      currentPrayer: clientContext?.currentPrayer || currentPrayer,
      nextPrayer: clientContext?.nextPrayer || nextPrayer,
      streak: streak.currentStreak || 0,
      todayCompletion,
      completedPrayers,
      missedPrayers,
      completionPercentage,
      hijriDate,
      gregorianDate,
      timeOfDay,
      currentTime: new Date().toISOString(),
      theme: user?.theme || 'system',
      ...clientContext,
    };
  }
}
