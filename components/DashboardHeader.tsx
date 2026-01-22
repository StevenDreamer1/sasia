"use client"

import { useEffect, useState } from "react"
import Link from "next/link"

export default function DashboardHeader() {
  const [unread, setUnread] = useState(0)

  // 🔄 Load unread notification count
  useEffect(() => {
    const loadUnread = async () => {
      try {
        const res = await fetch("/api/notifications/unread")
        const data = await res.json()
        setUnread(data.count || 0)
      } catch (err) {
        console.error("Failed to load notifications", err)
      }
    }

    loadUnread()
  }, [])

  return (
    <header className="flex justify-between items-center mb-8">
      <h1 className="text-xl font-semibold">Dashboard</h1>

      {/* 🔔 Notifications */}
      <Link
        href="/dashboard/projects"
        onClick={async () => {
          try {
            await fetch("/api/notifications/clear", {
              method: "POST",
            })
            setUnread(0)
          } catch (err) {
            console.error("Failed to clear notifications", err)
          }
        }}
        className="relative text-xl"
      >
        <span>🔔</span>

        {unread > 0 && (
          <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs px-2 rounded-full">
            {unread}
          </span>
        )}
      </Link>
    </header>
  )
}
