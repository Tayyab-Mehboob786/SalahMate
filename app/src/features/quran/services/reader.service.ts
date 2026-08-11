import AsyncStorage from '@react-native-async-storage/async-storage';
import { ReadingProgress } from '../types/reader.types';

const PROGRESS_STORAGE_KEY = '@salahmate_reading_progress';

export class ReaderService {
  /**
   * Save the current reading progress
   */
  static async saveProgress(pageNumber: number, surahId: number): Promise<void> {
    try {
      const progress: ReadingProgress = {
        pageNumber,
        surahId,
        timestamp: new Date().toISOString(),
      };
      await AsyncStorage.setItem(PROGRESS_STORAGE_KEY, JSON.stringify(progress));
    } catch (error) {
      console.error('Failed to save reading progress', error);
    }
  }

  /**
   * Get the last saved reading progress
   */
  static async getProgress(): Promise<ReadingProgress | null> {
    try {
      const data = await AsyncStorage.getItem(PROGRESS_STORAGE_KEY);
      if (data) {
        return JSON.parse(data) as ReadingProgress;
      }
    } catch (error) {
      console.error('Failed to get reading progress', error);
    }
    return null;
  }
}
