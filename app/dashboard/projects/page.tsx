import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import connectDB from "@/lib/db"
import ServiceRequest from "@/models/ServiceRequest"
import UserRequestsClient from "./UserRequestsClient"

export default async function UserProjectsPage() {
  const cookieStore = await cookies()
  const userId = cookieStore.get("userId")?.value

  if (!userId) redirect("/auth/login")

  await connectDB()

  const requests = await ServiceRequest.find({ userId })
    .sort({ createdAt: -1 })
    .lean()

  // ✅ VERY IMPORTANT
  const safeRequests = JSON.parse(JSON.stringify(requests))

  return <UserRequestsClient requests={safeRequests} />
}
