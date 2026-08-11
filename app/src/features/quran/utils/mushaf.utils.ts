// Standard Madani Mushaf Starting Pages for 114 Surahs
// 1-indexed: SURAH_START_PAGES[surahId - 1] = starting page
export const SURAH_START_PAGES = [
  1, 2, 50, 77, 106, 128, 151, 177, 187, 208, 221, 235, 249, 255, 262, 267, 282, 293, 305, 312, 
  322, 332, 342, 350, 359, 367, 377, 385, 396, 404, 411, 415, 418, 428, 434, 440, 446, 453, 458, 
  467, 477, 483, 489, 496, 499, 502, 507, 511, 515, 518, 520, 523, 526, 528, 531, 534, 537, 542, 
  545, 549, 551, 553, 554, 556, 558, 560, 562, 564, 566, 568, 570, 572, 574, 575, 577, 578, 580, 
  582, 583, 585, 586, 587, 587, 589, 590, 591, 591, 592, 593, 594, 595, 595, 596, 596, 597, 597, 
  598, 598, 599, 599, 600, 600, 601, 601, 601, 602, 602, 602, 603, 603, 603, 604, 604, 604
];

export const getSurahStartPage = (surahId: number): number => {
  if (surahId < 1 || surahId > 114) return 1;
  return SURAH_START_PAGES[surahId - 1];
};

export interface JuzItem {
  juzNumber: number;
  arabicName: string;
  pageStart: number;
  pageEnd: number;
  surahRange: string;
}

export const JUZ_METADATA: JuzItem[] = [
  { juzNumber: 1, arabicName: 'آلم', pageStart: 1, pageEnd: 21, surahRange: 'Al-Fatihah 1 - Al-Baqarah 141' },
  { juzNumber: 2, arabicName: 'سيقول السفهاء', pageStart: 22, pageEnd: 41, surahRange: 'Al-Baqarah 142 - Al-Baqarah 252' },
  { juzNumber: 3, arabicName: 'تلك الرسل', pageStart: 42, pageEnd: 61, surahRange: 'Al-Baqarah 253 - Ali \'Imran 92' },
  { juzNumber: 4, arabicName: 'لن تنالوا', pageStart: 62, pageEnd: 81, surahRange: 'Ali \'Imran 93 - An-Nisa 23' },
  { juzNumber: 5, arabicName: 'والمحصنات', pageStart: 82, pageEnd: 101, surahRange: 'An-Nisa 24 - An-Nisa 147' },
  { juzNumber: 6, arabicName: 'لا يحب الله', pageStart: 102, pageEnd: 121, surahRange: 'An-Nisa 148 - Al-Ma\'idah 81' },
  { juzNumber: 7, arabicName: 'وإذا سمعوا', pageStart: 122, pageEnd: 141, surahRange: 'Al-Ma\'idah 82 - Al-An\'am 110' },
  { juzNumber: 8, arabicName: 'ولو أننا', pageStart: 142, pageEnd: 161, surahRange: 'Al-An\'am 111 - Al-A\'raf 87' },
  { juzNumber: 9, arabicName: 'قال الملأ', pageStart: 162, pageEnd: 181, surahRange: 'Al-A\'raf 88 - Al-Anfal 40' },
  { juzNumber: 10, arabicName: 'واعلموا', pageStart: 182, pageEnd: 201, surahRange: 'Al-Anfal 41 - At-Tawbah 92' },
  { juzNumber: 11, arabicName: 'يعتذرون', pageStart: 202, pageEnd: 221, surahRange: 'At-Tawbah 93 - Hud 5' },
  { juzNumber: 12, arabicName: 'وما من دابة', pageStart: 222, pageEnd: 241, surahRange: 'Hud 6 - Yusuf 52' },
  { juzNumber: 13, arabicName: 'وما أبرئ', pageStart: 242, pageEnd: 261, surahRange: 'Yusuf 53 - Ibrahim 52' },
  { juzNumber: 14, arabicName: 'ربما', pageStart: 262, pageEnd: 281, surahRange: 'Al-Hijr 1 - An-Nahl 128' },
  { juzNumber: 15, arabicName: 'سبحان الذي', pageStart: 282, pageEnd: 301, surahRange: 'Al-Isra 1 - Al-Kahf 74' },
  { juzNumber: 16, arabicName: 'قال ألم', pageStart: 302, pageEnd: 321, surahRange: 'Al-Kahf 75 - Ta-Ha 135' },
  { juzNumber: 17, arabicName: 'اقترب للناس', pageStart: 322, pageEnd: 341, surahRange: 'Al-Anbiya 1 - Al-Hajj 78' },
  { juzNumber: 18, arabicName: 'قد أفلح', pageStart: 342, pageEnd: 361, surahRange: 'Al-Mu\'minun 1 - Al-Furqan 20' },
  { juzNumber: 19, arabicName: 'وقال الذين', pageStart: 362, pageEnd: 381, surahRange: 'Al-Furqan 21 - An-Naml 55' },
  { juzNumber: 20, arabicName: 'فما كان جواب', pageStart: 382, pageEnd: 401, surahRange: 'An-Naml 56 - Al-\'Ankabut 45' },
  { juzNumber: 21, arabicName: 'ولا تجادلوا', pageStart: 402, pageEnd: 421, surahRange: 'Al-\'Ankabut 46 - Al-Ahzab 30' },
  { juzNumber: 22, arabicName: 'ومن يقنت', pageStart: 422, pageEnd: 441, surahRange: 'Al-Ahzab 31 - Ya-Sin 27' },
  { juzNumber: 23, arabicName: 'وما أنزلنا', pageStart: 442, pageEnd: 461, surahRange: 'Ya-Sin 28 - Az-Zumar 31' },
  { juzNumber: 24, arabicName: 'فمن أظلم', pageStart: 462, pageEnd: 481, surahRange: 'Az-Zumar 32 - Fussilat 46' },
  { juzNumber: 25, arabicName: 'إليه يرد', pageStart: 482, pageEnd: 501, surahRange: 'Fussilat 47 - Al-Jathiyah 37' },
  { juzNumber: 26, arabicName: 'حم', pageStart: 502, pageEnd: 521, surahRange: 'Al-Ahqaf 1 - Ad-Dhariyat 30' },
  { juzNumber: 27, arabicName: 'قال فما خطبكم', pageStart: 522, pageEnd: 541, surahRange: 'Ad-Dhariyat 31 - Al-Hadid 29' },
  { juzNumber: 28, arabicName: 'قد سمع الله', pageStart: 542, pageEnd: 561, surahRange: 'Al-Mujadila 1 - At-Tahrim 12' },
  { juzNumber: 29, arabicName: 'تبارك الذي', pageStart: 562, pageEnd: 581, surahRange: 'Al-Mulk 1 - Al-Mursalat 50' },
  { juzNumber: 30, arabicName: 'عم يتساءلون', pageStart: 582, pageEnd: 604, surahRange: 'An-Naba 1 - An-Nas 6' }
];
