import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import ServiceRequest from "@/models/ServiceRequest";

// ✅ Fix: Type 'params' as a Promise
export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // ✅ Fix: Await the params before using them
    const { id } = await params;
    
    const { status } = await req.json();
    await dbConnect();

    const updatedRequest = await ServiceRequest.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );

    if (!updatedRequest) {
      return NextResponse.json({ error: "Request not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: updatedRequest });
  } catch (error) {
    console.error("Update Error:", error);
    return NextResponse.json({ error: "Failed to update status" }, { status: 500 });
  }
}