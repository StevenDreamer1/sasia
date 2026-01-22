"use client"

import { useState } from "react"
import ChatUpload from "./ChatUpload"

type Props = {
  onSend: (text: string) => void
  onUpload: (file: File) => void
}

export default function ChatInput({ onSend, onUpload }: Props) {
  const [text, setText] = useState("")

  const send = () => {
    if (!text.trim()) return
    onSend(text)
    setText("")
  }

  return (
    <div className="flex items-center gap-3 bg-black/40 border border-white/10 px-4 py-2 rounded-xl">
      <ChatUpload onUpload={onUpload} />

      <input
        value={text}
        onChange={(e) => setText(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault()
            send()
          }
        }}
        placeholder="Type a message…"
        className="flex-1 bg-transparent outline-none text-sm"
      />

      <button
        onClick={send}
        className="bg-blue-600 hover:bg-blue-500 px-4 py-1.5 rounded-lg text-white text-sm"
      >
        Send
      </button>
    </div>
  )
}
