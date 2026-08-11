import { Injectable } from '@nestjs/common';
import { Bookmark } from '../models/quran.models';

@Injectable()
export class BookmarkService {
  // Architecture only: Would inject PrismaService for persistence

  async getBookmarks(userId: string): Promise<Bookmark[]> {
    return [];
  }

  async addBookmark(userId: string, ayahKey: string, note?: string): Promise<Bookmark> {
    return {
      id: 'mock-uuid',
      userId,
      ayahKey,
      timestamp: new Date(),
      note,
    };
  }

  async removeBookmark(userId: string, bookmarkId: string): Promise<void> {
    // mock delete
  }
}
