import {
  Injectable,
  ConflictException,
  NotFoundException,
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreatePrayerLogDto } from './dto/create-prayer-log.dto';
import { UpdatePrayerLogDto } from './dto/update-prayer-log.dto';
import { PaginationDto } from './dto/pagination.dto';
import { PrayerStatus } from '@prisma/client';

@Injectable()
export class PrayersService {
  constructor(private prisma: PrismaService) {}

  private getTodayString(): string {
    const today = new Date();
    return today.toISOString().split('T')[0];
  }

  async create(userId: string, createPrayerLogDto: CreatePrayerLogDto) {
    let { prayer, status, date } = createPrayerLogDto;
    const logDate = date || this.getTodayString();
    const todayStr = this.getTodayString();

    if (logDate > todayStr) {
      throw new BadRequestException('Cannot log a prayer for a future date.');
    }

    // If attempting to log COMPLETED for a past date, convert status to QADA
    if (status === PrayerStatus.COMPLETED && logDate < todayStr) {
      status = PrayerStatus.QADA;
    }

    const prayedAt = (status === PrayerStatus.COMPLETED || status === PrayerStatus.QADA) ? new Date() : null;

    try {
      return await this.prisma.prayerLog.create({
        data: {
          userId,
          prayer,
          status,
          date: logDate,
          prayedAt,
        },
      });
    } catch (error) {
      if (
        error &&
        typeof error === 'object' &&
        'code' in error &&
        (error as any).code === 'P2002'
      ) {
        throw new ConflictException(
          `Prayer log for ${prayer} on ${logDate} already exists.`,
        );
      }
      console.error('Prisma Create Error:', error);
      throw new InternalServerErrorException('Failed to create prayer log');
    }
  }

  async getToday(userId: string) {
    const today = this.getTodayString();
    return this.prisma.prayerLog.findMany({
      where: {
        userId,
        date: today,
      },
      orderBy: {
        prayer: 'asc',
      },
    });
  }

  async getHistory(userId: string, paginationDto: PaginationDto) {
    const { page = 1, limit = 7 } = paginationDto;

    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { createdAt: true }
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const todayStr = this.getTodayString();
    const current = new Date(todayStr);
    const joinStr = user.createdAt.toISOString().split('T')[0];
    const join = new Date(joinStr);

    let totalDates = Math.floor((current.getTime() - join.getTime()) / (1000 * 60 * 60 * 24)) + 1;
    if (totalDates < 1) totalDates = 1;

    const dateStrings: string[] = [];
    const startIndex = (page - 1) * limit;

    for (let i = 0; i < limit; i++) {
      const dateOffset = startIndex + i;
      if (dateOffset >= totalDates) break;

      const d = new Date(current);
      d.setDate(d.getDate() - dateOffset);
      dateStrings.push(d.toISOString().split('T')[0]);
    }

    // 3. Fetch logs for these dates
    const logs = dateStrings.length > 0 ? await this.prisma.prayerLog.findMany({
      where: {
        userId,
        date: { in: dateStrings },
      },
    }) : [];

    // 4. Group by date
    const historyMap = new Map<string, any>();
    
    // Initialize map
    for (const d of dateStrings) {
      const isPastDate = d < todayStr;
      historyMap.set(d, {
        date: d,
        completedCount: 0,
        totalCount: 5,
        percentage: 0,
        statuses: {
          FAJR: isPastDate ? PrayerStatus.MISSED : null,
          DHUHR: isPastDate ? PrayerStatus.MISSED : null,
          ASR: isPastDate ? PrayerStatus.MISSED : null,
          MAGHRIB: isPastDate ? PrayerStatus.MISSED : null,
          ISHA: isPastDate ? PrayerStatus.MISSED : null,
        },
      });
    }

    // Populate data
    for (const log of logs) {
      const entry = historyMap.get(log.date);
      if (entry) {
        entry.statuses[log.prayer] = log.status;
        if (log.status === PrayerStatus.COMPLETED || log.status === PrayerStatus.QADA) {
          entry.completedCount++;
        }
      }
    }

    // Calculate percentage and convert to array
    const data = Array.from(historyMap.values()).map(entry => {
      entry.percentage = Math.round((entry.completedCount / entry.totalCount) * 100);
      return entry;
    });

    return {
      data,
      meta: {
        total: totalDates,
        page,
        limit,
        totalPages: Math.ceil(totalDates / limit),
      },
    };
  }

