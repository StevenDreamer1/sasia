import { Server } from "socket.io";
import http from "http";
import mongoose from "mongoose";

// --- Database Configuration ---
const MONGO_URI = "mongodb+srv://stifenadmin:Stifen505@sasia.5ezxgbc.mongodb.net/?appName=Sasia";

mongoose.connect(MONGO_URI)
  .then(() => console.log("✅ Socket DB Connected"))
  .catch((err) => console.error("❌ DB Error:", err));

const MessageSchema = new mongoose.Schema({
  projectId: { type: String, required: true },
  sender: { type: String, required: true },
  text: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

const Message = mongoose.models.Message || mongoose.model("Message", MessageSchema);

// --- Server Setup ---
const server = http.createServer();

const io = new Server(server, {
  cors: {
    // ✅ Secure CORS: Allows local dev and your production Vercel URL
    origin: [
      "http://localhost:3000",
      "http://localhost:3001",
      process.env.FRONTEND_URL || "*" 
    ],
    methods: ["GET", "POST"],
    credentials: true
  },
});

// --- Socket Logic ---
io.on("connection", (socket) => {
  console.log(`👤 User Connected: ${socket.id}`);

  // Admin Feed Join: For the global dashboard notifications
  socket.on("join_admin_feed", () => {
    socket.join("admin_feed");
    console.log("🛠️ Admin joined the global notification feed");
  });

  // Chat Room Join: Loading history and joining specific project rooms
  socket.on("join_room", async (room) => {
    // 🛑 BLOCK ADMIN SELF-JOIN (Your specific security logic)
    if (room && room.includes("user_admin")) {
      console.log("🚫 Blocked Admin self-join attempt:", room);
      return;
    }

    socket.join(room);
    console.log(`📂 Joined room: ${room}`);

    try {
      // Fetch history and send to the user who just joined
      const history = await Message.find({ projectId: room }).sort({ createdAt: 1 });
      socket.emit("load_history", history);
    } catch (err) {
      console.error("❌ Error fetching history:", err);
    }
  });

  // Sending Messages
  socket.on("send_message", async (data) => {
    try {
      // 1. Save to Database
      const newMessage = await Message.create({
        projectId: data.projectId,
        sender: data.sender,
        text: data.text,
        createdAt: new Date()
      });

      // 2. Broadcast to everyone in that specific project room
      io.to(data.projectId).emit("receive_message", newMessage);

      // 3. Admin Notification Logic
      const isSenderAdmin = data.sender.toLowerCase().includes("admin");
      if (!isSenderAdmin) {
        // Send alert to the admin_feed room if the message is from a client
        io.to("admin_feed").emit("admin_message_alert", {
          sender: data.sender,
          text: data.text,
          projectId: data.projectId,
          createdAt: newMessage.createdAt
        });
      }
    } catch (err) {
      console.error("❌ Error saving/sending message:", err);
    }
  });

  socket.on("disconnect", () => {
    console.log(`🔌 User Disconnected: ${socket.id}`);
  });
});

// --- Start Server ---
const PORT = process.env.PORT || 4000;
server.listen(PORT, () => {
  console.log(`🚀 Socket Server running on port ${PORT}`);
});