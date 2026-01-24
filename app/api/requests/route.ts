import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import dbConnect from "@/lib/mongodb";
import ServiceRequest from "@/models/ServiceRequest";
import { authOptions } from "@/lib/authOptions";
import nodemailer from "nodemailer"; // ✅ Import Nodemailer

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { title, description, category } = await req.json();
    await dbConnect();

    // 1. Create the Request
    const newRequest = await ServiceRequest.create({
      user: session.user?.email,
      title,
      description,
      category,
      status: "Pending",
      createdAt: new Date(),
    });

    // 2. ✅ SEND EMAIL ALERT TO ADMIN
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_SERVER_USER,
        pass: process.env.EMAIL_SERVER_PASSWORD,
      },
    });

    try {
      await transporter.sendMail({
        from: `"SaSia Bot" <${process.env.EMAIL_SERVER_USER}>`,
        to: process.env.ADMIN_EMAIL, // The admin email you added to .env
        subject: `🚀 New Project Request: ${title}`,
        html: `
          <div style="font-family: Arial, sans-serif; padding: 20px; color: #333;">
            <h2 style="color: #4F46E5;">New Service Request</h2>
            <p><strong>Client:</strong> ${session.user?.email}</p>
            <p><strong>Project:</strong> ${title}</p>
            <p><strong>Category:</strong> ${category}</p>
            <hr style="border: 1px solid #eee; margin: 20px 0;" />
            <p style="white-space: pre-wrap;">${description}</p>
            <br />
            <a href="${process.env.NEXTAUTH_URL}/admin/requests" style="background: #4F46E5; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">View in Dashboard</a>
          </div>
        `,
      });
      console.log("✅ Admin alert sent");
    } catch (emailError) {
      console.error("❌ Failed to send admin alert:", emailError);
      // Don't crash the request if email fails, just log it
    }

    return NextResponse.json(newRequest, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Failed to create request" }, { status: 500 });
  }
}