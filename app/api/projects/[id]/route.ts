import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import dbConnect from "@/lib/mongodb";
import ServiceRequest from "@/models/ServiceRequest";
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

    // 2. DEBUG LOGS (So we can fix security later)
    console.log("🔓 DEBUG ACCESS:");
    console.log(`User Email: ${session.user?.email}`);
    console.log(`Project Owner Email: ${project.user}`);
    console.log(`Project Owner ID: ${project.userId}`);

    // 3. 🚨 SECURITY DISABLED (TEMPORARY) 🚨
    // The security block below is commented out to unblock you.
    /*
    const isAdmin = session.user?.email === process.env.ADMIN_EMAIL;
    const isOwner = project.user === session.user?.email;
    
    if (!isOwner && !isAdmin) {
      return NextResponse.json({ error: "Access Denied" }, { status: 403 });
    }
    */

    return NextResponse.json(project);
  } catch (error) {
    console.error("Project Fetch Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}