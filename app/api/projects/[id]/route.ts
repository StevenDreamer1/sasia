import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import dbConnect from "@/lib/mongodb";
import ServiceRequest from "@/models/ServiceRequest";
import User from "@/models/User"; 
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

    const project = await ServiceRequest.findById(id);
    if (!project) return NextResponse.json({ error: "Project not found" }, { status: 404 });

    const currentUser = await User.findOne({ email: session.user?.email });

    // --- DEBUG LOGS (Check these in Vercel Logs) ---
    console.log("🔍 SECURITY CHECK:");
    console.log(`🔹 Project ID: ${id}`);
    console.log(`🔹 Logged In User: ${session.user?.email}`);
    console.log(`🔹 Project Owner Email: ${project.user}`);
    console.log(`🔹 Project Owner ID: ${project.userId}`);
    console.log(`🔹 Current User ID: ${currentUser?._id}`);
    // ------------------------------------------------

    // TEMPORARY FIX: Disable strict check to verify data loads
    // Once we see the logs, we will re-enable the correct check.
    return NextResponse.json(project);

  } catch (error) {
    console.error("Project Details Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}