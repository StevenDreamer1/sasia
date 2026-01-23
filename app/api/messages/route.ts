import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Message from "@/models/Message";

export async function GET(req: Request) {
  await dbConnect();
  const { searchParams } = new URL(req.url);
  const projectId = searchParams.get("projectId");

  const messages = await Message.find({ projectId }).sort({ createdAt: 1 });
  return NextResponse.json(messages);
}