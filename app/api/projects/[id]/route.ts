import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import dbConnect from "@/lib/mongodb";
import ServiceRequest from "@/models/ServiceRequest";
import { authOptions } from "@/lib/authOptions";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> } // ✅ Fix for Next.js 15
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    // 1. Await params before using them (Critical Fix)
    const { id } = await params;
    
    await dbConnect();

    // 2. Find the Project
    const project = await ServiceRequest.findById(id);

    if (!project) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    // 3. Security Check: Allow if User is Owner OR User is Admin
    const isAdmin = session.user?.email === process.env.ADMIN_EMAIL;
    const isOwner = project.user === session.user?.email; // Checks the saved email

    if (!isOwner && !isAdmin) {
      return NextResponse.json({ error: "Access Denied" }, { status: 403 });
    }

    return NextResponse.json(project);
  } catch (error) {
    console.error("Project Fetch Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}