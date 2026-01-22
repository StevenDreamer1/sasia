import { NextResponse } from "next/server"
import connectDB from "@/lib/db"

import User from "@/models/User"

export async function POST(req: Request) {
  const { userId, message } = await req.json()

  await connectDB()

  await User.findByIdAndUpdate(userId, {
    $push: {
      notifications: { message },
    },
  })

  return NextResponse.json({ success: true })
}
