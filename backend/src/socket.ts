import { Server } from "socket.io";
import http from "http";
import { Express } from "express";

let io: Server;

export const createSocketServer = (app: Express) => {
  const server = http.createServer(app);

  io = new Server(server, {
    cors: {
      origin: "*", // Allow all origins for testing
      methods: ["GET", "POST", "PUT", "DELETE"],
      credentials: true
    },
    allowEIO3: true, // Allow Engine.IO v3 clients
    transports: ['websocket', 'polling']
  });

  // Socket event listeners
  io.on("connection", (socket) => {
    console.log(`🟢 Socket connected: ${socket.id}`);

    socket.on("joinWorkspace", (workspaceId: string) => {
      socket.join(workspaceId);
      console.log(`User joined workspace ${workspaceId}`);
    });

    socket.on("task:update", (data) => {
      io.to(data.workspaceId).emit("task:updated", data);
    });

    socket.on("disconnect", () => {
      console.log(`🔴 Socket disconnected: ${socket.id}`);
    });
  });

  return server;
};

export const getIO = () => io;