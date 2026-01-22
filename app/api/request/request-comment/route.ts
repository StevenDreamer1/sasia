import { NextResponse } from "next/server"
import connectDB from "@/lib/db"
import ServiceRequest from "@/models/ServiceRequest"

export async function POST(req: Request) {
  await connectDB()

  const { requestId, text } = await req.json()
  if (!requestId || !text) {
    return NextResponse.json({ error: "Invalid data" }, { status: 400 })
  }

  const request = await ServiceRequest.findById(requestId)
  if (!request) {
    return NextResponse.json({ error: "Request not found" }, { status: 404 })
  }

  request.messages.push({
    sender: "admin",
    text,
    createdAt: new Date(),
    seen: false,
  })

  await request.save()

  return NextResponse.json({ success: true })
}
