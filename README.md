# Noor-e-Ramadan 🌙

A **Pro-Level** Real-Time Islamic Companion App built with Next.js 14, Socket.io, and modern web technologies.

## 🚀 Features

- **Real-Time Server Sync**: WebSocket-powered accurate prayer times and countdowns
- **Live Iftar/Sehri Countdown**: Millisecond-precise countdown timers
- **Live Worshippers Counter**: See how many users are active in real-time
- **Smart Dashboard**: Visual timeline and next prayer alerts
- **Productivity Tracker**: Quran journey, Daily Amol checklist, and context-aware Dua cards
- **AI Islamic Bot**: Gemini-powered assistant for Islamic questions

## 🛠 Tech Stack

- **Frontend**: Next.js 14 (App Router), TypeScript, Tailwind CSS, Framer Motion
- **Backend**: Node.js Custom Server with Socket.io
- **Database**: LocalStorage (guest users) + MongoDB option
- **AI**: Google Gemini API
- **Location**: Dhaka, Bangladesh (configurable)

## 📦 Installation

1. Install dependencies:
```bash
npm install
```

2. Create `.env` file (copy from `.env.example`):
```bash
cp .env.example .env
```

3. Add your Gemini API key to `.env`:
```
GEMINI_API_KEY=your_api_key_here
```

4. Run the development server:
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000)

## 🏗 Project Structure

```
├── app/                    # Next.js App Router
│   ├── layout.tsx         # Root layout
│   ├── page.tsx           # Home page
│   └── globals.css        # Global styles
├── components/             # React components
├── hooks/                  # Custom React hooks
│   └── useSocket.ts       # Socket.io hook
├── lib/                    # Utility functions
│   ├── prayer-times.ts    # Prayer time utilities
│   └── storage.ts         # LocalStorage utilities
├── types/                  # TypeScript types
│   └── index.ts           # Type definitions
├── server.js               # Custom Node.js server with Socket.io
└── package.json           # Dependencies
```

## 🔧 Configuration

### Location Settings
Edit `server.js` or set environment variables:
- `LATITUDE`: Default 23.8103 (Dhaka)
- `LONGITUDE`: Default 90.4125 (Dhaka)

### Server Port
Set `PORT` environment variable (default: 3000)

## 📝 Development

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run lint` - Run ESLint

## 🎨 Design System

- **Colors**: Deep Green (#0d5d31), Gold (#d4af37), White
- **Fonts**: Inter (sans-serif), Amiri (Arabic)
- **Theme**: Modern Islamic aesthetic

## 📄 License

Private project - All rights reserved
