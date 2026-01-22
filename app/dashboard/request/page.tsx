"use client"

import { useState } from "react"
import DashboardSidebar from "@/components/DashboardSidebar"
import DashboardHeader from "@/components/DashboardHeader"

export default function RequestServicePage() {
  const [serviceType, setServiceType] = useState("Video Editing")
  const [instructions, setInstructions] = useState("")
  const [files, setFiles] = useState<File[]>([])
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      // 1️⃣ Upload files first
      const formData = new FormData()
      files.forEach((file) => formData.append("files", file))

      const uploadRes = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      })

      const uploadData = await uploadRes.json()

      // 2️⃣ Create request
      const res = await fetch("/api/request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          serviceType,
          instructions,
          files: uploadData.files,
        }),
      })

      if (!res.ok) throw new Error()

      alert("Request submitted 🚀")
      setInstructions("")
      setFiles([])
    } catch {
      alert("Something went wrong ❌")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-black text-white flex">
      <DashboardSidebar />

      <main className="flex-1 p-10">
        <DashboardHeader />

        <form onSubmit={handleSubmit} className="max-w-3xl space-y-6">
          <select
            value={serviceType}
            onChange={(e) => setServiceType(e.target.value)}
            className="w-full bg-black border border-white/10 p-3 rounded"
          >
            <option>Video Editing</option>
            <option>GFX / Motion Graphics</option>
            <option>Photography</option>
          </select>

          <input
            type="file"
            multiple
            onChange={(e) =>
              setFiles(Array.from(e.target.files || []))
            }
            className="block"
          />

          <textarea
            required
            value={instructions}
            onChange={(e) => setInstructions(e.target.value)}
            className="w-full bg-black border border-white/10 p-3 rounded"
            placeholder="Instructions"
          />

          <button
            disabled={loading}
            className="bg-accent px-6 py-3 rounded-full"
          >
            {loading ? "Submitting..." : "Submit Request"}
          </button>
        </form>
      </main>
    </div>
  )
}
