'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Card from '@/components/common/Card';

interface Quote {
  text: string;
  source: string;
  arabic?: string;
}

const ISLAMIC_QUOTES: Quote[] = [
  {
    text: "The best of people are those who are most beneficial to others.",
    source: "Prophet Muhammad (PBUH)",
    arabic: "خير الناس أنفعهم للناس"
  },
  {
    text: "And whoever fears Allah, He will make for him a way out.",
    source: "Quran 65:2",
    arabic: "وَمَن يَتَّقِ اللَّهَ يَجْعَل لَّهُ مَخْرَجًا"
  },
  {
    text: "Verily, with hardship comes ease.",
    source: "Quran 94:5",
    arabic: "فَإِنَّ مَعَ الْعُسْرِ يُسْرًا"
  },
  {
    text: "Allah does not burden a soul beyond that it can bear.",
    source: "Quran 2:286",
    arabic: "لَا يُكَلِّفُ اللَّهُ نَفْسًا إِلَّا وُسْعَهَا"
  },
  {
    text: "The strongest among you is the one who controls his anger.",
    source: "Prophet Muhammad (PBUH)",
    arabic: "ليس الشديد بالصرعة إنما الشديد الذي يملك نفسه عند الغضب"
  },
  {
    text: "And We have certainly created man in hardship.",
    source: "Quran 90:4",
    arabic: "لَقَدْ خَلَقْنَا الْإِنسَانَ فِي كَبَدٍ"
  },
  {
    text: "Do good deeds properly, sincerely and moderately.",
    source: "Prophet Muhammad (PBUH)"
  },
  {
    text: "And whoever does righteous deeds, whether male or female, while being a believer, they will enter Paradise.",
    source: "Quran 4:124",
    arabic: "وَمَن يَعْمَلْ مِنَ الصَّالِحَاتِ مِن ذَكَرٍ أَوْ أُنثَىٰ وَهُوَ مُؤْمِنٌ فَأُولَٰئِكَ يَدْخُلُونَ الْجَنَّةَ"
  },
  {
    text: "The best charity is that given in Ramadan.",
    source: "Prophet Muhammad (PBUH)"
  },
  {
    text: "Whoever fasts Ramadan out of faith and seeking reward, his previous sins will be forgiven.",
    source: "Prophet Muhammad (PBUH)"
  }
];

export default function IslamicQuote() {
  const [currentQuote, setCurrentQuote] = useState<Quote>(ISLAMIC_QUOTES[0]);
  const [quoteIndex, setQuoteIndex] = useState(0);

  useEffect(() => {
    // Change quote every 10 seconds
    const interval = setInterval(() => {
      setQuoteIndex((prev) => {
        const next = (prev + 1) % ISLAMIC_QUOTES.length;
        setCurrentQuote(ISLAMIC_QUOTES[next]);
        return next;
      });
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  const nextQuote = () => {
    setQuoteIndex((prev) => {
      const next = (prev + 1) % ISLAMIC_QUOTES.length;
      setCurrentQuote(ISLAMIC_QUOTES[next]);
      return next;
    });
  };

  const prevQuote = () => {
    setQuoteIndex((prev) => {
      const prevIndex = prev === 0 ? ISLAMIC_QUOTES.length - 1 : prev - 1;
      setCurrentQuote(ISLAMIC_QUOTES[prevIndex]);
      return prevIndex;
    });
  };

  return (
    <Card className="relative overflow-hidden">
      <div className="absolute top-0 right-0 text-6xl opacity-10 text-islamic-gold">☪️</div>
      
      <AnimatePresence mode="wait">
        <motion.div
          key={quoteIndex}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.5 }}
          className="relative z-10"
        >
          {currentQuote.arabic && (
            <div className="text-center mb-4">
              <p className="text-2xl arabic-text text-islamic-gold font-amiri">
                {currentQuote.arabic}
              </p>
            </div>
          )}
          
          <p className="text-lg text-center mb-4 text-islamic-white leading-relaxed">
            &quot;{currentQuote.text}&quot;
          </p>
          
          <p className="text-sm text-center text-islamic-white/70 italic">
            — {currentQuote.source}
          </p>
        </motion.div>
      </AnimatePresence>

      {/* Navigation */}
      <div className="flex justify-center gap-4 mt-6">
        <button
          onClick={prevQuote}
          className="p-2 rounded-lg glass-effect hover:bg-islamic-green-light transition-all"
          aria-label="Previous quote"
        >
          ←
        </button>
        <div className="flex items-center gap-1">
          {ISLAMIC_QUOTES.map((_, index) => (
            <div
              key={index}
              className={`w-2 h-2 rounded-full transition-all ${
                index === quoteIndex ? 'bg-islamic-gold w-4' : 'bg-islamic-white/30'
              }`}
            />
          ))}
        </div>
        <button
          onClick={nextQuote}
          className="p-2 rounded-lg glass-effect hover:bg-islamic-green-light transition-all"
          aria-label="Next quote"
        >
          →
        </button>
      </div>
    </Card>
  );
}
