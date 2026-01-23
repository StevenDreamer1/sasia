import { NextResponse } from "next/server";
import nodemailer from "nodemailer";
import dbConnect from "@/lib/mongodb";
import { Otp } from "@/models/Otp";

export async function POST(req: Request) {
  const { email } = await req.json();
  await dbConnect();

  // 1. Generate 6-digit Code
  const code = Math.floor(100000 + Math.random() * 900000).toString();

  // 2. Save to DB
  await Otp.create({ email, code });

  // 3. Send Email
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_SERVER_USER,
      pass: process.env.EMAIL_SERVER_PASSWORD,
    },
  });

  await transporter.sendMail({
    from: process.env.EMAIL_FROM,
    to: email,
    subject: "Your SaSia Login Code",
    text: `Your verification code is: ${code}`,
    html: `<b>Your verification code is: ${code}</b>`,
  });

  return NextResponse.json({ success: true });
}