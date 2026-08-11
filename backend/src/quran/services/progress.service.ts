import { Injectable } from '@nestjs/common';
import { ReadingProgress } from '../models/quran.models';

@Injectable()
export class ProgressService {
  // Architecture only: Would interact with persistence layer (e.g. Prisma)

  async getProgress(userId: string): Promise<ReadingProgress> {
    return {
      userId,
      lastReadAyahKey: '1:1',
      lastReadPage: 1,
      completedPages: [],
      completedJuz: [],
      streakDays: 0,
      readingTimeMinutes: 0,
      updatedAt: new Date(),
    };
  }

  async updateLastRead(userId: string, ayahKey: string, pageNumber: number): Promise<void> {
    // update mock
  }

  async addReadingTime(userId: string, minutes: number): Promise<void> {
    // update mock
  }

  async markPageCompleted(userId: string, pageNumber: number): Promise<void> {
    // update mock
  }
}
