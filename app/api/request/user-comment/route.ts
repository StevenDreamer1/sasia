import { NextResponse } from "next/server"
import connectDB from "@/lib/db"
import ServiceRequest from "@/models/ServiceRequest"
import { getIO } from "@/lib/socket"

export async function POST(req: Request) {
  await connectDB()

  const { requestId, text } = await req.json()

  if (!requestId || !text) {
    return NextResponse.json({ error: "Invalid data" }, { status: 400 })
  }

  await ServiceRequest.updateOne(
    { _id: requestId },
    {
      $push: {
        messages: {
          sender: "user",
          text,
          seen: false,
          createdAt: new Date(),
        },
      },
    }
  )

  // ✅ Emit AFTER successful update
  const io = getIO()
  io?.emit("new-message", { requestId })

  return NextResponse.json({ ok: true })
}
