export interface PrayerTimes {
  gregorianDate: string;
  hijriDate: string;
  timings: {
    fajr: string;
    sunrise: string;
    dhuhr: string;
    asr: string;
    maghrib: string;
    isha: string;
  };
  timezone: string;
  calculationMethod: string;
}
