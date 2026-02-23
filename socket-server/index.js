const express = require("express");
const http = require("http");
const cors = require("cors");
const { Server } = require("socket.io");

const app = express();

/**
 * IMPORTANT:
 * - Railway uses dynamic PORT via process.env.PORT
 * - Must listen on 0.0.0.0
 */
const PORT = process.env.PORT || 8000;

// If you want stricter CORS later, set FRONTEND_URL in Railway Variables.
const FRONTEND_URL = process.env.FRONTEND_URL || "*";

app.use(
  cors({
    origin: FRONTEND_URL === "*" ? true : FRONTEND_URL,
    credentials: true,
  })
);

app.get("/", (req, res) => {
  res.status(200).send("Socket server is running ✅");
});

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: FRONTEND_URL === "*" ? true : FRONTEND_URL,
    credentials: true,
  },
  transports: ["websocket"],
});

let activeUsers = 0;

io.on("connection", (socket) => {
  activeUsers++;
  io.emit("active-users", { count: activeUsers });

  // Emit server-time every 1s to this client
  const timer = setInterval(() => {
    socket.emit("server-time", {
      timestamp: Date.now(),
      iso: new Date().toISOString(),
    });
  }, 1000);

  socket.on("disconnect", () => {
    clearInterval(timer);
    activeUsers = Math.max(0, activeUsers - 1);
    io.emit("active-users", { count: activeUsers });
  });
});

server.listen(PORT, "0.0.0.0", () => {
  console.log(`✅ Socket server listening on 0.0.0.0:${PORT}`);
  console.log(`✅ FRONTEND_URL CORS: ${FRONTEND_URL}`);
});
