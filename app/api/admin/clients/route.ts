import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Project from "@/models/Project";

export async function GET() {
  try {
    await dbConnect();
    
    // Aggregate projects by User ID
    const clients = await Project.aggregate([
      {
        $group: {
          _id: "$userId",
          projectCount: { $sum: 1 },
          lastActive: { $max: "$createdAt" },
          // Mocking "Spent" based on project count (e.g., $500 per project)
          totalSpent: { $sum: 500 }, 
          status: { $first: "Active" } // Default status
        }
      },
      { $sort: { lastActive: -1 } }
    ]);

    return NextResponse.json(clients);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch clients" }, { status: 500 });
  }
}