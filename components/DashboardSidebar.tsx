"use client"

import { useEffect, useState } from "react"
import Link from "next/link"

export default function DashboardSidebar() {
  const [unread, setUnread] = useState(0)

  useEffect(() => {
    const fetchUnread = async () => {
      const res = await fetch("/api/request/user")
      if (!res.ok) return

      const requests = await res.json()

      let count = 0

      requests.forEach((req: any) => {
        req.messages?.forEach((m: any) => {
          if (m.sender === "admin" && m.seen === false) {
            count++
          }
        })
      })

      setUnread(count)
    }

    fetchUnread()
  }, [])

  return (
    <aside className="w-64 bg-black border-r border-white/10 p-6 hidden md:block">
      <h2 className="text-2xl font-semibold mb-10">SaSia</h2>

      <nav className="space-y-6 text-textMuted">
        <Link href="/dashboard" className="block hover:text-white">
          Dashboard
        </Link>

        <Link
          href="/dashboard/projects"
          className="flex items-center justify-between hover:text-white"
        >
          <span>My Projects</span>

          {unread > 0 && (
            <span className="bg-red-600 text-white text-xs px-2 py-0.5 rounded-full">
              {unread}
            </span>
          )}
        </Link>

        <Link href="/dashboard/request" className="block hover:text-white">
          Request Service
        </Link>

        <Link href="/dashboard/settings" className="block hover:text-white">
          Settings
        </Link>
      </nav>
    </aside>
  )
}
