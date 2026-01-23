import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
// ❌ REMOVED: import { getIO } ...
// Assuming you have a Message model, import it here if needed

export async function POST(req: Request) {
  try {
    await dbConnect();
    const { messageId, reaction } = await req.json();

    // ... Your logic to update the message reaction in MongoDB ...
    // Example:
    // const msg = await Message.findByIdAndUpdate(messageId, { reaction });

    // ❌ REMOVED: getIO().emit(...)

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Error reacting" }, { status: 500 });
  }
}