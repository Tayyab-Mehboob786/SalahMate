export interface Surah {
  id: number;
  nameSimple: string;
  nameArabic: string;
  nameTranslated: string;
  versesCount: number;
  revelationPlace: 'makkah' | 'madinah';
}

export interface Ayah {
  id: number;
  surahId: number;
  verseNumber: number;
  verseKey: string;
  textUthmani: string;
  pageNumber: number;
  juzNumber: number;
  hizbNumber: number;
}

export interface Page {
  pageNumber: number;
  ayahs: Ayah[];
}

export interface Juz {
  juzNumber: number;
  ayahs: Ayah[];
}

export interface Hizb {
  hizbNumber: number;
  ayahs: Ayah[];
}

export interface Translation {
  id: number;
  languageName: string;
  authorName: string;
  text: string;
  ayahId: number;
}

export interface Reciter {
  id: number;
  name: string;
  style: string;
}

export interface Bookmark {
  id: string;
  userId: string;
  ayahKey: string;
  timestamp: Date;
  note?: string;
}

export interface ReadingProgress {
  userId: string;
  lastReadAyahKey: string;
  lastReadPage: number;
  completedPages: number[];
  completedJuz: number[];
  streakDays: number;
  readingTimeMinutes: number;
  updatedAt: Date;
}
