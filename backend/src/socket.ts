import { Server } from "socket.io";
import http from "http";
import { Express } from "express";
import { initSocket } from "./utils/socket"; // ✅ NEW

export const createSocketServer = (app: Express) => {
  const server = http.createServer(app);

  const io = new Server(server, {
    cors: {
      origin: "*",
      methods: ["GET", "POST", "PUT", "DELETE"],
      credentials: true
    },
    allowEIO3: true,
    transports: ['websocket', 'polling']
  });

  initSocket(io); // ✅ Store globally for other files

  io.on("connection", (socket) => {
    console.log(`🟢 Socket connected: ${socket.id}`);

    socket.on("joinWorkspace", (workspaceId: string) => {
      socket.join(workspaceId);
      console.log(`User joined workspace ${workspaceId}`);
    });

    socket.on("disconnect", () => {
      console.log(`🔴 Socket disconnected: ${socket.id}`);
    });
  });

  return server;
};
