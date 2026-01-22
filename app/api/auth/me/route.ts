import { NextResponse } from "next/server"
import connectDB from "@/lib/db"

import User from "@/models/User"

export async function GET(req: Request) {
  await connectDB()

  const userId = req.headers
    .get("cookie")
    ?.split("userId=")[1]

  if (!userId) {
    return NextResponse.json(null)
  }

  const user = await User.findById(userId)

  return NextResponse.json(user)
}
