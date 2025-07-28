import { createContext, useEffect, useState } from "react";
import io, { Socket } from "socket.io-client";

const SOCKET_URL = "http://localhost:8000"; // or wherever your server runs

export const SocketContext = createContext<{
  socket: Socket | null;
} | null>(null);

export const SocketProvider = ({ children }: { children: React.ReactNode }) => {
  const [socket, setSocket] = useState<Socket | null>(null);

  useEffect(() => {
    const socketInstance = io(SOCKET_URL, {
      withCredentials: true,
    });

    setSocket(socketInstance);

    return () => {
      socketInstance.disconnect();
    };
  }, []);

  return (
    <SocketContext.Provider value={{ socket }}>
      {children}
    </SocketContext.Provider>
  );
};
