import mongoose from "mongoose";

const ProjectSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  service: { type: String, required: true },
  title: { type: String, required: true },
  instructions: { type: String },
  driveLink: { type: String },
  files: [String],
  status: { type: String, default: "New Request" },
  deliveryLink: { type: String, default: "" }, // ✅ New field for final delivery
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.models.Project || mongoose.model("Project", ProjectSchema);