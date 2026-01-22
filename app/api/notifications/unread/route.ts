import { NextResponse } from "next/server"
import connectDB from "@/lib/db"
import ServiceRequest from "@/models/ServiceRequest"
import { cookies } from "next/headers"

export async function GET() {
  await connectDB()

 const cookieStore = await cookies()
  const userId = cookieStore.get("userId")?.value
  if (!userId) {
    return NextResponse.json({ count: 0 })
  }

  const requests = await ServiceRequest.find({
    userId,
    "messages.sender": "admin",
    "messages.seen": false,
  }).lean()

  let count = 0

  requests.forEach((req) => {
    req.messages?.forEach((m: any) => {
      if (m.sender === "admin" && m.seen === false) {
        count++
      }
    })
  })

  return NextResponse.json({ count })
}
