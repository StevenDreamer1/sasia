"use client"

import { useEffect, useState } from "react"

export function useUser() {
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchUser = async () => {
      const res = await fetch("/api/auth/me")
      const data = await res.json()
      setUser(data)
      setLoading(false)
    }

    fetchUser()
  }, [])

  return { user, loading }
}
