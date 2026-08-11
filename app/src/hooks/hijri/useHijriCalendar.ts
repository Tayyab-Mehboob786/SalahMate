import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useSettings } from '@/context';

export interface HijriDayData {
  hijri: {
    date: string;
    day: string;
    weekday: { en: string; ar: string };
    month: { number: number; en: string; ar: string };
    year: string;
    holidays: string[];
  };
  gregorian: {
    date: string;
    day: string;
    weekday: { en: string };
    month: { number: number; en: string };
    year: string;
  };
}

export function useHijriCalendar() {
  const { settings } = useSettings();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [monthData, setMonthData] = useState<HijriDayData[]>([]);
  
  const [currentHijriMonth, setCurrentHijriMonth] = useState<number | null>(null);
  const [currentHijriYear, setCurrentHijriYear] = useState<number | null>(null);
  
  const [todayHijriStr, setTodayHijriStr] = useState<string>('');

  const fetchTodayHijri = useCallback(async () => {
    try {
      const today = new Date();
      const dd = String(today.getDate()).padStart(2, '0');
      const mm = String(today.getMonth() + 1).padStart(2, '0');
      const yyyy = today.getFullYear();
      
      const res = await axios.get(`http://api.aladhan.com/v1/gToH/${dd}-${mm}-${yyyy}?adjustment=${settings.hijriAdjustment}`);
      const data = res.data.data;
      const hMonth = data.hijri.month.number;
      const hYear = parseInt(data.hijri.year, 10);
      
      setCurrentHijriMonth(hMonth);
      setCurrentHijriYear(hYear);
      setTodayHijriStr(data.hijri.date); // e.g. "03-01-1448"
    } catch(e) {
      console.error(e);
      // Fallback
      setCurrentHijriMonth(1);
      setCurrentHijriYear(1446);
    }
  }, [settings.hijriAdjustment]);

  const fetchCalendar = useCallback(async (month: number, year: number) => {
    setLoading(true);
    setError(false);
    try {
      const res = await axios.get(`http://api.aladhan.com/v1/hToGCalendar/${month}/${year}?adjustment=${settings.hijriAdjustment}`);
      setMonthData(res.data.data);
    } catch(e) {
      console.error(e);
      setError(true);
    } finally {
      setLoading(false);
    }
  }, [settings.hijriAdjustment]);

  useEffect(() => {
    if (currentHijriMonth === null) {
      fetchTodayHijri();
    }
  }, [fetchTodayHijri, currentHijriMonth]);

  useEffect(() => {
    if (currentHijriMonth !== null && currentHijriYear !== null) {
      fetchCalendar(currentHijriMonth, currentHijriYear);
    }
  }, [currentHijriMonth, currentHijriYear, fetchCalendar]);

  const nextMonth = () => {
    if (currentHijriMonth === 12) {
      setCurrentHijriMonth(1);
      setCurrentHijriYear(y => (y ? y + 1 : 1446));
    } else {
      setCurrentHijriMonth(m => (m ? m + 1 : 1));
    }
  };

  const prevMonth = () => {
    if (currentHijriMonth === 1) {
      setCurrentHijriMonth(12);
      setCurrentHijriYear(y => (y ? y - 1 : 1446));
    } else {
      setCurrentHijriMonth(m => (m ? m - 1 : 12));
    }
  };

  return {
    monthData,
    loading,
    error,
    currentHijriMonth,
    currentHijriYear,
    todayHijriStr,
    nextMonth,
    prevMonth,
  };
}
