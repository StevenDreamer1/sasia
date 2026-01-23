import { io } from "socket.io-client";

// ✅ Dynamic URL: Uses env var in production, localhost in dev
const URL = process.env.NEXT_PUBLIC_SOCKET_URL || "http://localhost:4000";

export const socket = io(URL, {
  autoConnect: false,
});