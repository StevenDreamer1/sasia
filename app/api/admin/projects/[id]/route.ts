import { NextResponse } from "next/server";
import mongoose from "mongoose";
import Project from "@/models/Project";

const MONGO_URI = "mongodb+srv://stephen:YOUR_REAL_PASSWORD_HERE@cluster0.xv12z.mongodb.net/sasia_db?retryWrites=true&w=majority";

const connectDB = async () => {
  if (mongoose.connection.readyState === 0) {
    await mongoose.connect(MONGO_URI);
  }
};

// 1. GET: Fetch Project Details
export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> } // Fix for Next.js 15+ params type
) {
  try {
    await connectDB();
    const { id } = await params; // Await params in newer Next.js versions
    const project = await Project.findById(id);
    
    if (!project) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    return NextResponse.json(project);
  } catch (error) {
    return NextResponse.json({ error: "Server Error" }, { status: 500 });
  }
}

// 2. PATCH: Update Status & Link (Submit Work)
export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    const { id } = await params;
    const body = await req.json(); // Expecting { status: "Completed", finalLink: "..." }

    const updatedProject = await Project.findByIdAndUpdate(
      id,
      { 
        status: body.status, 
        finalLink: body.finalLink 
      },
      { new: true } // Return the updated document
    );

    return NextResponse.json(updatedProject);
  } catch (error) {
    return NextResponse.json({ error: "Update Failed" }, { status: 500 });
  }
}