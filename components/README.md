# Components Structure

This directory contains all React components organized by feature:

## 📁 Directory Structure

```
components/
├── dashboard/          # Main dashboard components
│   ├── Dashboard.tsx          # Main dashboard container
│   ├── Timeline.tsx           # Circular progress timeline
│   └── StatsCard.tsx          # Statistics cards
│
├── prayer/             # Prayer-related components
│   ├── PrayerTimes.tsx        # Prayer times list
│   ├── NextPrayer.tsx         # Next prayer alert
│   ├── Countdown.tsx          # Countdown timer
│   └── SehriIftar.tsx         # Sehri/Iftar countdown
│
├── productivity/       # Productivity & Ibadah tracker
│   ├── QuranTracker.tsx       # Juz/Surah tracker
│   ├── DailyAmol.tsx          # Daily checklist
│   └── DuaCard.tsx            # Context-aware Dua cards
│
├── ai/                 # AI Bot components
│   ├── ChatWidget.tsx         # Floating chat widget
│   ├── ChatMessage.tsx        # Individual message
│   └── ChatInput.tsx          # Message input
│
└── common/             # Shared/reusable components
    ├── Button.tsx             # Button component
    ├── Card.tsx               # Card container
    ├── Badge.tsx              # Badge component
    ├── Loading.tsx            # Loading spinner
    └── NavBar.tsx             # Navigation bar
```

## 🎨 Design Guidelines

- All components should be mobile-first responsive
- Use Tailwind CSS classes
- Follow the Islamic color scheme (green, gold, white)
- Use Framer Motion for animations
- Maintain TypeScript strict typing
