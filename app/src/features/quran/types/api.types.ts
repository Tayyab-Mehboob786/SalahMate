export interface ApiSurah {
  id: number;
  nameSimple: string;
  nameArabic: string;
  nameTranslated: string;
  versesCount: number;
  revelationPlace: string;
}

export interface ApiAyah {
  id: number;
  surahId: number;
  verseNumber: number;
  verseKey: string;
  textUthmani: string;
  pageNumber: number;
  juzNumber: number;
  hizbNumber: number;
  translation?: string;
  audioUrl?: string;
}

export interface ApiReciter {
  id: number;
  name: string;
  style: string | null;
}

export interface ApiPage {
  pageNumber: number;
  ayahs: ApiAyah[];
}

export interface ApiJuz {
  juzNumber: number;
  ayahs: ApiAyah[];
}

export interface ApiTranslation {
  id: number;
  name: string;
  authorName: string;
  languageName: string;
}
