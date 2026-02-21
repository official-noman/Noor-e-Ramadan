# 📁 Noor-e-Ramadan - Project Structure

## 🎯 Overview

This document outlines the complete folder structure and architecture of the Noor-e-Ramadan application.

## 📂 Directory Tree

```
noor-e-ramadan/
│
├── 📄 server.js                    # Custom Node.js server with Socket.io
├── 📄 package.json                 # Dependencies and scripts
├── 📄 tsconfig.json                # TypeScript configuration
├── 📄 next.config.js               # Next.js configuration
├── 📄 tailwind.config.ts           # Tailwind CSS configuration
├── 📄 postcss.config.js            # PostCSS configuration
├── 📄 .eslintrc.json               # ESLint configuration
├── 📄 .gitignore                   # Git ignore rules
├── 📄 .env.example                 # Environment variables template
├── 📄 README.md                    # Project documentation
│
├── 📁 app/                         # Next.js 14 App Router
│   ├── layout.tsx                  # Root layout with fonts
│   ├── page.tsx                    # Home page
│   ├── globals.css                 # Global styles & theme
│   │
│   └── 📁 api/                     # API Routes
│       └── 📁 gemini/
│           └── route.ts            # Gemini AI API endpoint
│
├── 📁 components/                  # React Components
│   ├── README.md                   # Components documentation
│   │
│   ├── 📁 dashboard/               # Dashboard components
│   │   ├── Dashboard.tsx           # (To be created)
│   │   ├── Timeline.tsx            # (To be created)
│   │   └── StatsCard.tsx           # (To be created)
│   │
│   ├── 📁 prayer/                  # Prayer-related components
│   │   ├── PrayerTimes.tsx         # (To be created)
│   │   ├── NextPrayer.tsx         # (To be created)
│   │   ├── Countdown.tsx           # (To be created)
│   │   └── SehriIftar.tsx          # (To be created)
│   │
│   ├── 📁 productivity/            # Productivity tracker components
│   │   ├── QuranTracker.tsx        # (To be created)
│   │   ├── DailyAmol.tsx           # (To be created)
│   │   └── DuaCard.tsx             # (To be created)
│   │
│   ├── 📁 ai/                      # AI Bot components
│   │   ├── ChatWidget.tsx          # (To be created)
│   │   ├── ChatMessage.tsx         # (To be created)
│   │   └── ChatInput.tsx           # (To be created)
│   │
│   └── 📁 common/                  # Shared components
│       ├── Button.tsx               # ✅ Reusable button
│       └── Card.tsx                # ✅ Reusable card
│
├── 📁 hooks/                       # Custom React Hooks
│   └── useSocket.ts                # ✅ Socket.io connection hook
│
├── 📁 lib/                         # Utility Functions
│   ├── prayer-times.ts             # ✅ Prayer time utilities
│   └── storage.ts                  # ✅ LocalStorage utilities
│
└── 📁 types/                       # TypeScript Type Definitions
    └── index.ts                    # ✅ All type definitions
```

## 🔧 Key Files Explained

### `server.js`
- Custom Node.js HTTP server
- Integrates Next.js with Socket.io
- Handles real-time prayer time calculations
- Broadcasts server time, prayer times, and active user count
- Location: Dhaka, Bangladesh (configurable via env)

### `hooks/useSocket.ts`
- React hook for Socket.io connection
- Manages connection state
- Handles real-time data updates
- Auto-reconnection logic

### `lib/prayer-times.ts`
- Utility functions for formatting prayer times
- Time remaining calculations
- Prayer name and icon mappings

### `lib/storage.ts`
- LocalStorage wrapper for guest users
- Type-safe storage operations
- Handles SSR safely

### `app/api/gemini/route.ts`
- Next.js API route for Gemini AI
- Handles chat requests
- Maintains conversation context
- System prompt for Islamic assistant

## 🚀 Next Steps

1. **Dashboard Components**: Create main dashboard with timeline
2. **Prayer Components**: Build prayer times display and countdowns
3. **Productivity Components**: Implement Quran tracker and Daily Amol
4. **AI Chat Widget**: Build floating chat interface
5. **Mobile Navigation**: Add bottom nav bar for mobile
6. **Desktop Sidebar**: Add sidebar for desktop view

## 📝 Environment Variables

Required in `.env`:
- `GEMINI_API_KEY`: Google Gemini API key
- `PORT`: Server port (default: 3000)
- `LATITUDE`: Location latitude (default: 23.8103)
- `LONGITUDE`: Location longitude (default: 90.4125)

## 🎨 Design System

- **Colors**: Islamic Green (#0d5d31), Gold (#d4af37), White
- **Fonts**: Inter (sans), Amiri (Arabic)
- **Animations**: Framer Motion
- **Styling**: Tailwind CSS with custom theme
