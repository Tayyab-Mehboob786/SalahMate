import { MushafPageData, SurahInfo } from '../types/reader.types';

export class MockQuranProvider {
  private static readonly TOTAL_PAGES = 604;

  static async getPage(pageNumber: number): Promise<MushafPageData> {
    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 500));

    // Fallback bounds
    if (pageNumber < 1) pageNumber = 1;
    if (pageNumber > this.TOTAL_PAGES) pageNumber = this.TOTAL_PAGES;

    const surahs: SurahInfo[] = [];

    // Mock Surah Al-Fatihah (Page 1)
    if (pageNumber === 1) {
      surahs.push({
        id: 1,
        nameArabic: 'الفاتحة',
        nameTranslated: 'The Opening',
        revelationPlace: 'makkah',
        versesCount: 7,
      });

      return {
        pageNumber,
        juzNumber: 1,
        surahs,
        ayahs: [
          { id: 1, surahId: 1, ayahNumber: 1, textArabic: 'بِسْمِ ٱللَّهِ ٱلرَّحْمَـٰنِ ٱلرَّحِيمِ' },
          { id: 2, surahId: 1, ayahNumber: 2, textArabic: 'ٱلْحَمْدُ لِلَّهِ رَبِّ ٱلْعَـٰلَمِينَ' },
          { id: 3, surahId: 1, ayahNumber: 3, textArabic: 'ٱلرَّحْمَـٰنِ ٱلرَّحِيمِ' },
          { id: 4, surahId: 1, ayahNumber: 4, textArabic: 'مَـٰلِكِ يَوْمِ ٱلدِّينِ' },
          { id: 5, surahId: 1, ayahNumber: 5, textArabic: 'إِيَّاكَ نَعْبُدُ وَإِيَّاكَ نَسْتَعِينُ' },
          { id: 6, surahId: 1, ayahNumber: 6, textArabic: 'ٱهْدِنَا ٱلصِّرَٰطَ ٱلْمُسْتَقِيمَ' },
          { id: 7, surahId: 1, ayahNumber: 7, textArabic: 'صِرَٰطَ ٱلَّذِينَ أَنْعَمْتَ عَلَيْهِمْ غَيْرِ ٱلْمَغْضُوبِ عَلَيْهِمْ وَلَا ٱلضَّآلِّينَ' },
        ],
      };
    }

    // Mock Surah Al-Baqarah start (Page 2)
    if (pageNumber === 2) {
      surahs.push({
        id: 2,
        nameArabic: 'البقرة',
        nameTranslated: 'The Cow',
        revelationPlace: 'madinah',
        versesCount: 286,
      });

      return {
        pageNumber,
        juzNumber: 1,
        surahs,
        ayahs: [
          { id: 8, surahId: 2, ayahNumber: 1, textArabic: 'الٓمٓ' },
          { id: 9, surahId: 2, ayahNumber: 2, textArabic: 'ذَٰلِكَ ٱلْكِتَـٰبُ لَا رَيْبَ ۛ فِيهِ ۛ هُدًى لِّلْمُتَّقِينَ' },
          { id: 10, surahId: 2, ayahNumber: 3, textArabic: 'ٱلَّذِينَ يُؤْمِنُونَ بِٱلْغَيْبِ وَيُقِيمُونَ ٱلصَّلَوٰةَ وَمِمَّا رَزَقْنَـٰهُمْ يُنفِقُونَ' },
          { id: 11, surahId: 2, ayahNumber: 4, textArabic: 'وَٱلَّذِينَ يُؤْمِنُونَ بِمَآ أُنزِلَ إِلَيْكَ وَمَآ أُنزِلَ مِن قَبْلِكَ وَبِٱلْـَٔاخِرَةِ هُمْ يُوقِنُونَ' },
          { id: 12, surahId: 2, ayahNumber: 5, textArabic: 'أُو۟لَـٰٓئِكَ عَلَىٰ هُدًى مِّن رَّبِّهِمْ ۖ وَأُو۟لَـٰٓئِكَ هُمُ ٱلْمُفْلِحُونَ' },
        ],
      };
    }

    // Generic fallback for other pages
    surahs.push({
      id: Math.ceil(pageNumber / 5) + 2,
      nameArabic: 'سورة تجريبية',
      nameTranslated: 'Mock Surah',
      revelationPlace: 'makkah',
      versesCount: 50,
    });

    const ayahs = Array.from({ length: 15 }).map((_, i) => ({
      id: pageNumber * 100 + i,
      surahId: surahs[0].id,
      ayahNumber: i + 1,
      textArabic: 'وَهَـٰذَا نَصٌّ تَجْرِيبِيٌّ يُسْتَخْدَمُ لِمَلْءِ الصَّفْحَةِ بَدَلًا مِنَ النَّصِّ الْحَقِيقِيِّ حَتَّى يَكْتَمِلَ التَّصْمِيمُ وَيَتِمَّ الرَّبْطُ.'
    }));

    return {
      pageNumber,
      juzNumber: Math.ceil(pageNumber / 20),
      surahs,
      ayahs,
    };
  }

  static getTotalPages() {
    return this.TOTAL_PAGES;
  }
}
