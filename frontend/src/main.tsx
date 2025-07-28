import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { SocketProvider } from "./context/socket-context.tsx";

createRoot(document.getElementById("root")!).render(
  // main.tsx
  <SocketProvider>
    <App />
  </SocketProvider>
);
