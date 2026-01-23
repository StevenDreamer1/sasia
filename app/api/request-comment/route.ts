import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
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
      sender,
      text,
      createdAt: new Date(),
    };

    serviceRequest.comments.push(newComment);
    await serviceRequest.save();

    // ❌ REMOVED: getIO().emit(...)

    return NextResponse.json(serviceRequest, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}