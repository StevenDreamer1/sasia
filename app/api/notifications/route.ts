import { cookies } from "next/headers"
import connectDB from "@/lib/db"
import User from "@/models/User"

export async function GET() {
  await connectDB()

  // ✅ await cookies()
  const cookieStore = await cookies()
  const userId = cookieStore.get("userId")?.value

  if (!userId) return Response.json([])

  const user = await User.findById(userId)
    .select("notifications")
    .lean()

  return Response.json(user?.notifications || [])
}
