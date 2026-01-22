"use client"

import React, { useEffect, useRef, useState } from "react"
import { io, Socket } from "socket.io-client"
import ReadReceipt from "@/components/ReadReceipt"

/* ---------------- TYPES ---------------- */

type Message = {
  sender: "user" | "admin"
  text: string
  createdAt: string
  seen?: boolean
}

type ServiceRequest = {
  _id: string
  serviceType: string
  status: string
  messages?: Message[]
}

type Props = {
  requests: ServiceRequest[]
}

/* ---------------- MAIN ---------------- */

export default function AdminRequestsClient({ requests }: Props) {
  const [items, setItems] = useState(requests)
  const [mounted, setMounted] = useState(false)
  const socketRef = useRef<Socket | null>(null)

  useEffect(() => setMounted(true), [])

  /* 🔥 SAFE SOCKET */
  useEffect(() => {
    if (typeof window === "undefined") return

    const socket = io({ path: "/api/socket" })
    socketRef.current = socket

    socket.on("new-message", async () => {
      const res = await fetch("/api/admin/requests")
      if (!res.ok) return
      const data = await res.json()
      setItems(data)
    })

    return () => socket.disconnect()
  }, [])

  const sendReply = async (id: string, text: string) => {
    if (!text.trim()) return

    await fetch("/api/request-comment", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ requestId: id, text }),
    })
  }

  return (
    <div className="space-y-8">
      {items.map((req) => (
        <ChatCard
          key={req._id}
          req={req}
          mounted={mounted}
          onSend={(text) => sendReply(req._id, text)}
        />
      ))}
    </div>
  )
}

/* ---------------- CHAT CARD ---------------- */

function ChatCard({
  req,
  mounted,
  onSend,
}: {
  req: ServiceRequest
  mounted: boolean
  onSend: (text: string) => void
}) {
  const bottomRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [req.messages?.length])

  return (
    <div className="rounded-xl border border-white/10 bg-[#0f172a]">
      <div className="px-5 py-3 border-b border-white/10">
        <h3 className="font-medium text-white">{req.serviceType}</h3>
        <p className="text-xs text-[#9aa5b1]">{req.status}</p>
      </div>

      <div className="p-5 space-y-2 max-h-[420px] overflow-y-auto">
        {(req.messages || []).map((m, i) => {
          const isAdmin = m.sender === "admin"

          return (
            <div key={i} className="flex">
              <div
                className={`inline-block px-4 py-2 text-sm
                  max-w-[70%]
                  ${isAdmin ? "bg-[#2b5278] ml-auto" : "bg-[#182533]"}
                  text-[#e6edf3] rounded-2xl`}
              >
                {m.text}
                <div className="flex justify-end gap-1 mt-1 text-[10px] text-[#9aa5b1]">
                  {mounted && formatTime(m.createdAt)}
                  {isAdmin && <ReadReceipt seen={m.seen} />}
                </div>
              </div>
            </div>
          )
        })}
        <div ref={bottomRef} />
      </div>

      <ChatInput onSend={onSend} />
    </div>
  )
}

/* ---------------- SHARED INPUT ---------------- */

function ChatInput({ onSend }: { onSend: (text: string) => void }) {
  const [text, setText] = useState("")

  return (
    <div className="flex gap-3 p-4 border-t border-white/10 bg-[#111827]">
      <input
        value={text}
        onChange={(e) => setText(e.target.value)}
        onKeyDown={(e) =>
          e.key === "Enter" && !e.shiftKey && (e.preventDefault(), onSend(text), setText(""))
        }
        placeholder="Type a message…"
        className="flex-1 bg-transparent text-white text-sm outline-none"
      />
      <button
        onClick={() => (onSend(text), setText(""))}
        className="px-4 py-1.5 rounded-lg bg-[#2b5278] text-white text-sm"
      >
        Send
      </button>
    </div>
  )
}

/* ---------------- UTILS ---------------- */

function formatTime(date: string) {
  return new Date(date).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  })
}
