import { NextResponse } from "next/server"
import connectDB from "@/lib/db"
import ServiceRequest from "@/models/ServiceRequest"

export async function PATCH(req: Request) {
  await connectDB()

  const { requestId, status } = await req.json()

  await ServiceRequest.updateOne(
    { _id: requestId },
    { $set: { status } }
  )

  return NextResponse.json({ success: true })
}
