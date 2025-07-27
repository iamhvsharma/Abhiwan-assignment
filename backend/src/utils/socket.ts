import { Server } from "socket.io";

let io: Server;

export const initSocket = (server: Server) => {
  io = server;
};

export const getIO = () => {
  if (!io) throw new Error("Socket.IO not initialized");
  return io;
};
