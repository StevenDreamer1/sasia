import { NextResponse } from "next/server";
import mongoose from "mongoose";
import Project from "@/models/Project";

const MONGO_URI = "mongodb+srv://stifenadmin:Stifen505@sasia.5ezxgbc.mongodb.net/?appName=Sasia"

const connectDB = async () => {
  if (mongoose.connection.readyState === 0) {
    await mongoose.connect(MONGO_URI);
  }
};

export async function GET() {
  try {
    await connectDB();
    // Fetch ALL projects, sorted by newest first
    const projects = await Project.find({}).sort({ createdAt: -1 });
    return NextResponse.json(projects);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch projects" }, { status: 500 });
  }
}