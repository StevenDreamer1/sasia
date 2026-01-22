"use client"

import { useState } from "react"
import { Paperclip } from "lucide-react"

type Props = {
  onUpload: (file: File) => void
}

export default function ChatUpload({ onUpload }: Props) {
  const [progress, setProgress] = useState<number | null>(null)

  const handleFile = (file: File) => {
    setProgress(0)

    // simulate upload progress
    const interval = setInterval(() => {
      setProgress((p) => {
        if (p === null || p >= 100) {
          clearInterval(interval)
          onUpload(file)
          return null
        }
        return p + 10
      })
    }, 120)
  }

  return (
    <div className="relative">
      <label className="cursor-pointer">
        <Paperclip className="w-5 h-5 opacity-70 hover:opacity-100" />
        <input
          type="file"
          hidden
          onChange={(e) =>
            e.target.files && handleFile(e.target.files[0])
          }
        />
      </label>

      {progress !== null && (
        <div className="absolute -top-2 left-0 w-full h-1 bg-white/10 rounded">
          <div
            className="h-full bg-[hsl(var(--primary))] rounded transition-all"
            style={{ width: `${progress}%` }}
          />
        </div>
      )}
    </div>
  )
}
