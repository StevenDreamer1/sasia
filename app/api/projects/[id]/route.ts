import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import dbConnect from "@/lib/mongodb";
import ServiceRequest from "@/models/ServiceRequest";
import User from "@/models/User"; // ✅ Import User model
import { authOptions } from "@/lib/authOptions";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { id } = await params;
    await dbConnect();

    // 1. Find the Project
    const project = await ServiceRequest.findById(id);
    if (!project) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    // 2. Find the Logged-in User (to get their _id)
    const currentUser = await User.findOne({ email: session.user?.email });

    // 3. SMART SECURITY CHECK
    // Allow if Admin
    const isAdmin = session.user?.email === process.env.ADMIN_EMAIL;
    
    // Allow if Email matches
    const isEmailOwner = project.user === session.user?.email;
    
    // Allow if Database ID matches (The most reliable check)
    // We convert both to strings to ensure they match safely
    const isIdOwner = currentUser && project.userId && 
                      project.userId.toString() === currentUser._id.toString();

    // If NONE of these are true, block access
    if (!isAdmin && !isEmailOwner && !isIdOwner) {
      console.log("⛔ Access Denied for:", session.user?.email);
      return NextResponse.json({ error: "Access Denied" }, { status: 403 });
    }

    return NextResponse.json(project);
  } catch (error) {
    console.error("Project Details Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}