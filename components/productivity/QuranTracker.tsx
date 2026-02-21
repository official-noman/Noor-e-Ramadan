'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Card from '@/components/common/card';
import { getStorageItem, setStorageItem, StorageKeys } from '@/lib/storage';

interface JuzProgress {
  juz: number;
  completed: boolean;
  date?: string;
}

interface SurahProgress {
  surah: number;
  name: string;
  completed: boolean;
  date?: string;
}

const JUZ_LIST = Array.from({ length: 30 }, (_, i) => i + 1);

const SURAH_LIST = [
  { number: 1, name: 'Al-Fatiha' },
  { number: 2, name: 'Al-Baqarah' },
  { number: 3, name: 'Ali Imran' },
  { number: 4, name: 'An-Nisa' },
  { number: 5, name: 'Al-Maidah' },
  { number: 6, name: "Al-An'am" },
  { number: 7, name: "Al-A'raf" },
  { number: 8, name: 'Al-Anfal' },
  { number: 9, name: 'At-Tawbah' },
  { number: 10, name: 'Yunus' },
  { number: 11, name: 'Hud' },
  { number: 12, name: 'Yusuf' },
  { number: 13, name: "Ar-Ra'd" },
  { number: 14, name: 'Ibrahim' },
  { number: 15, name: 'Al-Hijr' },
  { number: 16, name: 'An-Nahl' },
  { number: 17, name: 'Al-Isra' },
  { number: 18, name: 'Al-Kahf' },
  { number: 19, name: 'Maryam' },
  { number: 20, name: 'Ta-Ha' },
  { number: 21, name: "Al-Anbiya'" },
  { number: 22, name: 'Al-Hajj' },
  { number: 23, name: "Al-Mu'minun" },
  { number: 24, name: 'An-Nur' },
  { number: 25, name: 'Al-Furqan' },
  { number: 26, name: "Ash-Shu'ara'" },
  { number: 27, name: 'An-Naml' },
  { number: 28, name: 'Al-Qasas' },
  { number: 29, name: "Al-'Ankabut" },
  { number: 30, name: 'Ar-Rum' },
];

export default function QuranTracker() {
  const [juzProgress, setJuzProgress] = useState<JuzProgress[]>(() => 
    getStorageItem<JuzProgress[]>(StorageKeys.QURAN_PROGRESS, JUZ_LIST.map(juz => ({ juz, completed: false })))
  );
  
  const [surahProgress, setSurahProgress] = useState<SurahProgress[]>(() => 
    getStorageItem<SurahProgress[]>(`${StorageKeys.QURAN_PROGRESS}_surah`, SURAH_LIST.map(s => ({ ...s, completed: false })))
  );

  const [activeTab, setActiveTab] = useState<'juz' | 'surah'>('juz');

  useEffect(() => {
    setStorageItem(StorageKeys.QURAN_PROGRESS, juzProgress);
  }, [juzProgress]);

  useEffect(() => {
    setStorageItem(`${StorageKeys.QURAN_PROGRESS}_surah`, surahProgress);
  }, [surahProgress]);

  const toggleJuz = (juz: number) => {
    setJuzProgress(prev => 
      prev.map(item => 
        item.juz === juz 
          ? { ...item, completed: !item.completed, date: !item.completed ? new Date().toISOString() : undefined }
          : item
      )
    );
  };

  const toggleSurah = (surahNumber: number) => {
    setSurahProgress(prev =>
      prev.map(item =>
        item.surah === surahNumber
          ? { ...item, completed: !item.completed, date: !item.completed ? new Date().toISOString() : undefined }
          : item
      )
    );
  };

  const completedJuz = juzProgress.filter(j => j.completed).length;
  const completedSurah = surahProgress.filter(s => s.completed).length;
  const juzPercentage = (completedJuz / 30) * 100;
  const surahPercentage = (completedSurah / 30) * 100;

  return (
    <Card>
      <div className="mb-6">
        <h2 className="text-2xl font-bold mb-4 text-center text-islamic-gold">📖 Quran Tilawat Tracker</h2>
        
        {/* Tabs */}
        <div className="flex gap-2 mb-4 justify-center">
          <button
            onClick={() => setActiveTab('juz')}
            className={`px-4 py-2 rounded-lg font-semibold transition-all ${
              activeTab === 'juz'
                ? 'bg-islamic-gold text-islamic-green-dark'
                : 'glass-effect text-islamic-white'
            }`}
          >
            Juz ({completedJuz}/30)
          </button>
          <button
            onClick={() => setActiveTab('surah')}
            className={`px-4 py-2 rounded-lg font-semibold transition-all ${
              activeTab === 'surah'
                ? 'bg-islamic-gold text-islamic-green-dark'
                : 'glass-effect text-islamic-white'
            }`}
          >
            Surah ({completedSurah}/30)
          </button>
        </div>

        {/* Progress Bar */}
        <div className="mb-6">
          <div className="flex justify-between mb-2">
            <span className="text-sm text-islamic-white/70">
              Progress: {activeTab === 'juz' ? completedJuz : completedSurah} / 30
            </span>
            <span className="text-sm font-bold text-islamic-gold">
              {activeTab === 'juz' ? Math.round(juzPercentage) : Math.round(surahPercentage)}%
            </span>
          </div>
          <div className="w-full bg-islamic-green-dark rounded-full h-3 overflow-hidden">
            <motion.div
              className="bg-islamic-gold h-full"
              initial={{ width: 0 }}
              animate={{ width: `${activeTab === 'juz' ? juzPercentage : surahPercentage}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
        </div>

        {/* Juz List */}
        {activeTab === 'juz' && (
          <div className="grid grid-cols-5 sm:grid-cols-6 md:grid-cols-10 gap-2 max-h-96 overflow-y-auto custom-scrollbar">
            {juzProgress.map((item) => (
              <motion.button
                key={item.juz}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => toggleJuz(item.juz)}
                className={`p-3 rounded-lg text-center transition-all ${
                  item.completed
                    ? 'bg-islamic-gold text-islamic-green-dark font-bold'
                    : 'glass-effect text-islamic-white hover:bg-islamic-green-light'
                }`}
                title={item.date ? `Completed: ${new Date(item.date).toLocaleDateString()}` : ''}
              >
                <div className="text-lg font-bold">{item.juz}</div>
                {item.completed && <div className="text-xs">✓</div>}
              </motion.button>
            ))}
          </div>
        )}

        {/* Surah List */}
        {activeTab === 'surah' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-96 overflow-y-auto custom-scrollbar">
            {surahProgress.map((item) => (
              <motion.button
                key={item.surah}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => toggleSurah(item.surah)}
                className={`p-3 rounded-lg text-left transition-all flex items-center justify-between ${
                  item.completed
                    ? 'bg-islamic-gold text-islamic-green-dark font-bold'
                    : 'glass-effect text-islamic-white hover:bg-islamic-green-light'
                }`}
              >
                <div>
                  <div className="font-bold">{item.surah}. {item.name}</div>
                  {item.date && (
                    <div className="text-xs opacity-70">
                      {new Date(item.date).toLocaleDateString()}
                    </div>
                  )}
                </div>
                {item.completed && <span className="text-xl">✓</span>}
              </motion.button>
            ))}
          </div>
        )}
      </div>
    </Card>
  );
}
