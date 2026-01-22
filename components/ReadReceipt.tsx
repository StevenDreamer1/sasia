"use client"

import { motion } from "framer-motion"

export default function ReadReceipt({ seen }: { seen?: boolean }) {
  return (
    <motion.span
      key={seen ? "seen" : "delivered"}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.2 }}
      className="ml-1"
    >
      {seen ? "✔✔" : "✔"}
    </motion.span>
  )
}
