const http = require("http");
const { Server } = require("socket.io");
const { PrayerTimes, Coordinates, CalculationMethod } = require("adhan");
require("dotenv").config();

const PORT = process.env.PORT || 8000;

const server = http.createServer();

// const io = new Server(server, {
//   cors: {
//     origin: ["http://localhost:3000", "http://127.0.0.1:3000"],
//     methods: ["GET", "POST"],
//     credentials: true,
//   },
// });

const io = new Server(server, {
  cors: {
    origin: [
      "http://localhost:3000",
      "https://your-app-name.vercel.app" // ⚠️ ডেপ্লয় করার পর Vercel থেকে পাওয়া লিঙ্কটি এখানে বসাবেন
    ],
    methods: ["GET", "POST"],
    credentials: true,
  },
});

const DHAKA_COORDINATES = new Coordinates(23.8103, 90.4125);
const CALCULATION_METHOD = CalculationMethod.Karachi();

// নামাজের সময় ক্যালকুলেশন ফাংশন
function getPrayerData(date) {
  const p = new PrayerTimes(DHAKA_COORDINATES, date, CALCULATION_METHOD);
  
  // ড্যাশবোর্ড এই নামগুলো আশা করছে
  const times = {
    fajr: p.fajr,
    sunrise: p.sunrise,
    dhuhr: p.dhuhr,
    asr: p.asr,
    maghrib: p.maghrib,
    isha: p.isha,
  };

  const now = new Date();
  let next = null;

  // পরবর্তী নামাজ খুঁজে বের করা
  const entries = Object.entries(times);
  for (const [name, time] of entries) {
    if (time > now) {
      next = { name, time, remaining: time.getTime() - now.getTime() };
      break;
    }
  }

  // যদি আজকের সব নামাজ শেষ হয়ে যায়, তবে আগামীকালের ফজর
  if (!next) {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const tp = new PrayerTimes(DHAKA_COORDINATES, tomorrow, CALCULATION_METHOD);
    next = { name: 'fajr', time: tp.fajr, remaining: tp.fajr.getTime() - now.getTime() };
  }

  return { times, next };
}

let activeUsers = 0;

io.on("connection", (socket) => {
  activeUsers++;
  console.log(`👤 User connected. Total: ${activeUsers}`);
  io.emit("active-users", { count: activeUsers });

  const interval = setInterval(() => {
    const now = new Date();
    const { times, next } = getPrayerData(now);

    // ড্যাশবোর্ডের জন্য সঠিক ডাটা ফরম্যাট
    const serverTimeData = {
      prayers: times,
      nextPrayer: next,
      sehriIftar: {
        sehri: {
          end: times.fajr,
          remaining: times.fajr.getTime() - now.getTime()
        },
        iftar: {
          time: times.maghrib, // ড্যাশবোর্ড এখানে .time খুঁজছে
          remaining: times.maghrib.getTime() - now.getTime()
        }
      },
      serverTime: now.getTime()
    };

    // আপনার useSocket হুক 'server-time' ইভেন্টটি শুনছে
    socket.emit("server-time", serverTimeData);
  }, 1000);

  socket.on("disconnect", () => {
    activeUsers = Math.max(0, activeUsers - 1);
    io.emit("active-users", { count: activeUsers });
    clearInterval(interval);
  });
});

server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});