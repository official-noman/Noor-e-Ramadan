'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Card from '@/components/common/card';
import { getStorageItem, setStorageItem, StorageKeys } from '@/lib/storage';

interface SalatItem {
  id: string;
  name: string;
  time: string;
  completed: boolean;
  icon: string;
}

const SALAT_LIST: SalatItem[] = [
  { id: 'fajr', name: 'Fajr', time: 'Dawn', icon: '🌅' },
  { id: 'dhuhr', name: 'Dhuhr', time: 'Noon', icon: '☀️' },
  { id: 'asr', name: 'Asr', time: 'Afternoon', icon: '🌤️' },
  { id: 'maghrib', name: 'Maghrib', time: 'Sunset', icon: '🌆' },
  { id: 'isha', name: 'Isha', time: 'Night', icon: '🌙' },
];

export default function SalatChecklist() {
  const getTodayKey = () => {
    const today = new Date();
    return `${StorageKeys.DAILY_AMOL}_${today.toDateString()}`;
  };

  const [salatList, setSalatList] = useState<SalatItem[]>(() => {
    const saved = getStorageItem<SalatItem[]>(getTodayKey(), SALAT_LIST);
    // Reset if it's a new day
    const savedDate = localStorage.getItem(`${StorageKeys.DAILY_AMOL}_date`);
    const today = new Date().toDateString();
    
    if (savedDate !== today) {
      // New day - reset all
      const reset = SALAT_LIST.map(s => ({ ...s, completed: false }));
      setStorageItem(getTodayKey(), reset);
      localStorage.setItem(`${StorageKeys.DAILY_AMOL}_date`, today);
      return reset;
    }
    
    return saved;
  });

  useEffect(() => {
    setStorageItem(getTodayKey(), salatList);
  }, [salatList]);

  const toggleSalat = (id: string) => {
    setSalatList(prev =>
      prev.map(item =>
        item.id === id
          ? { ...item, completed: !item.completed }
          : item
      )
    );
  };

  const completedCount = salatList.filter(s => s.completed).length;
  const percentage = (completedCount / SALAT_LIST.length) * 100;

  return (
    <Card>
      <h2 className="text-2xl font-bold mb-4 text-center text-islamic-gold">🕌 Daily Salat Checklist</h2>
      
      {/* Progress */}
      <div className="mb-6">
        <div className="flex justify-between mb-2">
          <span className="text-sm text-islamic-white/70">
            Today: {completedCount} / {SALAT_LIST.length}
          </span>
          <span className="text-sm font-bold text-islamic-gold">
            {Math.round(percentage)}%
          </span>
        </div>
        <div className="w-full bg-islamic-green-dark rounded-full h-3 overflow-hidden">
          <motion.div
            className="bg-islamic-gold h-full"
            initial={{ width: 0 }}
            animate={{ width: `${percentage}%` }}
            transition={{ duration: 0.5 }}
          />
        </div>
      </div>

      {/* Salat List */}
      <div className="space-y-3">
        {salatList.map((salat, index) => (
          <motion.div
            key={salat.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className={`p-4 rounded-lg transition-all cursor-pointer ${
              salat.completed
                ? 'bg-islamic-gold/30 border-2 border-islamic-gold'
                : 'glass-effect hover:bg-islamic-green-light/20'
            }`}
            onClick={() => toggleSalat(salat.id)}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="text-3xl">{salat.icon}</div>
                <div>
                  <div className="font-bold text-lg">{salat.name}</div>
                  <div className="text-sm text-islamic-white/70">{salat.time}</div>
                </div>
              </div>
              <div className={`w-6 h-6 rounded border-2 flex items-center justify-center transition-all ${
                salat.completed
                  ? 'bg-islamic-gold border-islamic-gold'
                  : 'border-islamic-white/50'
              }`}>
                {salat.completed && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="text-islamic-green-dark font-bold"
                  >
                    ✓
                  </motion.span>
                )}
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Reset Info */}
      <div className="mt-4 text-center text-xs text-islamic-white/60">
        Resets daily at Fajr time
      </div>
    </Card>
  );
}
