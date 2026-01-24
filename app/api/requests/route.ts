import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import dbConnect from "@/lib/mongodb";
import ServiceRequest from "@/models/ServiceRequest";
import { authOptions } from "@/lib/authOptions";
import nodemailer from "nodemailer";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { title, description, category } = await req.json();
    await dbConnect();

    // 1. Create the Request in Database
    const newRequest = await ServiceRequest.create({
      user: session.user?.email,
      title,
      description,
      category,
      status: "Pending",
      createdAt: new Date(),
    });

    // 2. EMAIL ALERT LOGIC
    console.log("📧 Starting Email Process...");

    // DEBUG: Check if variables exist (Don't log the actual password!)
    if (!process.env.EMAIL_SERVER_USER || !process.env.EMAIL_SERVER_PASSWORD) {
      console.error("❌ CRITICAL: Email Environment Variables are missing!");
      return NextResponse.json(newRequest, { status: 201 }); // Return success anyway so UI doesn't break
    }

    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587, // ✅ CHANGED TO 587 (TLS) - More reliable on Vercel
      secure: false, // Must be false for port 587
      auth: {
        user: process.env.EMAIL_SERVER_USER,
        pass: process.env.EMAIL_SERVER_PASSWORD, // No spaces!
      },
      tls: {
        rejectUnauthorized: false // Helps avoid some Vercel SSL errors
      }
    });

    try {
      // Verify connection before sending
      await transporter.verify();
      console.log("✅ SMTP Connection Established");

      const info = await transporter.sendMail({
        from: `"SaSia Bot" <${process.env.EMAIL_SERVER_USER}>`,
        to: process.env.ADMIN_EMAIL || process.env.EMAIL_SERVER_USER, // Fallback to sender if Admin email missing
        subject: `🚀 New Project: ${title}`,
        text: `New request from ${session.user?.email}: ${description}`,
        html: `
          <div style="font-family: Arial, sans-serif; padding: 20px; color: #333;">
            <h2 style="color: #4F46E5;">New Service Request</h2>
            <p><strong>Client:</strong> ${session.user?.email}</p>
            <p><strong>Project:</strong> ${title}</p>
            <p><strong>Category:</strong> ${category}</p>
            <hr style="border: 1px solid #eee; margin: 20px 0;" />
            <p>${description}</p>
            <br />
            <a href="https://sasia-nine.vercel.app/admin/requests" style="background: #4F46E5; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Open Dashboard</a>
          </div>
        `,
      });
      console.log("✅ Email Sent Successfully! Message ID:", info.messageId);

    } catch (emailError: any) {
      console.error("❌ Email Failed:", emailError.message);
      // We do NOT return an error to the client, because the Project was created successfully.
      // We just log the email failure.
    }

    return NextResponse.json(newRequest, { status: 201 });
  } catch (error) {
    console.error("❌ API Error:", error);
    return NextResponse.json({ error: "Failed to create request" }, { status: 500 });
  }
}