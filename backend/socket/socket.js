const { Server } = require("socket.io");
const http = require("http");

// ── These are exported so controllers can emit events ─────────
let io;
// userId → socketId map (tracks online users)
const userSocketMap = {};

/**
 * Returns the socket ID for a given userId (if online)
 */
const getReceiverSocketId = (receiverId) => {
  return userSocketMap[receiverId.toString()];
};

/**
 * Initializes Socket.IO on the given Express app.
 * Returns the http.Server so it can be used in server.js.
 */
const initSocket = (app) => {
  const server = http.createServer(app);

  io = new Server(server, {
    cors: {
      origin: process.env.CLIENT_URL || "http://localhost:5173",
      methods: ["GET", "POST"],
      credentials: true,
    },
    // Reconnection settings
    pingTimeout: 60000,
  });

  io.on("connection", (socket) => {
    console.log(`🔌 Socket connected: ${socket.id}`);

    // Client sends their userId on connect
    const userId = socket.handshake.query.userId;

    if (userId) {
      userSocketMap[userId] = socket.id;
      console.log(`👤 User online: ${userId}`);
    }

    // Broadcast updated online users list to ALL clients
    io.emit("getOnlineUsers", Object.keys(userSocketMap));

    // ── Typing indicators ────────────────────────────────────
    socket.on("typing", ({ receiverId }) => {
      const receiverSocketId = getReceiverSocketId(receiverId);
      if (receiverSocketId) {
        io.to(receiverSocketId).emit("typing", { senderId: userId });
      }
    });

    socket.on("stopTyping", ({ receiverId }) => {
      const receiverSocketId = getReceiverSocketId(receiverId);
      if (receiverSocketId) {
        io.to(receiverSocketId).emit("stopTyping", { senderId: userId });
      }
    });

    // ── Cleanup on disconnect ─────────────────────────────────
    socket.on("disconnect", () => {
      console.log(`🔌 Socket disconnected: ${socket.id}`);
      if (userId) {
        delete userSocketMap[userId];
        io.emit("getOnlineUsers", Object.keys(userSocketMap));
      }
    });
  });

  return server;
};

module.exports = { initSocket, getReceiverSocketId, io: () => io };
