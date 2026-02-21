'use client';

import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
// import { surahs } from '../../lib/quran-data-extended';
import SurahList from '../../components/quran/SurahList';

export default function QuranPage() {
  return (
    <div className="min-h-screen py-8 px-4">
      <div className="container mx-auto max-w-6xl">
        <SurahList />
      </div>
    </div>
  );
}