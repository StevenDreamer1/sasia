import { NextResponse } from "next/server"
import connectDB from "@/lib/db"

import User from "@/models/User"

export async function POST(req: Request) {
  await connectDB()

  const { name, email } = await req.json()

  let user = await User.findOne({ email })

  if (!user) {
    user = await User.create({ name, email })
  }

  const response = NextResponse.json({
    id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
  })

  // simple session cookie
  response.cookies.set("userId", user._id.toString(), {
    httpOnly: true,
    path: "/",
  })

  return response
}
