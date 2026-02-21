import { format, isAfter, isBefore, differenceInMilliseconds } from 'date-fns';
import type { PrayerTime, NextPrayer } from '@/types';

export function formatPrayerTime(date: Date): string {
  return format(date, 'h:mm a');
}

export function formatPrayerTime24(date: Date): string {
  return format(date, 'HH:mm');
}

export function getTimeRemaining(targetTime: Date, currentTime: Date = new Date()): {
  hours: number;
  minutes: number;
  seconds: number;
  total: number;
} {
  const total = differenceInMilliseconds(targetTime, currentTime);
  
  if (total <= 0) {
    return { hours: 0, minutes: 0, seconds: 0, total: 0 };
  }
  
  const hours = Math.floor(total / (1000 * 60 * 60));
  const minutes = Math.floor((total % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((total % (1000 * 60)) / 1000);
  
  return { hours, minutes, seconds, total };
}

export function formatTimeRemaining(remaining: number): string {
  if (remaining <= 0) return '00:00:00';
  
  const hours = Math.floor(remaining / (1000 * 60 * 60));
  const minutes = Math.floor((remaining % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((remaining % (1000 * 60)) / 1000);
  
  return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
}

export function getPrayerName(prayer: string): string {
  const names: Record<string, string> = {
    fajr: 'Fajr',
    sunrise: 'Sunrise',
    dhuhr: 'Dhuhr',
    asr: 'Asr',
    maghrib: 'Maghrib',
    isha: 'Isha',
  };
  
  return names[prayer] || prayer;
}

export function getPrayerIcon(prayer: string): string {
  const icons: Record<string, string> = {
    fajr: '🌅',
    sunrise: '☀️',
    dhuhr: '☀️',
    asr: '🌤️',
    maghrib: '🌆',
    isha: '🌙',
  };
  
  return icons[prayer] || '🕌';
}
