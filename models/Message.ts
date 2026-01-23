import mongoose from "mongoose";

const MessageSchema = new mongoose.Schema({
  projectId: { type: String, required: true, index: true },
  sender: { type: String, required: true }, // "admin" or user email
  text: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.models.Message || mongoose.model("Message", MessageSchema);