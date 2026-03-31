require("dotenv").config({ path: "./.env" });

const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const path = require("path");

const connectDB = require("./config/db");
const { initSocket } = require("./socket/socket");
const { errorHandler } = require("./middleware/error.middleware");

const authRoutes = require("./routes/auth.routes");
const userRoutes = require("./routes/user.routes");
const messageRoutes = require("./routes/message.routes");

// ── Connect Database ──────────────────────────────────────────
connectDB();

const app = express();

// ── Core Middleware ───────────────────────────────────────────
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());


const allowedOrigins = [
  "http://localhost:5173",
  process.env.CLIENT_URL, // Vercel URL
];

app.use(
  cors({
    origin: function (origin, callback) {
      console.log("Incoming Origin:", origin); // DEBUG

      // allow requests with no origin (like Postman)
      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        console.error("CORS Blocked:", origin);
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);

// ── API Routes ────────────────────────────────────────────────
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/messages", messageRoutes);

// ── Health check ──────────────────────────────────────────────
app.get("/api/health", (req, res) => {
  res.json({
    success: true,
    message: "Server is running ",
    env: process.env.NODE_ENV,
  });
});

// ── Serve React build in production ──────────────────────────
if (process.env.NODE_ENV === "production") {
  const __dirname_root = path.resolve();
  app.use(express.static(path.join(__dirname_root, "frontend", "dist")));

  app.get("*", (req, res) => {
    res.sendFile(
      path.join(__dirname_root, "frontend", "dist", "index.html")
    );
  });
}

// ── Global Error Handler ─────────────────────────────────────
app.use(errorHandler);

// ── Initialize Socket.IO + start HTTP server ─────────────────
const PORT = process.env.PORT || 5000;
const server = initSocket(app);

server.listen(PORT, () => {
  console.log(
    `\nServer running on port ${PORT} [${
      process.env.NODE_ENV || "development"
    }]`
  );
  console.log(`Socket.IO ready`);
  console.log(`API: http://localhost:${PORT}/api\n`);
});

// ── Graceful shutdown ─────────────────────────────────────────
process.on("unhandledRejection", (err) => {
  console.error("Unhandled Rejection:", err.message);
  server.close(() => process.exit(1));
});