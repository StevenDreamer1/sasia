"use client"

import { useEffect, useState } from "react"

type Request = {
  _id: string
  userId: string
  serviceType: string
  instructions: string
  status: "pending" | "in_progress" | "completed"
}

export default function AdminRequestsPage() {
  const [requests, setRequests] = useState<Request[]>([])
  const [loading, setLoading] = useState(true)

  const fetchRequests = async () => {
    const res = await fetch("/api/admin/requests")
    const data = await res.json()
    setRequests(data)
    setLoading(false)
  }

  useEffect(() => {
    fetchRequests()
  }, [])

  const updateStatus = async (id: string, status: string) => {
    await fetch("/api/admin/requests/update", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, status }),
    })

    fetchRequests()
  }

  if (loading) return <p className="text-gray-400">Loading...</p>

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Admin – Service Requests</h1>

      <div className="space-y-4">
        {requests.map((req) => (
          <div
            key={req._id}
            className="rounded-xl border border-white/10 bg-white/5 p-5"
          >
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-lg font-medium">{req.serviceType}</h2>
                <p className="text-sm text-gray-400">
                  User: {req.userId}
                </p>
              </div>

              <select
                value={req.status}
                onChange={(e) => updateStatus(req._id, e.target.value)}
                className="bg-black border border-white/10 rounded-lg px-3 py-2"
              >
                <option value="pending">Pending</option>
                <option value="in_progress">In Progress</option>
                <option value="completed">Completed</option>
              </select>
            </div>

            <p className="mt-3 text-sm text-gray-300">
              {req.instructions}
            </p>
          </div>
        ))}
      </div>
    </div>
  )
}
