const { createServer } = require("http");
const { parse } = require("url");
const next = require("next");
const { Server } = require("socket.io");
const { PrayerTimes, Coordinates, CalculationMethod } = require("adhan");
require("dotenv").config();

// রেলওয়েতে প্রোডাকশন মোড ডিফল্ট থাকে
const dev = process.env.NODE_ENV !== "production";
const app = next({ dev });
const handle = app.getRequestHandler();

const PORT = process.env.PORT || 8000;

// নামাজের সময় ক্যালকুলেশন মেথড (Dhaka)
const DHAKA_COORDINATES = new Coordinates(23.8103, 90.4125);
const CALCULATION_METHOD = CalculationMethod.Karachi();

function getPrayerData(date) {
  const p = new PrayerTimes(DHAKA_COORDINATES, date, CALCULATION_METHOD);
  
  const times = {
    fajr: p.fajr,
    sunrise: p.sunrise,
    dhuhr: p.dhuhr,
    asr: p.asr,
    maghrib: p.maghrib,
    isha: p.isha,
  };

  const now = new Date();
  let nextPrayer = null;

  const entries = Object.entries(times);
  for (const [name, time] of entries) {
    if (time > now) {
      nextPrayer = { name, time, remaining: time.getTime() - now.getTime() };
      break;
    }
  }

  if (!nextPrayer) {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const tp = new PrayerTimes(DHAKA_COORDINATES, tomorrow, CALCULATION_METHOD);
    nextPrayer = { name: 'fajr', time: tp.fajr, remaining: tp.fajr.getTime() - now.getTime() };
  }

  return { times, next: nextPrayer };
}

app.prepare().then(() => {
  // HTTP সার্ভার তৈরি যা Next.js রিকোয়েস্ট হ্যান্ডেল করবে
  const httpServer = createServer((req, res) => {
    const parsedUrl = parse(req.url, true);
    handle(req, res, parsedUrl);
  });

  // Socket.io সেটআপ (একই সার্ভারের ওপর)
  const io = new Server(httpServer, {
    cors: {
      origin: "*", // লাইভ অ্যাপের জন্য এটি নিরাপদ কারণ একই ডোমেইনে চলছে
      methods: ["GET", "POST"],
    },
  });

  let activeUsers = 0;

  io.on("connection", (socket) => {
    activeUsers++;
    console.log(`👤 User connected. Total: ${activeUsers}`);
    io.emit("active-users", { count: activeUsers });

    const interval = setInterval(() => {
      const now = new Date();
      const { times, next: nextP } = getPrayerData(now);

      const serverTimeData = {
        prayers: times,
        nextPrayer: nextP,
        sehriIftar: {
          sehri: {
            end: times.fajr,
            remaining: times.fajr.getTime() - now.getTime()
          },
          iftar: {
            time: times.maghrib,
            remaining: times.maghrib.getTime() - now.getTime()
          }
        },
        serverTime: now.getTime()
      };

      socket.emit("server-time", serverTimeData);
    }, 1000);

    socket.on("disconnect", () => {
      activeUsers = Math.max(0, activeUsers - 1);
      io.emit("active-users", { count: activeUsers });
      clearInterval(interval);
      console.log("👤 User disconnected");
    });
  });

  httpServer.listen(PORT, (err) => {
    if (err) throw err;
    console.log(`
╔════════════════════════════════════════╗
║     🌙 NOOR-E-RAMADAN LIVE SERVER 🌙   ║
╠════════════════════════════════════════╣
║  ✅ Status: Running                    ║
║  🔗 Port: ${PORT}                       ║
║  📍 Location: Dhaka, Bangladesh        ║
╚════════════════════════════════════════╝
    `);
  });
});