// Quran Data - Sample Surahs with translations
export interface Ayah {
  number: number;
  arabic: string;
  bangla: string;
  english: string;
}

export interface Surah {
  number: number;
  name: string;
  nameArabic: string;
  ayahs: Ayah[];
}

// Sample data - Al-Fatiha (Surah 1)
export const SURAH_AL_FATIHA: Surah = {
  number: 1,
  name: 'Al-Fatiha',
  nameArabic: 'الفاتحة',
  ayahs: [
    {
      number: 1,
      arabic: 'بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ',
      bangla: 'পরম করুণাময় ও অসীম দয়ালু আল্লাহর নামে',
      english: 'In the name of Allah, the Entirely Merciful, the Especially Merciful.'
    },
    {
      number: 2,
      arabic: 'الْحَمْدُ لِلَّهِ رَبِّ الْعَالَمِينَ',
      bangla: 'সমস্ত প্রশংসা আল্লাহর জন্য, যিনি সকল জগতের প্রতিপালক।',
      english: '[All] praise is [due] to Allah, Lord of the worlds.'
    },
    {
      number: 3,
      arabic: 'الرَّحْمَٰنِ الرَّحِيمِ',
      bangla: 'যিনি পরম করুণাময় ও অসীম দয়ালু।',
      english: 'The Entirely Merciful, the Especially Merciful.'
    },
    {
      number: 4,
      arabic: 'مَالِكِ يَوْمِ الدِّينِ',
      bangla: 'যিনি বিচার দিনের মালিক।',
      english: 'Sovereign of the Day of Recompense.'
    },
    {
      number: 5,
      arabic: 'إِيَّاكَ نَعْبُدُ وَإِيَّاكَ نَسْتَعِينُ',
      bangla: 'আমরা কেবল তোমারই ইবাদত করি এবং কেবল তোমারই কাছে সাহায্য প্রার্থনা করি।',
      english: 'It is You we worship and You we ask for help.'
    },
    {
      number: 6,
      arabic: 'اهْدِنَا الصِّرَاطَ الْمُسْتَقِيمَ',
      bangla: 'আমাদেরকে সরল পথ দেখাও।',
      english: 'Guide us to the straight path.'
    },
    {
      number: 7,
      arabic: 'صِرَاطَ الَّذِينَ أَنْعَمْتَ عَلَيْهِمْ غَيْرِ الْمَغْضُوبِ عَلَيْهِمْ وَلَا الضَّالِّينَ',
      bangla: 'সেসব লোকের পথ, যাদেরকে তুমি নিয়ামত দান করেছ; যাদের উপর গজব পড়েনি এবং যারা পথভ্রষ্ট নয়।',
      english: 'The path of those upon whom You have bestowed favor, not of those who have evoked [Your] anger or of those who are astray.'
    }
  ]
};

// Sample - Al-Ikhlas (Surah 112)
export const SURAH_AL_IKHLAS: Surah = {
  number: 112,
  name: 'Al-Ikhlas',
  nameArabic: 'الإخلاص',
  ayahs: [
    {
      number: 1,
      arabic: 'قُلْ هُوَ اللَّهُ أَحَدٌ',
      bangla: 'বলুন, তিনি আল্লাহ, এক ও অদ্বিতীয়।',
      english: 'Say, "He is Allah, [who is] One,'
    },
    {
      number: 2,
      arabic: 'اللَّهُ الصَّمَدُ',
      bangla: 'আল্লাহ অমুখাপেক্ষী।',
      english: 'Allah, the Eternal Refuge.'
    },
    {
      number: 3,
      arabic: 'لَمْ يَلِدْ وَلَمْ يُولَدْ',
      bangla: 'তিনি কাউকে জন্ম দেননি এবং কেউ তাকে জন্ম দেয়নি।',
      english: 'He neither begets nor is born,'
    },
    {
      number: 4,
      arabic: 'وَلَمْ يَكُن لَّهُ كُفُوًا أَحَدٌ',
      bangla: 'এবং তার সমতুল্য কেউ নেই।',
      english: 'Nor is there to Him any equivalent."'
    }
  ]
};

// Sample - Al-Falaq (Surah 113)
export const SURAH_AL_FALAQ: Surah = {
  number: 113,
  name: 'Al-Falaq',
  nameArabic: 'الفلق',
  ayahs: [
    {
      number: 1,
      arabic: 'قُلْ أَعُوذُ بِرَبِّ الْفَلَقِ',
      bangla: 'বলুন, আমি আশ্রয় গ্রহণ করছি ভোরের প্রতিপালকের,',
      english: 'Say, "I seek refuge in the Lord of daybreak'
    },
    {
      number: 2,
      arabic: 'مِن شَرِّ مَا خَلَقَ',
      bangla: 'তার সৃষ্টির অনিষ্ট থেকে,',
      english: 'From the evil of that which He created'
    },
    {
      number: 3,
      arabic: 'وَمِن شَرِّ غَاسِقٍ إِذَا وَقَبَ',
      bangla: 'এবং অন্ধকার রাতের অনিষ্ট থেকে, যখন তা ছেয়ে যায়,',
      english: 'And from the evil of darkness when it settles'
    },
    {
      number: 4,
      arabic: 'وَمِن شَرِّ النَّفَّاثَاتِ فِي الْعُقَدِ',
      bangla: 'এবং গিঁটে ফুঁ দেওয়া জাদুকরীদের অনিষ্ট থেকে,',
      english: 'And from the evil of the blowers in knots'
    },
    {
      number: 5,
      arabic: 'وَمِن شَرِّ حَاسِدٍ إِذَا حَسَدَ',
      bangla: 'এবং হিংসুকের অনিষ্ট থেকে, যখন সে হিংসা করে।',
      english: 'And from the evil of an envier when he envies."'
    }
  ]
};

// All available surahs - will be extended in quran-data-extended
export const AVAILABLE_SURAHS: Surah[] = [
  SURAH_AL_FATIHA,
  SURAH_AL_IKHLAS,
  SURAH_AL_FALAQ,
];

export function getSurahByNumber(number: number): Surah | undefined {
  return AVAILABLE_SURAHS.find(s => s.number === number);
}
