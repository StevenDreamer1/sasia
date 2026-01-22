import { NextResponse } from "next/server"
import connectDB from "@/lib/db"
import ServiceRequest from "@/models/ServiceRequest"
import User from "@/models/User"

export async function POST(req: Request) {
  await connectDB()

  const { requestId, message } = await req.json()

  if (!requestId || !message) {
    return NextResponse.json({ error: "Invalid data" }, { status: 400 })
  }

  const serviceRequest = await ServiceRequest.findByIdAndUpdate(
    requestId,
    {
      $push: {
        messages: {
          sender: "admin",
          text: message,
          seen: false,
        },
      },
    },
    { new: true }
  )

  if (serviceRequest) {
    await User.findByIdAndUpdate(serviceRequest.userId, {
      $push: {
        notifications: {
          message: "Admin replied to your service request",
        },
      },
    })
  }

  return NextResponse.json({ success: true })
}
