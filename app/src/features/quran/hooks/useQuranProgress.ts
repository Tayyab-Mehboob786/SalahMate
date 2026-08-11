import { useState } from 'react';
import { ReadingProgress } from '../types/quran.types';

export const useQuranProgress = () => {
  const [progress, setProgress] = useState<ReadingProgress | null>(null);

  const loadProgress = async () => {
    // Architecture placeholder for loading user progress from backend
  };

  const saveProgress = async (pageNumber: number) => {
    // Architecture placeholder for syncing progress
  };

  return { progress, loadProgress, saveProgress };
};
