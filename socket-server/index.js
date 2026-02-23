const express = require("express");
const http = require("http");
const cors = require("cors");
const { Server } = require("socket.io");
const adhan = require("adhan");
const { formatInTimeZone } = require("date-fns-tz");

const app = express();
const server = http.createServer(app);

const PORT = process.env.PORT || 8000;
const FRONTEND_URL = process.env.FRONTEND_URL || "*";
const TZ = "Asia/Dhaka";

// Bangladesh divisions (approx city-center coords)
const DIVISIONS = {
  dhaka: { label: "Dhaka", lat: 23.8103, lng: 90.4125 },
  chattogram: { label: "Chattogram", lat: 22.3569, lng: 91.7832 },
  rajshahi: { label: "Rajshahi", lat: 24.3745, lng: 88.6042 },
  khulna: { label: "Khulna", lat: 22.8456, lng: 89.5403 },
  barishal: { label: "Barishal", lat: 22.7010, lng: 90.3535 },
  rangpur: { label: "Rangpur", lat: 25.7439, lng: 89.2752 },
  sylhet: { label: "Sylhet", lat: 24.8949, lng: 91.8687 },
  mymensingh: { label: "Mymensingh", lat: 24.7471, lng: 90.4203 },
};

function safeDivisionKey(key) {
  if (!key) return "dhaka";
  const k = String(key).toLowerCase().trim();
  return DIVISIONS[k] ? k : "dhaka";
}

function msRemaining(targetDate, nowDate) {
  return Math.max(0, targetDate.getTime() - nowDate.getTime());
}

function iso(dateObj) {
  return dateObj.toISOString();
}

function formatGregorian(now) {
  return formatInTimeZone(now, TZ, "dd MMM yyyy, h:mm:ss a");
}

function formatHijri(now) {
  // Node Intl supports Islamic calendar formatting (no extra library needed)
  try {
    const fmt = new Intl.DateTimeFormat("en-TN-u-ca-islamic", {
      timeZone: TZ,
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
    return fmt.format(now);
  } catch {
    return ""; // fallback
  }
}

function getPrayerTimesForDate(now, coords) {
  const c = new adhan.Coordinates(coords.lat, coords.lng);

  const params = adhan.CalculationMethod.Karachi();
  params.madhab = adhan.Madhab.Hanafi;

  // Build a date using Dhaka-local Y/M/D so "today" matches Bangladesh date
  const y = Number(formatInTimeZone(now, TZ, "yyyy"));
  const m = Number(formatInTimeZone(now, TZ, "M"));
  const d = Number(formatInTimeZone(now, TZ, "d"));

  const dhakaMidnightUTC = new Date(Date.UTC(y, m - 1, d, 0, 0, 0));
  return new adhan.PrayerTimes(c, dhakaMidnightUTC, params);
}

function pickNextPrayer(now, ptToday) {
  const order = [
    ["fajr", ptToday.fajr],
    ["sunrise", ptToday.sunrise],
    ["dhuhr", ptToday.dhuhr],
    ["asr", ptToday.asr],
    ["maghrib", ptToday.maghrib],
    ["isha", ptToday.isha],
  ];
  for (const [name, time] of order) {
    if (now < time) return { name, time };
  }
  return null;
}

function buildPayload(now, divisionKey, activeUsers) {
  const division = DIVISIONS[divisionKey] || DIVISIONS.dhaka;

  const ptToday = getPrayerTimesForDate(now, division);
  const tomorrow = new Date(now.getTime() + 24 * 60 * 60 * 1000);
  const ptTomorrow = getPrayerTimesForDate(tomorrow, division);

  const prayers = {
    fajr: iso(ptToday.fajr),
    sunrise: iso(ptToday.sunrise),
    dhuhr: iso(ptToday.dhuhr),
    asr: iso(ptToday.asr),
    maghrib: iso(ptToday.maghrib),
    isha: iso(ptToday.isha),
  };

  const next = pickNextPrayer(now, ptToday);
  const nextPrayer = next
    ? { name: next.name, time: iso(next.time), remaining: msRemaining(next.time, now) }
    : { name: "fajr", time: iso(ptTomorrow.fajr), remaining: msRemaining(ptTomorrow.fajr, now) };

  // Sehri end = Fajr; Iftar = Maghrib
  const todayFajr = ptToday.fajr;
  const todayMaghrib = ptToday.maghrib;
  const tomorrowFajr = ptTomorrow.fajr;
  const tomorrowMaghrib = ptTomorrow.maghrib;

  const sehriEnd = now >= todayFajr ? tomorrowFajr : todayFajr;
  const iftarTime = now >= todayMaghrib ? tomorrowMaghrib : todayMaghrib;

  const sehriIftar = {
    sehri: { end: iso(sehriEnd), remaining: msRemaining(sehriEnd, now) },
    iftar: { time: iso(iftarTime), remaining: msRemaining(iftarTime, now) },
  };

  const dates = {
    gregorian: formatGregorian(now),
    hijri: formatHijri(now),
  };

  return {
    serverTime: iso(now),
    dates,
    location: { key: divisionKey, name: division.label },
    prayers,
    nextPrayer,
    sehriIftar,
    activeUsers,
  };
}

// CORS
app.use(
  cors({
    origin: FRONTEND_URL === "*" ? true : FRONTEND_URL,
    credentials: true,
  })
);

app.get("/", (req, res) => res.status(200).send("Socket server is running ✅"));

const io = new Server(server, {
  cors: { origin: FRONTEND_URL === "*" ? true : FRONTEND_URL, credentials: true },
  transports: ["websocket", "polling"],
});

// per-socket location state
const socketLocation = new Map(); // socket.id -> divisionKey
let activeUsers = 0;

// helper to join room by division
function roomOf(key) {
  return `loc:${key}`;
}

io.on("connection", (socket) => {
  activeUsers++;

  // default location = dhaka
  const initialKey = "dhaka";
  socketLocation.set(socket.id, initialKey);
  socket.join(roomOf(initialKey));

  // send initial payload immediately
  socket.emit("server-time", buildPayload(new Date(), initialKey, activeUsers));
  io.emit("active-users", { count: activeUsers });

  socket.on("set-location", (payload) => {
    const key = safeDivisionKey(payload?.division || payload?.key || payload?.location);

    const prev = socketLocation.get(socket.id) || "dhaka";
    if (prev !== key) socket.leave(roomOf(prev));

    socketLocation.set(socket.id, key);
    socket.join(roomOf(key));

    // ack + immediate update
    socket.emit("location-set", { key, name: DIVISIONS[key].label });
    socket.emit("server-time", buildPayload(new Date(), key, activeUsers));
  });

  socket.on("disconnect", () => {
    socketLocation.delete(socket.id);
    activeUsers = Math.max(0, activeUsers - 1);
    io.emit("active-users", { count: activeUsers });
  });
});

// every 1s, emit per-division room (efficient)
setInterval(() => {
  const now = new Date();
  for (const key of Object.keys(DIVISIONS)) {
    const room = io.sockets.adapter.rooms.get(roomOf(key));
    if (room && room.size > 0) {
      io.to(roomOf(key)).emit("server-time", buildPayload(now, key, activeUsers));
    }
  }
}, 1000);

server.listen(PORT, "0.0.0.0", () => {
  console.log(`✅ Socket server listening on 0.0.0.0:${PORT}`);
  console.log(`✅ CORS FRONTEND_URL: ${FRONTEND_URL}`);
  console.log(`✅ TZ: ${TZ}`);
});
