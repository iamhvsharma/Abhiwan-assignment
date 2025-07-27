import app from "./app";
import { createSocketServer } from "./socket";

const PORT = process.env.PORT || 8000;
const server = createSocketServer(app);

server.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`🔌 WebSocket server ready`);
});
