"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"

export default function LoginPage() {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const router = useRouter()

  const handleLogin = async (e: any) => {
    e.preventDefault()

    await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email }),
    })

    router.push("/dashboard")
  }

  return (
    <div className="min-h-screen flex items-center justify-center">
      <form
        onSubmit={handleLogin}
        className="space-y-4 bg-white/5 p-8 rounded-xl w-96"
      >
        <h1 className="text-xl font-semibold">Login to SaSia</h1>

        <input
          placeholder="Name"
          className="w-full px-4 py-2 bg-black border border-white/10 rounded"
          onChange={(e) => setName(e.target.value)}
        />

        <input
          placeholder="Email"
          type="email"
          className="w-full px-4 py-2 bg-black border border-white/10 rounded"
          onChange={(e) => setEmail(e.target.value)}
        />

        <button className="w-full bg-white text-black py-2 rounded">
          Continue
        </button>
      </form>
    </div>
  )
}
