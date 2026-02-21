'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Card from '@/components/common/card';
import { AVAILABLE_SURAHS, type Surah, type Ayah } from '@/lib/quran-data';

type TranslationLanguage = 'bangla' | 'english' | 'none';

export default function QuranReader() {
  const [selectedSurah, setSelectedSurah] = useState<Surah>(AVAILABLE_SURAHS[0]);
  const [currentAyah, setCurrentAyah] = useState(0);
  const [translationLang, setTranslationLang] = useState<TranslationLanguage>('bangla');
  const [showTranslation, setShowTranslation] = useState(true);
  const [isAutoRecite, setIsAutoRecite] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const autoScrollRef = useRef<HTMLDivElement | null>(null);

  // Auto scroll to current ayah
  useEffect(() => {
    if (autoScrollRef.current) {
      autoScrollRef.current.scrollIntoView({ 
        behavior: 'smooth', 
        block: 'center' 
      });
    }
  }, [currentAyah]);

  // Auto recite functionality
  useEffect(() => {
    if (isAutoRecite && !isPlaying) {
      const timer = setTimeout(() => {
        if (currentAyah < selectedSurah.ayahs.length - 1) {
          setCurrentAyah(currentAyah + 1);
        } else {
          setIsAutoRecite(false);
        }
      }, 5000); // 5 seconds per ayah

      return () => clearTimeout(timer);
    }
  }, [isAutoRecite, isPlaying, currentAyah, selectedSurah]);

  const playAudio = (surahNumber: number, ayahNumber: number) => {
    // Using a public Quran audio API
    const audioUrl = `https://cdn.islamic.network/quran/audio-surah/128/ar.alafasy/${surahNumber}/${ayahNumber}.mp3`;
    
    if (audioRef.current) {
      audioRef.current.pause();
    }

    const audio = new Audio(audioUrl);
    audioRef.current = audio;
    
    audio.play()
      .then(() => {
        setIsPlaying(true);
      })
      .catch((error) => {
        console.error('Audio playback failed:', error);
        setIsPlaying(false);
      });

    audio.onended = () => {
      setIsPlaying(false);
      if (isAutoRecite && currentAyah < selectedSurah.ayahs.length - 1) {
        setCurrentAyah(currentAyah + 1);
      } else if (isAutoRecite) {
        setIsAutoRecite(false);
      }
    };

    audio.onerror = () => {
      setIsPlaying(false);
      console.error('Audio loading failed');
    };
  };

  const stopAudio = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      setIsPlaying(false);
    }
  };

  const toggleAutoRecite = () => {
    if (isAutoRecite) {
      setIsAutoRecite(false);
      stopAudio();
    } else {
      setIsAutoRecite(true);
      setCurrentAyah(0);
      playAudio(selectedSurah.number, selectedSurah.ayahs[0].number);
    }
  };

  const nextAyah = () => {
    if (currentAyah < selectedSurah.ayahs.length - 1) {
      setCurrentAyah(currentAyah + 1);
      if (isAutoRecite) {
        playAudio(selectedSurah.number, selectedSurah.ayahs[currentAyah + 1].number);
      }
    }
  };

  const prevAyah = () => {
    if (currentAyah > 0) {
      setCurrentAyah(currentAyah - 1);
      if (isAutoRecite) {
        playAudio(selectedSurah.number, selectedSurah.ayahs[currentAyah - 1].number);
      }
    }
  };

  const handleSurahChange = (surah: Surah) => {
    setSelectedSurah(surah);
    setCurrentAyah(0);
    setIsAutoRecite(false);
    stopAudio();
  };

  const currentAyahData = selectedSurah.ayahs[currentAyah];

  return (
    <Card className="max-h-[800px] flex flex-col">
      <div className="mb-4">
        <h2 className="text-2xl font-bold mb-4 text-center text-islamic-gold">
          📖 Quran Reader
        </h2>

        {/* Controls */}
        <div className="flex flex-wrap gap-3 mb-4 justify-center">
          {/* Surah Selector */}
          <select
            value={selectedSurah.number}
            onChange={(e) => {
              const surah = AVAILABLE_SURAHS.find(s => s.number === parseInt(e.target.value));
              if (surah) handleSurahChange(surah);
            }}
            className="px-4 py-2 bg-islamic-green-light rounded-lg text-islamic-white focus:outline-none focus:ring-2 focus:ring-islamic-gold"
          >
            {AVAILABLE_SURAHS.map(surah => (
              <option key={surah.number} value={surah.number} className="bg-islamic-green-dark">
                {surah.number}. {surah.name} ({surah.nameArabic})
              </option>
            ))}
          </select>

          {/* Translation Language */}
          <select
            value={translationLang}
            onChange={(e) => setTranslationLang(e.target.value as TranslationLanguage)}
            className="px-4 py-2 bg-islamic-green-light rounded-lg text-islamic-white focus:outline-none focus:ring-2 focus:ring-islamic-gold"
          >
            <option value="bangla" className="bg-islamic-green-dark">বাংলা</option>
            <option value="english" className="bg-islamic-green-dark">English</option>
            <option value="none" className="bg-islamic-green-dark">No Translation</option>
          </select>

          {/* Show/Hide Translation Toggle */}
          <button
            onClick={() => setShowTranslation(!showTranslation)}
            className={`px-4 py-2 rounded-lg font-semibold transition-all ${
              showTranslation
                ? 'bg-islamic-gold text-islamic-green-dark'
                : 'glass-effect text-islamic-white'
            }`}
          >
            {showTranslation ? '✓ Translation' : 'Translation'}
          </button>

          {/* Auto Recite Toggle */}
          <button
            onClick={toggleAutoRecite}
            className={`px-4 py-2 rounded-lg font-semibold transition-all flex items-center gap-2 ${
              isAutoRecite
                ? 'bg-red-600 text-white'
                : 'bg-islamic-gold text-islamic-green-dark'
            }`}
          >
            {isAutoRecite ? '⏸ Stop' : '▶ Auto Recite'}
          </button>
        </div>

        {/* Progress Bar */}
        <div className="mb-4">
          <div className="flex justify-between mb-2">
            <span className="text-sm text-islamic-white/70">
              Ayah {currentAyah + 1} of {selectedSurah.ayahs.length}
            </span>
            <span className="text-sm font-bold text-islamic-gold">
              {Math.round(((currentAyah + 1) / selectedSurah.ayahs.length) * 100)}%
            </span>
          </div>
          <div className="w-full bg-islamic-green-dark rounded-full h-2 overflow-hidden">
            <motion.div
              className="bg-islamic-gold h-full"
              initial={{ width: 0 }}
              animate={{ width: `${((currentAyah + 1) / selectedSurah.ayahs.length) * 100}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>
        </div>
      </div>

      {/* Quran Text - Scrollable */}
      <div className="flex-1 overflow-y-auto custom-scrollbar space-y-6 pb-4">
        {selectedSurah.ayahs.map((ayah, index) => (
          <motion.div
            key={ayah.number}
            ref={index === currentAyah ? autoScrollRef : null}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className={`p-6 rounded-lg transition-all ${
              index === currentAyah
                ? 'bg-islamic-gold/30 border-2 border-islamic-gold'
                : 'glass-effect'
            }`}
          >
            {/* Ayah Number */}
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm text-islamic-white/70">
                Ayah {ayah.number}
              </span>
              <button
                onClick={() => {
                  setCurrentAyah(index);
                  playAudio(selectedSurah.number, ayah.number);
                }}
                className="text-islamic-gold hover:text-islamic-gold-light text-xl"
                title="Play audio"
              >
                {isPlaying && index === currentAyah ? '⏸' : '🔊'}
              </button>
            </div>

            {/* Arabic Text */}
            <div className="text-center mb-4">
              <p className="text-3xl arabic-text text-islamic-gold font-amiri leading-relaxed">
                {ayah.arabic}
              </p>
            </div>

            {/* Translation */}
            {showTranslation && translationLang !== 'none' && (
              <AnimatePresence>
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="mt-4 p-4 bg-islamic-green-dark/50 rounded-lg"
                >
                  <p className="text-lg text-islamic-white leading-relaxed">
                    {translationLang === 'bangla' ? ayah.bangla : ayah.english}
                  </p>
                </motion.div>
              </AnimatePresence>
            )}
          </motion.div>
        ))}
      </div>

      {/* Navigation */}
      <div className="flex justify-between items-center mt-4 pt-4 border-t border-islamic-green-light">
        <button
          onClick={prevAyah}
          disabled={currentAyah === 0}
          className="px-6 py-2 bg-islamic-green-light rounded-lg font-semibold hover:bg-islamic-green disabled:opacity-50 disabled:cursor-not-allowed transition-all"
        >
          ← Previous
        </button>

        <div className="text-center">
          <p className="text-sm text-islamic-white/70">
            {selectedSurah.name} ({selectedSurah.nameArabic})
          </p>
          <p className="text-lg font-bold text-islamic-gold">
            {currentAyah + 1} / {selectedSurah.ayahs.length}
          </p>
        </div>

        <button
          onClick={nextAyah}
          disabled={currentAyah === selectedSurah.ayahs.length - 1}
          className="px-6 py-2 bg-islamic-green-light rounded-lg font-semibold hover:bg-islamic-green disabled:opacity-50 disabled:cursor-not-allowed transition-all"
        >
          Next →
        </button>
      </div>
    </Card>
  );
}
