const { createServer } = require('http');
const { parse } = require('url');
const next = require('next');
const { Server } = require('socket.io');
const { PrayerTimes, Coordinates, CalculationMethod } = require('adhan');
const { format, addMinutes, differenceInMilliseconds, isAfter, isBefore } = require('date-fns');
const { zonedTimeToUtc, utcToZonedTime } = require('date-fns-tz');

const dev = process.env.NODE_ENV !== 'production';
const hostname = process.env.HOSTNAME || '0.0.0.0';
const port = parseInt(process.env.PORT || '8000', 10);

// Initialize Next.js app
const app = next({ dev, hostname: 'localhost' }); // Next.js internal hostname
const handle = app.getRequestHandler();

// Location: Dhaka, Bangladesh
const DHAKA_COORDS = new Coordinates(
  parseFloat(process.env.LATITUDE || '23.8103'),
  parseFloat(process.env.LONGITUDE || '90.4125')
);

// Calculation method for Bangladesh (using Muslim World League)
const params = CalculationMethod.MuslimWorldLeague();
params.fajrAngle = 18;
params.ishaAngle = 18;

// Track active users
let activeUsers = new Set();

app.prepare().then(() => {
  const httpServer = createServer(async (req, res) => {
    try {
      const parsedUrl = parse(req.url, true);
      await handle(req, res, parsedUrl);
    } catch (err) {
      console.error('Error occurred handling', req.url, err);
      res.statusCode = 500;
      res.end('internal server error');
    }
  });

  // Initialize Socket.io
  const io = new Server(httpServer, {
    cors: {
      origin: '*',
      methods: ['GET', 'POST'],
    },
    transports: ['websocket', 'polling'],
  });

  // Calculate prayer times for today
  function getPrayerTimes(date = new Date()) {
    const prayerTimes = new PrayerTimes(DHAKA_COORDS, date, params);
    
    return {
      fajr: prayerTimes.fajr,
      sunrise: prayerTimes.sunrise,
      dhuhr: prayerTimes.dhuhr,
      asr: prayerTimes.asr,
      maghrib: prayerTimes.maghrib,
      isha: prayerTimes.isha,
    };
  }

  // Get next prayer
  function getNextPrayer(currentTime = new Date()) {
    const prayers = getPrayerTimes(currentTime);
    const prayerNames = ['fajr', 'sunrise', 'dhuhr', 'asr', 'maghrib', 'isha'];
    
    for (const name of prayerNames) {
      if (isAfter(prayers[name], currentTime)) {
        return {
          name,
          time: prayers[name],
          remaining: differenceInMilliseconds(prayers[name], currentTime),
        };
      }
    }
    
    // If no prayer found today, return tomorrow's Fajr
    const tomorrow = addMinutes(currentTime, 1440);
    const tomorrowPrayers = getPrayerTimes(tomorrow);
    return {
      name: 'fajr',
      time: tomorrowPrayers.fajr,
      remaining: differenceInMilliseconds(tomorrowPrayers.fajr, currentTime),
    };
  }

  // Get Sehri and Iftar times
  function getSehriIftarTimes(currentTime = new Date()) {
    const prayers = getPrayerTimes(currentTime);
    
    // Sehri ends at Fajr
    const sehriEnd = prayers.fajr;
    
    // Iftar is at Maghrib
    const iftar = prayers.maghrib;
    
    return {
      sehri: {
        end: sehriEnd,
        remaining: isBefore(currentTime, sehriEnd) 
          ? differenceInMilliseconds(sehriEnd, currentTime)
          : 0,
      },
      iftar: {
        time: iftar,
        remaining: isBefore(currentTime, iftar)
          ? differenceInMilliseconds(iftar, currentTime)
          : 0,
      },
    };
  }

  // Broadcast real-time updates
  function broadcastUpdates() {
    const serverTime = new Date();
    const prayers = getPrayerTimes(serverTime);
    const nextPrayer = getNextPrayer(serverTime);
    const sehriIftar = getSehriIftarTimes(serverTime);
    
    io.emit('server-time', {
      serverTime: serverTime.toISOString(),
      prayers: {
        fajr: prayers.fajr.toISOString(),
        sunrise: prayers.sunrise.toISOString(),
        dhuhr: prayers.dhuhr.toISOString(),
        asr: prayers.asr.toISOString(),
        maghrib: prayers.maghrib.toISOString(),
        isha: prayers.isha.toISOString(),
      },
      nextPrayer: {
        ...nextPrayer,
        time: nextPrayer.time.toISOString(),
      },
      sehriIftar: {
        sehri: {
          end: sehriIftar.sehri.end.toISOString(),
          remaining: sehriIftar.sehri.remaining,
        },
        iftar: {
          time: sehriIftar.iftar.time.toISOString(),
          remaining: sehriIftar.iftar.remaining,
        },
      },
      activeUsers: activeUsers.size,
    });
  }

  // Socket.io connection handling
  io.on('connection', (socket) => {
    console.log('Client connected:', socket.id);
    activeUsers.add(socket.id);
    
    // Send initial data
    broadcastUpdates();
    
    // Send active users count update
    io.emit('active-users', activeUsers.size);
    
    socket.on('disconnect', () => {
      console.log('Client disconnected:', socket.id);
      activeUsers.delete(socket.id);
      io.emit('active-users', activeUsers.size);
    });
    
    // Handle ping for keep-alive
    socket.on('ping', () => {
      socket.emit('pong', { serverTime: new Date().toISOString() });
    });
  });

  // Broadcast updates every second for real-time countdown
  setInterval(broadcastUpdates, 1000);

  httpServer
    .once('error', (err) => {
      console.error(err);
      process.exit(1);
    })
    .listen(port, () => {
      console.log(`> Ready on http://${hostname}:${port}`);
      console.log(`> Socket.io server running`);
      console.log(`> Location: Dhaka, Bangladesh (${DHAKA_COORDS.latitude}, ${DHAKA_COORDS.longitude})`);
    });
});
