'use client';

import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { getSurahByNumber, type Surah } from '@/lib/quran-data';
import { AVAILABLE_SURAHS_EXTENDED } from '@/lib/quran-data-extended';

// Helper function to get surah by number from extended list
function getSurahByNumberExtended(number: number): Surah | undefined {
  return AVAILABLE_SURAHS_EXTENDED.find(s => s.number === number);
}
import Card from '@/components/common/Card';
import Button from '@/components/common/Button';

type TranslationLanguage = 'bangla' | 'english' | 'none';

export default function SurahPage() {
  const params = useParams();
  const router = useRouter();
  const surahNumber = parseInt(params.surah as string);
  
  const [selectedSurah, setSelectedSurah] = useState<Surah | null>(null);
  const [currentAyah, setCurrentAyah] = useState(0);
  const [translationLang, setTranslationLang] = useState<TranslationLanguage>('bangla');
  const [showTranslation, setShowTranslation] = useState(true);
  const [isAutoRecite, setIsAutoRecite] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const autoScrollRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const surah = getSurahByNumberExtended(surahNumber);
    if (surah) {
      setSelectedSurah(surah);
    } else {
      // If surah not found, redirect to home
      router.push('/');
    }
  }, [surahNumber, router]);

  useEffect(() => {
    if (autoScrollRef.current) {
      autoScrollRef.current.scrollIntoView({ 
        behavior: 'smooth', 
        block: 'center' 
      });
    }
  }, [currentAyah]);

  useEffect(() => {
    if (isAutoRecite && !isPlaying && selectedSurah) {
      const timer = setTimeout(() => {
        if (currentAyah < selectedSurah.ayahs.length - 1) {
          setCurrentAyah(currentAyah + 1);
        } else {
          setIsAutoRecite(false);
        }
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [isAutoRecite, isPlaying, currentAyah, selectedSurah]);

  const playAudio = (surahNumber: number, ayahNumber: number) => {
    const audioUrl = `https://cdn.islamic.network/quran/audio-surah/128/ar.alafasy/${surahNumber}/${ayahNumber}.mp3`;
    
    if (audioRef.current) {
      audioRef.current.pause();
    }

    const audio = new Audio(audioUrl);
    audioRef.current = audio;
    
    audio.play()
      .then(() => setIsPlaying(true))
      .catch(() => setIsPlaying(false));

    audio.onended = () => {
      setIsPlaying(false);
      if (isAutoRecite && selectedSurah && currentAyah < selectedSurah.ayahs.length - 1) {
        setCurrentAyah(currentAyah + 1);
      } else if (isAutoRecite) {
        setIsAutoRecite(false);
      }
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
    if (!selectedSurah) return;
    
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
    if (selectedSurah && currentAyah < selectedSurah.ayahs.length - 1) {
      setCurrentAyah(currentAyah + 1);
      if (isAutoRecite) {
        playAudio(selectedSurah.number, selectedSurah.ayahs[currentAyah + 1].number);
      }
    }
  };

  const prevAyah = () => {
    if (currentAyah > 0) {
      setCurrentAyah(currentAyah - 1);
      if (isAutoRecite && selectedSurah) {
        playAudio(selectedSurah.number, selectedSurah.ayahs[currentAyah - 1].number);
      }
    }
  };

  if (!selectedSurah) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin text-4xl">⏳</div>
      </div>
    );
  }

  const currentAyahData = selectedSurah.ayahs[currentAyah];

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="container mx-auto max-w-4xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6"
        >
          <Button
            onClick={() => router.push('/quran')}
            variant="outline"
            className="mb-4"
          >
            ← Back to Surah List
          </Button>
          
          <Card className="bg-gradient-to-r from-islamic-gold/20 to-islamic-green-light/20">
            <div className="text-center">
              <h1 className="text-4xl font-bold text-islamic-gold mb-2">
                {selectedSurah.name}
              </h1>
              <p className="text-3xl arabic-text text-islamic-gold font-amiri mb-2">
                {selectedSurah.nameArabic}
              </p>
              <p className="text-islamic-white/70">
                {selectedSurah.ayahs.length} Ayahs
              </p>
            </div>
          </Card>
        </motion.div>

        {/* Controls */}
        <Card className="mb-6">
          <div className="flex flex-wrap gap-3 justify-center">
            <select
              value={translationLang}
              onChange={(e) => setTranslationLang(e.target.value as TranslationLanguage)}
              className="px-4 py-2 bg-islamic-green-light rounded-lg text-islamic-white focus:outline-none focus:ring-2 focus:ring-islamic-gold"
            >
              <option value="bangla" className="bg-islamic-green-dark">বাংলা</option>
              <option value="english" className="bg-islamic-green-dark">English</option>
              <option value="none" className="bg-islamic-green-dark">No Translation</option>
            </select>

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

            <button
              onClick={toggleAutoRecite}
              className={`px-4 py-2 rounded-lg font-semibold transition-all ${
                isAutoRecite
                  ? 'bg-red-600 text-white'
                  : 'bg-islamic-gold text-islamic-green-dark'
              }`}
            >
              {isAutoRecite ? '⏸ Stop' : '▶ Auto Recite'}
            </button>
          </div>

          {/* Progress Bar */}
          <div className="mt-4">
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
        </Card>

        {/* Quran Text */}
        <Card className="max-h-[600px] overflow-y-auto custom-scrollbar">
          <div className="space-y-6 pb-4">
            {selectedSurah.ayahs.map((ayah, index) => (
              <motion.div
                key={ayah.number}
                ref={index === currentAyah ? autoScrollRef : null}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className={`p-6 rounded-lg transition-all ${
                  index === currentAyah
                    ? 'bg-islamic-gold/30 border-2 border-islamic-gold'
                    : 'glass-effect'
                }`}
              >
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

                <div className="text-center mb-4">
                  <p className="text-3xl arabic-text text-islamic-gold font-amiri leading-relaxed">
                    {ayah.arabic}
                  </p>
                </div>

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
        </Card>

        {/* Navigation */}
        <div className="flex justify-between items-center mt-6">
          <Button
            onClick={prevAyah}
            disabled={currentAyah === 0}
            variant="secondary"
          >
            ← Previous
          </Button>

          <div className="text-center">
            <p className="text-sm text-islamic-white/70">
              {selectedSurah.name}
            </p>
            <p className="text-lg font-bold text-islamic-gold">
              {currentAyah + 1} / {selectedSurah.ayahs.length}
            </p>
          </div>

          <Button
            onClick={nextAyah}
            disabled={currentAyah === selectedSurah.ayahs.length - 1}
            variant="secondary"
          >
            Next →
          </Button>
        </div>
      </div>
    </div>
  );
}
