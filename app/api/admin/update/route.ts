import { NextResponse } from "next/server"
import connectDB from "@/lib/db"

import ServiceRequest from "@/models/ServiceRequest"

export async function POST(req: Request) {
  await connectDB()

  const { id, status } = await req.json()

  await ServiceRequest.findByIdAndUpdate(id, { status })

  return NextResponse.json({ success: true })
}
