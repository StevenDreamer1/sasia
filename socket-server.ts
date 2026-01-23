import { Server } from "socket.io";
import http from "http";
import mongoose from "mongoose";

const MONGO_URI = process.env.MONGO_URI || "mongodb+srv://stifenadmin:Stifen505@sasia.5ezxgbc.mongodb.net/?appName=Sasia";

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

const server = http.createServer((req, res) => {
  // Handle health check for Render
  if (req.url === '/') {
    res.writeHead(200);
    res.end('Socket Server is Running');
  }
});

const io = new Server(server, {
  cors: { 
    origin: "*", // ✅ Allow Vercel (and localhost) to connect
    methods: ["GET", "POST"] 
  },
});

io.on("connection", (socket) => {
  console.log("🔌 New connection:", socket.id); // Check Render logs for this

  socket.on("join_room", async (room) => {
    if (!room || room.includes("user_admin")) return; 
    socket.join(room);
    
    try {
      const history = await Message.find({ projectId: room }).sort({ createdAt: 1 });
      socket.emit("load_history", history);
    } catch (err) { console.error(err); }
  });

  socket.on("send_message", async (data) => {
    try {
      const newMessage = await Message.create({
        projectId: data.projectId,
        sender: data.sender,
        text: data.text,
      });

      io.to(data.projectId).emit("receive_message", newMessage);
    } catch (err) { console.error(err); }
  });
});

const PORT = process.env.PORT || 4000;
server.listen(PORT, () => {
  console.log(`🚀 Socket Server running on port ${PORT}`);
});