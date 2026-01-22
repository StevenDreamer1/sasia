"use client"

import {
  createContext,
  useContext,
  useState,
  ReactNode,
} from "react"

type Toast = {
  id: number
  message: string
}

type ToastContextType = {
  showToast: (message: string) => void
}

const ToastContext = createContext<ToastContextType | null>(null)

export function ToastProvider({
  children,
}: {
  children: ReactNode
}) {
  const [toasts, setToasts] = useState<Toast[]>([])

  const showToast = (message: string) => {
    const id = Date.now()
    setToasts((prev) => [...prev, { id, message }])

    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id))
    }, 3000)
  }

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}

      {/* Toast UI */}
      <div className="fixed bottom-6 right-6 space-y-3 z-50">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className="bg-black border border-white/10 text-white px-6 py-3 rounded-xl shadow-lg"
          >
            {toast.message}
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  )
}

export function useToast() {
  const ctx = useContext(ToastContext)
  if (!ctx) {
    throw new Error(
      "useToast must be used inside ToastProvider"
    )
  }
  return ctx
}
