import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb"; // or "@/lib/db" depending on your setup
import ServiceRequest from "@/models/ServiceRequest";
// ❌ REMOVED: import { getIO } ...

export async function POST(req: Request) {
  try {
    await dbConnect();
    const { requestId, text, sender } = await req.json();

    const serviceRequest = await ServiceRequest.findById(requestId);
    if (!serviceRequest) {
      return NextResponse.json({ error: "Request not found" }, { status: 404 });
    }

    const newComment = {
      sender, // "Admin" or User Name
      text,
      createdAt: new Date(),
    };

    serviceRequest.comments.push(newComment);
    await serviceRequest.save();

    // ❌ REMOVED: getIO().to(...).emit(...) 
    // The frontend will handle the socket emission now.

    return NextResponse.json(serviceRequest, { status: 201 });
  } catch (error) {
    console.error("Comment Error:", error);
    return NextResponse.json({ error: "Failed to add comment" }, { status: 500 });
  }
}