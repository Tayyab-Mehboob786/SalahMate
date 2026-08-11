export interface AiContext {
  userName?: string;
  currentPrayer?: string;
  todayCompletion?: number;
  streak?: number;
  missedPrayers?: number;
  location?: string;
  lat?: number;
  lng?: number;
  timezone?: string;
  hijriDate?: string;
  theme?: string;
}
