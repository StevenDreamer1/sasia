import { NextResponse } from "next/server"
import { getIO } from "@/lib/socket"

export async function GET(req: any) {
  // @ts-ignore
  const server = req.socket?.server

  if (!server) {
    return NextResponse.json({ ok: false })
  }

  getIO(server)

  return NextResponse.json({ ok: true })
}
