import { useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";

let socket: Socket;

const SocketTest = () => {
  const [isConnected, setIsConnected] = useState(false);
  const [socketId, setSocketId] = useState<string | null>(null);
  const [messages, setMessages] = useState<string[]>([]);

  useEffect(() => {
    // Replace with your actual backend port
    socket = io("http://localhost:8000", {
      transports: ["websocket"],
    });

    socket.on("connect", () => {
      if (!socket.id) return;

      setIsConnected(true);
      setSocketId(socket.id);
      console.log("🟢 Connected to socket:", socket.id);

      // Join workspace room (test)
      socket.emit("joinWorkspace", "1001");

      // Send dummy task update
      socket.emit("task:update", {
        workspaceId: "1001",
        data: "This is a test update from client",
      });
    });

    socket.on("task:updated", (data) => {
      console.log("📡 Received task update:", data);
      setMessages((prev) => [...prev, JSON.stringify(data)]);
    });

    socket.on("disconnect", () => {
      setIsConnected(false);
      console.log("🔴 Disconnected from socket");
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold">Socket.IO Test Page</h1>
      <p>Status: {isConnected ? "🟢 Connected" : "🔴 Disconnected"}</p>
      <p>Socket ID: {socketId}</p>

      <div className="mt-4">
        <h2 className="text-lg font-semibold">Messages:</h2>
        <ul className="mt-2">
          {messages.map((msg, idx) => (
            <li key={idx} className="bg-gray-200 p-2 my-1 rounded">
              {msg}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default SocketTest;
