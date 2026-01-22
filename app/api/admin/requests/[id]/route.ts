import { NextResponse } from "next/server"
import connectDB from "@/lib/db"

import ServiceRequest from "@/models/ServiceRequest"

export async function PATCH(
  req: Request,
  { params }: { params: { id: string } }
) {
  const { status } = await req.json()

  await connectDB()

  await ServiceRequest.findByIdAndUpdate(params.id, {
    status,
  })

  return NextResponse.json({ success: true })
}
