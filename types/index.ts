export interface PrayerTime {
  fajr: Date;
  sunrise: Date;
  dhuhr: Date;
  asr: Date;
  maghrib: Date;
  isha: Date;
}

export interface PrayerTimeResponse {
  fajr: string;
  sunrise: string;
  dhuhr: string;
  asr: string;
  maghrib: string;
  isha: string;
}

export interface NextPrayer {
  name: string;
  time: string;
  remaining: number;
}

export interface SehriIftar {
  sehri: {
    end: string;
    remaining: number;
  };
  iftar: {
    time: string;
    remaining: number;
  };
}

export interface ServerTimeData {
  serverTime: string;
  prayers: PrayerTimeResponse;
  nextPrayer: NextPrayer;
  sehriIftar: SehriIftar;
  activeUsers: number;
}

export interface QuranProgress {
  juz: number;
  surah: string;
  completed: boolean;
}

export interface DailyAmol {
  id: string;
  name: string;
  completed: boolean;
  category: 'salat' | 'zikr' | 'charity' | 'other';
}

export interface DuaCard {
  id: string;
  title: string;
  arabic: string;
  transliteration: string;
  translation: string;
  context: 'iftar' | 'sehri' | 'general' | 'prayer';
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}
