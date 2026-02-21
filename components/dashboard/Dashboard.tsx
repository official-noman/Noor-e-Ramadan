'use client';

import { useSocket } from '@/hooks/useSocket';
import { formatPrayerTime, formatTimeRemaining, getPrayerName, getPrayerIcon } from '@/lib/prayer-times';
import { motion } from 'framer-motion';
import Card from '@/components/common/Card';
import QuranTracker from '@/components/productivity/QuranTracker';
import SalatChecklist from '@/components/productivity/SalatChecklist';
import IslamicQuote from '@/components/common/IslamicQuote';
import ChatWidget from '@/components/ai/ChatWidget';
import SurahList from '@/components/quran/SurahList';

export default function Dashboard() {
  const { serverData, isConnected, activeUsers } = useSocket();

  if (!isConnected) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin text-4xl mb-4">⏳</div>
          <p className="text-xl">Connecting to server...</p>
        </div>
      </div>
    );
  }

  if (!serverData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-xl">Loading prayer times...</p>
      </div>
    );
  }

  const prayers = serverData.prayers;
  const nextPrayer = serverData.nextPrayer;
  const sehriIftar = serverData.sehriIftar;

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="container mx-auto max-w-6xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-5xl font-bold mb-2 text-islamic-gold">Noor-e-Ramadan</h1>
          <p className="text-xl text-islamic-white/80">Your Real-Time Islamic Companion</p>
          <div className="mt-4 flex items-center justify-center gap-4">
            <div className="flex items-center gap-2 glass-effect px-4 py-2 rounded-lg">
              <span className="text-green-400">●</span>
              <span className="text-sm">Live</span>
            </div>
            <div className="flex items-center gap-2 glass-effect px-4 py-2 rounded-lg">
              <span>👥</span>
              <span className="text-sm">{activeUsers} Active</span>
            </div>
          </div>
        </motion.div>

        {/* Next Prayer Alert */}
        {nextPrayer && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mb-6"
          >
            <Card hover={false} className="bg-gradient-to-r from-islamic-gold/20 to-islamic-green-light/20 border-2 border-islamic-gold">
              <div className="flex items-center justify-between flex-wrap gap-4">
                <div>
                  <p className="text-sm text-islamic-white/70 mb-1">Next Prayer</p>
                  <h2 className="text-3xl font-bold text-islamic-gold flex items-center gap-2">
                    <span>{getPrayerIcon(nextPrayer.name)}</span>
                    {getPrayerName(nextPrayer.name)}
                  </h2>
                </div>
                <div className="text-right">
                  <p className="text-sm text-islamic-white/70 mb-1">Time Remaining</p>
                  <p className="text-3xl font-mono font-bold text-islamic-white">
                    {formatTimeRemaining(nextPrayer.remaining)}
                  </p>
                </div>
              </div>
            </Card>
          </motion.div>
        )}

        {/* Sehri & Iftar Countdown */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card hover={true}>
              <div className="text-center">
                <div className="text-4xl mb-2">🌙</div>
                <h3 className="text-xl font-bold mb-2">Sehri Ends</h3>
                <p className="text-3xl font-mono font-bold text-islamic-gold mb-2">
                  {formatTimeRemaining(sehriIftar.sehri.remaining)}
                </p>
                <p className="text-sm text-islamic-white/70">
                  {new Date(sehriIftar.sehri.end).toLocaleTimeString('en-US', { 
                    hour: '2-digit', 
                    minute: '2-digit' 
                  })}
                </p>
              </div>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card hover={true}>
              <div className="text-center">
                <div className="text-4xl mb-2">🌅</div>
                <h3 className="text-xl font-bold mb-2">Iftar Time</h3>
                <p className="text-3xl font-mono font-bold text-islamic-gold mb-2">
                  {formatTimeRemaining(sehriIftar.iftar.remaining)}
                </p>
                <p className="text-sm text-islamic-white/70">
                  {new Date(sehriIftar.iftar.time).toLocaleTimeString('en-US', { 
                    hour: '2-digit', 
                    minute: '2-digit' 
                  })}
                </p>
              </div>
            </Card>
          </motion.div>
        </div>

        {/* Prayer Times */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card>
            <h2 className="text-2xl font-bold mb-4 text-center">Today&apos;s Prayer Times</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {Object.entries(prayers).map(([key, time], index) => {
                const prayerTime = new Date(time);
                const isNext = nextPrayer?.name === key;
                
                return (
                  <motion.div
                    key={key}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.4 + index * 0.1 }}
                    className={`p-4 rounded-lg text-center ${
                      isNext 
                        ? 'bg-islamic-gold/30 border-2 border-islamic-gold' 
                        : 'glass-effect'
                    }`}
                  >
                    <div className="text-2xl mb-2">{getPrayerIcon(key)}</div>
                    <p className="font-semibold text-sm mb-1">{getPrayerName(key)}</p>
                    <p className="text-xl font-bold text-islamic-gold">
                      {prayerTime.toLocaleTimeString('en-US', { 
                        hour: '2-digit', 
                        minute: '2-digit',
                        hour12: true 
                      })}
                    </p>
                    {isNext && (
                      <p className="text-xs mt-1 text-islamic-white/70">Next</p>
                    )}
                  </motion.div>
                );
              })}
            </div>
          </Card>
        </motion.div>

        {/* Quran Tracker & Salat Checklist */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <QuranTracker />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            <SalatChecklist />
          </motion.div>
        </div>

        {/* Islamic Quote */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="mt-6"
        >
          <IslamicQuote />
        </motion.div>

        {/* Quran Reader - Surah List */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="mt-6"
        >
          <SurahList />
        </motion.div>

        {/* Server Time */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.9 }}
          className="mt-6 text-center text-sm text-islamic-white/60"
        >
          <p>Server Time: {new Date(serverData.serverTime).toLocaleString()}</p>
          <p className="mt-1">Location: Dhaka, Bangladesh</p>
        </motion.div>
      </div>

      {/* AI Chat Widget - Floating */}
      <ChatWidget />
    </div>
  );
}
