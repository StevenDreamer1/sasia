import { io } from "socket.io-client";

// For Client-side
export const socket = io("http://localhost:4000", {
  autoConnect: false,
});

// If you are trying to use socket.io on the server-side within Next.js:
// Note: Next.js App Router doesn't support a persistent 'getIO' easily.
// Usually, you emit from the frontend or use a separate backend.