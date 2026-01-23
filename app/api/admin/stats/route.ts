import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import User from "@/models/User";
import ServiceRequest from "@/models/ServiceRequest";

export async function GET() {
  try {
    await dbConnect();

    const totalClients = await User.countDocuments({ role: "user" });
    const activeProjects = await ServiceRequest.countDocuments({ status: "Pending" });
    const completedProjects = await ServiceRequest.countDocuments({ status: "Completed" });
    
    // Calculate Revenue (Example: Sum of a 'price' field, or just dummy calc based on projects)
    // For now, let's assume each project is $500 roughly
    const totalRevenue = (activeProjects + completedProjects) * 500;

    return NextResponse.json({
      totalClients,
      activeProjects,
      totalRevenue,
      completedProjects
    });
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch stats" }, { status: 500 });
  }
}