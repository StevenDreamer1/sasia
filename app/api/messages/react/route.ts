import { NextResponse } from "next/server"
import connectDB from "@/lib/db"
import ServiceRequest from "@/models/ServiceRequest"
import { getIO } from "@/lib/socket"

export async function POST(req: Request) {
  try {
    const { requestId, messageIndex, emoji, by } = await req.json()

    await connectDB()

    const request = await ServiceRequest.findById(requestId)
    if (!request) {
      return NextResponse.json({ error: "Not found" }, { status: 404 })
    }

    const msg = request.messages[messageIndex]
    if (!msg) {
      return NextResponse.json({ error: "Message not found" }, { status: 404 })
    }

    msg.reactions = msg.reactions || []
    msg.reactions.push({ emoji, by })

    await request.save()

    // 🔔 realtime update
    const io = getIO()
    io?.emit("new-message", { requestId })

    return NextResponse.json({ ok: true })
  } catch (e) {
    return NextResponse.json({ error: "Failed" }, { status: 500 })
  }
}
