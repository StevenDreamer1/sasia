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

    // Find the logged-in user to get their ID
    const currentUser = await User.findOne({ email: session.user?.email });

    // --- 🔒 FINAL SECURITY CHECK ---
    const isAdmin = session.user?.email === process.env.ADMIN_EMAIL;
    
    // Check 1: Does the saved email match?
    const isEmailOwner = project.user === session.user?.email;

    // Check 2: Does the Database ID match? (Convert both to strings to be safe)
    // We use safe navigation (?.) in case a field is missing
    const isIdOwner = currentUser?._id && project.userId && 
                      currentUser._id.toString() === project.userId.toString();

    if (!isAdmin && !isEmailOwner && !isIdOwner) {
      return NextResponse.json({ error: "Access Denied" }, { status: 403 });
    }
    // -------------------------------

    return NextResponse.json(project);
  } catch (error) {
    console.error("Project Error:", error);
    return NextResponse.json({ error: "Server Error" }, { status: 500 });
  }
}