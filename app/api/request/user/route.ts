import { NextResponse } from "next/server"
import connectDB from "@/lib/db"
import ServiceRequest from "@/models/ServiceRequest"
import { cookies } from "next/headers"

export async function POST() {
  await connectDB()

   const cookieStore = await cookies()
  const userId = cookieStore.get("userId")?.value
  if (!userId) return NextResponse.json([])

  const requests = await ServiceRequest.find({ userId })
    .sort({ createdAt: -1 })
    .select("serviceType status messages createdAt")
    .lean()

  return NextResponse.json(requests)
}
