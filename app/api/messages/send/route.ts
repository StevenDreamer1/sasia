import { NextResponse } from "next/server"
import connectDB from "@/lib/db"

import ServiceRequest from "@/models/ServiceRequest"

export async function POST(req: Request) {
  await connectDB()

  const { requestId, sender, text } = await req.json()

  if (!requestId || !sender || !text) {
    return NextResponse.json({ error: "Missing data" }, { status: 400 })
  }

  await ServiceRequest.findByIdAndUpdate(requestId, {
    $push: {
      messages: {
        sender,
        text,
      },
    },
  })

  return NextResponse.json({ success: true })
}
