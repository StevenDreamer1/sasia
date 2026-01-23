import { NextResponse } from "next/server";
import { getServerSession } from "next-auth"; // Get session
import dbConnect from "@/lib/mongodb";
import ServiceRequest from "@/models/ServiceRequest";
import { authOptions } from "@/lib/authOptions"; // Import your auth options

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    // 1. Security Check
    if (!session || !session.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();

    // 2. FILTER: Only find requests where 'user' matches logged-in email
    // Assuming your ServiceRequest model has a 'user' or 'email' field storing the owner
    const requests = await ServiceRequest.find({ 
      user: session.user.email 
    }).sort({ createdAt: -1 });

    return NextResponse.json(requests);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch projects" }, { status: 500 });
  }
}