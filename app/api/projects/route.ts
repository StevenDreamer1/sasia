import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import dbConnect from "@/lib/mongodb";
import Project from "@/models/Project";

// GET ALL PROJECTS
export async function GET() {
  try {
    await dbConnect();
    // We fetch all for the admin, but you can filter by user if needed
    const projects = await Project.find({}).sort({ createdAt: -1 });
    return NextResponse.json(projects);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch projects" }, { status: 500 });
  }
}

// CREATE NEW PROJECT
export async function POST(req: Request) {
  try {
    await dbConnect();
    const data = await req.json();
    const cookieStore = await cookies();
    
    // Fallback email to prevent the 500 error seen in logs
    const userEmail = cookieStore.get("user_email")?.value || "guest@sasia.com"; 

    const newProject = await Project.create({
      ...data,
      userId: userEmail,
      status: "New Request"
    });

    return NextResponse.json(newProject, { status: 201 });
  } catch (error) {
    console.error("Project Creation Error:", error);
    return NextResponse.json({ error: "Check if all required fields are sent" }, { status: 500 });
  }
}