  async getStreak(userId: string) {
    const logs = await this.prisma.prayerLog.findMany({
      where: {
        userId,
        status: { in: [PrayerStatus.COMPLETED, PrayerStatus.QADA] },
      },
      select: { date: true },
    });

    const dateCounts = logs.reduce((acc, log) => {
      acc[log.date] = (acc[log.date] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const perfectDates = Object.keys(dateCounts)
      .filter((date) => dateCounts[date] === 5)
      .sort((a, b) => b.localeCompare(a)); // Descending order (newest first)

    let currentStreak = 0;
    let longestStreak = 0;

    // Calculate longest streak
    if (perfectDates.length > 0) {
      let tempStreak = 1;
      longestStreak = 1;
      for (let i = 0; i < perfectDates.length - 1; i++) {
        const d1 = new Date(perfectDates[i]);
        const d2 = new Date(perfectDates[i + 1]);
        const diffTime = Math.abs(d1.getTime() - d2.getTime());
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        if (diffDays === 1) {
          tempStreak++;
          if (tempStreak > longestStreak) {
            longestStreak = tempStreak;
          }
        } else {
          tempStreak = 1;
        }
      }
    }

    // Calculate current streak
    const today = this.getTodayString();
    const yesterdayDate = new Date();
    yesterdayDate.setDate(yesterdayDate.getDate() - 1);
    const yesterday = yesterdayDate.toISOString().split('T')[0];

    const isTodayPerfect = perfectDates.includes(today);
    const isYesterdayPerfect = perfectDates.includes(yesterday);

    let streakStatus = 'INACTIVE';
    if (isTodayPerfect || isYesterdayPerfect) {
      let checkDate = isTodayPerfect ? new Date() : yesterdayDate;
      
      while (true) {
        const dateStr = checkDate.toISOString().split('T')[0];
        if (perfectDates.includes(dateStr)) {
          currentStreak++;
          checkDate.setDate(checkDate.getDate() - 1);
        } else {
          break;
        }
      }

      streakStatus = isTodayPerfect ? 'ACTIVE' : 'AT_RISK';
    }
    
    longestStreak = Math.max(longestStreak, currentStreak);

    // Calculate weekly consistency
    const last7Days: string[] = [];
    for (let i = 0; i < 7; i++) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      last7Days.push(d.toISOString().split('T')[0]);
    }
    const perfectDaysInWeek = last7Days.filter((d) => perfectDates.includes(d)).length;
    const weeklyConsistency = Math.round((perfectDaysInWeek / 7) * 100);

    return {
      currentStreak,
      longestStreak,
      perfectDays: perfectDates.length,
      weeklyConsistency,
      streakStatus,
    };
  }

  async update(
    id: string,
    userId: string,
    updatePrayerLogDto: UpdatePrayerLogDto,
  ) {
    const existing = await this.prisma.prayerLog.findUnique({
      where: { id },
    });

    if (!existing || existing.userId !== userId) {
      throw new NotFoundException('Prayer log not found');
    }

    const { status } = updatePrayerLogDto;
    let prayedAt = existing.prayedAt;

    // Update prayedAt if status is changing to COMPLETED and it wasn't before
    if (
      status === PrayerStatus.COMPLETED &&
      existing.status !== PrayerStatus.COMPLETED
    ) {
      prayedAt = new Date();
    } else if (status !== PrayerStatus.COMPLETED) {
      prayedAt = null;
    }

    return this.prisma.prayerLog.update({
      where: { id },
      data: {
        status,
        prayedAt,
      },
    });
  }

  async remove(id: string, userId: string) {
    const existing = await this.prisma.prayerLog.findUnique({
      where: { id },
    });

    if (!existing || existing.userId !== userId) {
      throw new NotFoundException('Prayer log not found');
    }

    return this.prisma.prayerLog.delete({
      where: { id },
    });
  }

  async getAnalytics(userId: string, period: string) {
    const streakData = await this.getStreak(userId);

    let startDate: Date;
    const endDate = new Date();
    // Normalize end date to local timezone safely or just use current time for date math
    endDate.setHours(23, 59, 59, 999);
    
    let daysInPeriod = 7;

    if (period === '7d') {
      startDate = new Date();
      startDate.setDate(startDate.getDate() - 6);
      daysInPeriod = 7;
    } else if (period === '30d') {
      startDate = new Date();
      startDate.setDate(startDate.getDate() - 29);
      daysInPeriod = 30;
    } else if (period === '90d') {
      startDate = new Date();
      startDate.setDate(startDate.getDate() - 89);
      daysInPeriod = 90;
    } else {
      const firstLog = await this.prisma.prayerLog.findFirst({
        where: { userId },
        orderBy: { date: 'asc' },
      });
      if (firstLog) {
        startDate = new Date(firstLog.date);
        const diffTime = Math.abs(endDate.getTime() - startDate.getTime());
        daysInPeriod = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) || 1;
      } else {
        startDate = new Date();
        daysInPeriod = 1;
      }
    }
    
    const startStr = startDate.toISOString().split('T')[0];
    const endStr = endDate.toISOString().split('T')[0];

    const logs = await this.prisma.prayerLog.findMany({
      where: {
        userId,
        date: {
          gte: startStr,
          lte: endStr,
        }
      },
    });

    const totalPossible = daysInPeriod * 5;
    const completedOrQada = logs.filter(l => l.status === PrayerStatus.COMPLETED || l.status === PrayerStatus.QADA).length;
    const overallCompletion = totalPossible > 0 ? Math.round((completedOrQada / totalPossible) * 100) : 0;

    const prayerCounts = { FAJR: 0, DHUHR: 0, ASR: 0, MAGHRIB: 0, ISHA: 0 };
    for (const log of logs) {
      if (log.status === PrayerStatus.COMPLETED || log.status === PrayerStatus.QADA) {
        prayerCounts[log.prayer]++;
      }
    }
    const prayerPerformance = [
      { prayer: 'Fajr', percentage: Math.round((prayerCounts.FAJR / daysInPeriod) * 100) || 0 },
      { prayer: 'Dhuhr', percentage: Math.round((prayerCounts.DHUHR / daysInPeriod) * 100) || 0 },
      { prayer: 'Asr', percentage: Math.round((prayerCounts.ASR / daysInPeriod) * 100) || 0 },
      { prayer: 'Maghrib', percentage: Math.round((prayerCounts.MAGHRIB / daysInPeriod) * 100) || 0 },
      { prayer: 'Isha', percentage: Math.round((prayerCounts.ISHA / daysInPeriod) * 100) || 0 },
    ];

    let monthlyTrend: { label: string; value: number; fullDate?: string }[] = [];
    
    if (daysInPeriod <= 30) {
      const dailyMap = new Map<string, number>();
      for (let i = 0; i < daysInPeriod; i++) {
        const d = new Date(startDate);
        d.setDate(d.getDate() + i);
        dailyMap.set(d.toISOString().split('T')[0], 0);
      }

      for (const log of logs) {
        if (dailyMap.has(log.date) && (log.status === PrayerStatus.COMPLETED || log.status === PrayerStatus.QADA)) {
          dailyMap.set(log.date, dailyMap.get(log.date)! + 1);
        }
      }

      for (const [date, count] of dailyMap.entries()) {
        const shortDate = date.split('-').slice(1).join('/');
        monthlyTrend.push({ label: shortDate, value: Math.round((count / 5) * 100), fullDate: date });
      }
    } else {
      const weekMap = new Map<string, { count: number, total: number }>();
      
      let currentDate = new Date(startDate);
      while (currentDate <= endDate) {
        const diff = Math.floor((currentDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
        const weekNum = Math.floor(diff / 7) + 1;
        const currentWeekLabel = `W${weekNum}`;
        
        if (!weekMap.has(currentWeekLabel)) {
          weekMap.set(currentWeekLabel, { count: 0, total: 0 });
        }
        weekMap.get(currentWeekLabel)!.total += 5;
        currentDate.setDate(currentDate.getDate() + 1);
      }

      for (const log of logs) {
         const logD = new Date(log.date);
         const diff = Math.floor((logD.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
         const w = Math.floor(diff / 7) + 1;
         const label = `W${w}`;
         if (weekMap.has(label) && (log.status === PrayerStatus.COMPLETED || log.status === PrayerStatus.QADA)) {
            weekMap.get(label)!.count += 1;
         }
      }

      for (const [label, data] of weekMap.entries()) {
        monthlyTrend.push({
          label,
          value: data.total > 0 ? Math.round((data.count / data.total) * 100) : 0,
        });
      }
    }

    return {
      overallCompletion,
      currentStreak: streakData.currentStreak,
      longestStreak: streakData.longestStreak,
      perfectDays: streakData.perfectDays,
      weeklyCompletion: streakData.weeklyConsistency,
      prayerPerformance,
      monthlyTrend,
    };
  }
}
