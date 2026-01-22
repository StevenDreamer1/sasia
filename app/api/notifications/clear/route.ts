import { NextResponse } from "next/server"
import { cookies } from "next/headers"
import User from "@/models/User"
import connectDB from "@/lib/db"


export async function POST() {
  await connectDB()

  const userId = (await cookies()).get("userId")?.value
  if (!userId) return NextResponse.json({})

  await User.findByIdAndUpdate(userId, {
    $set: { "notifications.$[].read": true },
  })

  return NextResponse.json({ cleared: true })
}
