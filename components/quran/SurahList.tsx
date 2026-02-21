'use client';

import { motion } from 'framer-motion';
import Card from '@/components/common/card';
import { AVAILABLE_SURAHS_EXTENDED } from '@/lib/quran-data-extended';
import { useRouter } from 'next/navigation';

export default function SurahList() {
  const router = useRouter();

  const handleSurahClick = (surahNumber: number) => {
    router.push(`/quran/${surahNumber}`);
  };

  return (
    <Card>
      <h2 className="text-2xl font-bold mb-6 text-center text-islamic-gold">
        📖 Select a Surah to Read
      </h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {AVAILABLE_SURAHS_EXTENDED.map((surah, index) => (
          <motion.button
            key={surah.number}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            onClick={() => handleSurahClick(surah.number)}
            className="p-6 glass-effect rounded-lg text-left hover:bg-islamic-green-light/30 transition-all group"
          >
            <div className="flex items-center justify-between mb-2">
              <div className="text-2xl font-bold text-islamic-gold">
                {surah.number}
              </div>
              <div className="text-3xl arabic-text text-islamic-gold font-amiri">
                {surah.nameArabic}
              </div>
            </div>
            <h3 className="text-xl font-bold mb-2 text-islamic-white group-hover:text-islamic-gold transition-colors">
              {surah.name}
            </h3>
            <p className="text-sm text-islamic-white/70">
              {surah.ayahs.length} Ayahs
            </p>
            <div className="mt-3 text-right">
              <span className="text-islamic-gold group-hover:translate-x-1 inline-block transition-transform">
                Read →
              </span>
            </div>
          </motion.button>
        ))}
      </div>
    </Card>
  );
}
