import { NextResponse } from "next/server"
import { cookies } from "next/headers"
import mongoose from "mongoose"
import connectDB from "@/lib/db"

import ServiceRequest from "@/models/ServiceRequest"

export async function POST(req: Request) {
  try {
    const { serviceType, instructions, files } = await req.json()

    const cookieStore = await cookies()
    const userId = cookieStore.get("userId")?.value

    if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    await connectDB()

    await ServiceRequest.create({
      userId,
      serviceType,
      instructions,
      files,
    })

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error(err)
    return NextResponse.json(
      { error: "Failed to submit request" },
      { status: 500 }
    )
  }
}
