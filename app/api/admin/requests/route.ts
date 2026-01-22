import { NextResponse } from "next/server"
import connectDB from "@/lib/db"
import ServiceRequest from "@/models/ServiceRequest"

export async function GET() {
  await connectDB()

  const requests = await ServiceRequest.find()
    .sort({ createdAt: -1 })
    .select("serviceType status messages createdAt")
    .lean()

  return NextResponse.json(requests)
}
