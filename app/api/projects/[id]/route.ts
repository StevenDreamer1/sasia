import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Project from "@/models/Project";

// GET: Fetch project details for Tracker/Overview
export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    await dbConnect();
    const { id } = await params;
    const project = await Project.findById(id);
    if (!project) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json(project);
  } catch (error) {
    return NextResponse.json({ error: "Server Error" }, { status: 500 });
  }
}

// PATCH: Update Status or Delivery Link
export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    await dbConnect();
    const { id } = await params;
    const body = await req.json();

    const updatedProject = await Project.findByIdAndUpdate(
      id,
      { 
        status: body.status, 
        deliveryLink: body.deliveryLink || "" 
      },
      { new: true }
    );

    return NextResponse.json(updatedProject);
  } catch (error) {
    return NextResponse.json({ error: "Update Failed" }, { status: 500 });
  }
}