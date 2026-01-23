import { NextResponse } from "next/server";
import mongoose from "mongoose";
import dbConnect from "@/lib/mongodb";

// Define Message Schema (Same as socket server)
const MessageSchema = new mongoose.Schema({
  projectId: { type: String, required: true },
  sender: { type: String, required: true },
  text: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

// Prevent overwrite error
const Message = mongoose.models.Message || mongoose.model("Message", MessageSchema);

export async function GET() {
  try {
    await dbConnect();

    // 1. Find all unique senders who are NOT 'Admin'
    // We aggregate to get the last message time + sender email
    const senders = await Message.aggregate([
      { $match: { sender: { $ne: "Admin" } } }, // Ignore Admin's own messages
      { 
        $group: { 
          _id: "$sender", 
          lastMessage: { $last: "$text" },
          lastActive: { $max: "$createdAt" }
        } 
      },
      { $sort: { lastActive: -1 } } // Show newest first
    ]);

    // 2. Format for the UI
    const inboxList = senders.map((s) => ({
      _id: s._id, // This is the email (e.g., palepustifen@gmail.com)
      lastMessage: s.lastMessage,
      time: s.lastActive
    }));

    return NextResponse.json(inboxList);
  } catch (error) {
    console.error("Inbox Error:", error);
    return NextResponse.json([], { status: 500 });
  }
}