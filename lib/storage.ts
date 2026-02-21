// LocalStorage utilities for guest users

export const StorageKeys = {
  QURAN_PROGRESS: 'noor_ramadan_quran_progress',
  DAILY_AMOL: 'noor_ramadan_daily_amol',
  USER_PREFERENCES: 'noor_ramadan_preferences',
} as const;

export function getStorageItem<T>(key: string, defaultValue: T): T {
  if (typeof window === 'undefined') return defaultValue;
  
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch (error) {
    console.error(`Error reading from localStorage key "${key}":`, error);
    return defaultValue;
  }
}

export function setStorageItem<T>(key: string, value: T): void {
  if (typeof window === 'undefined') return;
  
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error(`Error writing to localStorage key "${key}":`, error);
  }
}

export function removeStorageItem(key: string): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(key);
}

export function clearStorage(): void {
  if (typeof window === 'undefined') return;
  Object.values(StorageKeys).forEach(key => localStorage.removeItem(key));
}
