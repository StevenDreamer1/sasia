import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import connectDB from "@/lib/db"
import User from "@/models/User"
import ServiceRequest from "@/models/ServiceRequest"
import AdminRequestsClient from "./AdminRequestsClient"

export default async function AdminRequestsPage() {
  // ✅ FIXED (await cookies)
  const cookieStore = await cookies()
  const userId = cookieStore.get("userId")?.value

  if (!userId) redirect("/auth/login")

  await connectDB()

  const user = await User.findById(userId).lean()
  if (!user || user.role !== "admin") redirect("/dashboard")

  const requests = await ServiceRequest.find()
    .sort({ createdAt: -1 })
    .lean()

  // ✅ REQUIRED for Client Component
  const safeRequests = JSON.parse(JSON.stringify(requests))

  return <AdminRequestsClient requests={safeRequests} />
}
