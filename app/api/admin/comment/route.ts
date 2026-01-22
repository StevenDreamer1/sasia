import { NextResponse } from "next/server"
import connectDB from "@/lib/db"
import ServiceRequest from "@/models/ServiceRequest"
import { getIO } from "@/lib/socket"

export async function POST(req: Request) {
  await connectDB()

  const { requestId, text } = await req.json()

  const request = await ServiceRequest.findById(requestId)
  if (!request) {
    return NextResponse.json({ error: "Not found" }, { status: 404 })
  }

  request.messages.push({
    sender: "admin",
    text,
    createdAt: new Date(),
    seen: false,
  })

  await request.save()

  // 🔴 EMIT SOCKET EVENT
  const io = getIO()
  io?.emit("new-message", { requestId })

  return NextResponse.json({ ok: true })
}
