import { io } from "socket.io-client";

// ✅ Use the public Render URL in production
const URL = process.env.NEXT_PUBLIC_SOCKET_URL || "http://localhost:4000";

export const socket = io(URL, {
  autoConnect: false,
  transports: ["websocket", "polling"], // Try both for stability
});