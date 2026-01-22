import { NextResponse } from "next/server"
import connectDB from "@/lib/db"

import ServiceRequest from "@/models/ServiceRequest"

export async function POST(req: Request) {
  const { userId } = await req.json()

  await connectDB()

  const requests = await ServiceRequest.find({ userId })
    .sort({ createdAt: -1 })
    .lean()

  return NextResponse.json(requests)
}
