'use client';

import { useSocket } from '../../hooks/useSocket';
import { formatTimeRemaining, getPrayerName, getPrayerIcon } from '../../lib/prayer-times';
import { motion } from 'framer-motion';
import Card from '../common/Card';
import QuranTracker from '../productivity/QuranTracker';
import SalatChecklist from '../productivity/SalatChecklist';
import IslamicQuote from '../common/IslamicQuote';
import ChatWidget from '../ai/ChatWidget';
import SurahList from '../quran/SurahList';

const DIVISIONS = [
  { key: "dhaka", label: "Dhaka" },
  { key: "chattogram", label: "Chattogram" },
  { key: "rajshahi", label: "Rajshahi" },
  { key: "khulna", label: "Khulna" },
  { key: "barishal", label: "Barishal" },
  { key: "rangpur", label: "Rangpur" },
  { key: "sylhet", label: "Sylhet" },
  { key: "mymensingh", label: "Mymensingh" },
];

export default function Dashboard() {
  const { serverData, isConnected, activeUsers, setLocation } = useSocket();

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
        <div className="text-center mb-6">
          <h1 className="text-5xl font-bold text-islamic-gold mb-2">
            Noor-e-Ramadan
          </h1>
          <p className="text-xl text-islamic-white/80">
            Your Real-Time Islamic Companion
          </p>

          <div className="mt-4 text-sm text-islamic-white/70">
            <div>📍 {serverData.location.name}, Bangladesh</div>
            <div>📅 {serverData.dates.gregorian}</div>
            <div>🕌 {serverData.dates.hijri}</div>
          </div>

          <div className="mt-4 flex items-center justify-center gap-4 flex-wrap">
            <div className="glass-effect px-4 py-2 rounded-lg">
              👥 {activeUsers} Active
            </div>

            <div className="glass-effect px-4 py-2 rounded-lg">
              <select
                value={serverData.location.key}
                onChange={(e) => setLocation(e.target.value)}
                className="bg-transparent outline-none"
              >
                {DIVISIONS.map((d) => (
                  <option key={d.key} value={d.key} className="text-black">
                    {d.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Next Prayer */}
        {nextPrayer && (
          <Card>
            <h2 className="text-xl font-bold mb-2">Next Prayer</h2>
            <p className="text-2xl">
              {getPrayerIcon(nextPrayer.name)} {getPrayerName(nextPrayer.name)}
            </p>
            <p className="text-xl font-mono">
              {formatTimeRemaining(nextPrayer.remaining)}
            </p>
          </Card>
        )}

        {/* Sehri & Iftar */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
          <Card>
            <h3 className="font-bold">Sehri Ends</h3>
            <p className="text-sm text-islamic-white/70 mt-1">
  Ends at: {new Date(sehriIftar.sehri.end).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
</p>
            <p className="text-xl font-mono">
              {formatTimeRemaining(sehriIftar.sehri.remaining)}
            </p>
          </Card>

          <Card>
            <h3 className="font-bold">Iftar Time</h3>
            <p className="text-sm text-islamic-white/70 mt-1">
  At: {new Date(sehriIftar.iftar.time).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
</p>
            <p className="text-xl font-mono">
              {formatTimeRemaining(sehriIftar.iftar.remaining)}
            </p>
          </Card>
        </div>

        {/* Prayer Times */}
        <Card className="mt-6">
          <h2 className="text-2xl font-bold mb-4 text-center">
            Today’s Prayer Times
          </h2>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {Object.entries(prayers).map(([key, time]) => {
              const prayerTime = new Date(time);

              return (
                <div key={key} className="p-4 text-center glass-effect rounded-lg">
                  <div>{getPrayerIcon(key)}</div>
                  <p>{getPrayerName(key)}</p>
                  <p>
                    {prayerTime.toLocaleTimeString('en-US', {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </p>
                </div>
              );
            })}
          </div>
        </Card>

        {/* Extra Sections */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
          <QuranTracker />
          <SalatChecklist />
        </div>

        <div className="mt-6">
          <IslamicQuote />
        </div>

        <div className="mt-6">
          <SurahList />
        </div>

        <div className="mt-6 text-center text-sm text-islamic-white/60">
          Server Time: {new Date(serverData.serverTime).toLocaleString()}
        </div>

      </div>

      <ChatWidget />
    </div>
  );
}