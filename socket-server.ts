import { Server } from "socket.io";
import http from "http";
import mongoose from "mongoose";
import Message from "./models/Message"; // Import the model

const server = http.createServer();
const io = new Server(server, {
  cors: { origin: "http://localhost:3000", methods: ["GET", "POST"] },
});

const MONGO_URI = "mongodb+srv://stifenadmin:Stifen505@sasia.5ezxgbc.mongodb.net/?appName=Sasia";
mongoose.connect(MONGO_URI).then(() => console.log("✅ Socket DB Connected"));

io.on("connection", (socket) => {
  socket.on("join_room", (projectId) => {
    socket.join(projectId);
  });

  socket.on("send_message", async (data) => {
    try {
      // ✅ 1. Save to MongoDB
      const newMessage = await Message.create({
        projectId: data.projectId,
        sender: data.sender,
        text: data.text
      });

      // ✅ 2. Broadcast to room (including sender for confirmation)
      io.to(data.projectId).emit("receive_message", newMessage);
    } catch (err) {
      console.error("❌ Message Save Error:", err);
    }
  });
});

server.listen(4000);