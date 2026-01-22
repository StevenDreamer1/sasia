import { NextResponse } from "next/server"
import connectDB from "@/lib/db"
import ServiceRequest from "@/models/ServiceRequest"

export async function POST(req: Request) {
  const { requestId, viewer } = await req.json()

  if (!requestId || !viewer) {
    return NextResponse.json({ error: "Invalid data" }, { status: 400 })
  }

  await connectDB()

  await ServiceRequest.updateOne(
    { _id: requestId },
    {
      $set: {
        "messages.$[msg].seen": true,
      },
    },
    {
      arrayFilters: [{ "msg.sender": { $ne: viewer } }],
    }
  )

  return NextResponse.json({ ok: true })
}
