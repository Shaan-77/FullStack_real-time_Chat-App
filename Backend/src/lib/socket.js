// socket.js
import { Server } from "socket.io";

const userSocketMap = {};
let io;

export function initSocket(server) {
  io = new Server(server, {
    cors: {
      origin: ["http://localhost:5173", "http://localhost:5174"],
      credentials: true,
    },
  });

  io.on("connection", (socket) => {
    console.log("A User Connected", socket.id);

    const userId = socket.handshake.query.userId;
    if (userId) userSocketMap[userId] = socket.id;

    io.emit("onlineUsers", Object.keys(userSocketMap));

    socket.on("disconnect", () => {
      console.log("A User Disconnected", socket.id);
      delete userSocketMap[userId];
      io.emit("onlineUsers", Object.keys(userSocketMap));
    });
  });
}

export function getRecieverSocketId(userId) {
  return userSocketMap[userId];
}

export { io };
