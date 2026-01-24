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

    // 1. Save Request
    const newRequest = await ServiceRequest.create({
      user: session.user?.email,
      title,
      description,
      category,
      status: "Pending",
      createdAt: new Date(),
    });

    // 2. ✅ FIXED EMAIL LOGIC
    console.log("Attempting to send email..."); // Debug Log
    
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465, // Secure SSL Port
      secure: true, // Must be true for port 465
      auth: {
        user: process.env.EMAIL_SERVER_USER,
        pass: process.env.EMAIL_SERVER_PASSWORD,
      },
    });

    // Verify connection configuration
    await new Promise((resolve, reject) => {
        transporter.verify(function (error, success) {
            if (error) {
                console.error("Transporter Error:", error);
                reject(error);
            } else {
                console.log("Server is ready to take our messages");
                resolve(success);
            }
        });
    });

    const info = await transporter.sendMail({
      from: `"SaSia Bot" <${process.env.EMAIL_SERVER_USER}>`,
      to: process.env.ADMIN_EMAIL, 
      subject: `🚀 New Project: ${title}`,
      text: `Client: ${session.user?.email}\nProject: ${title}\n\n${description}`, // Fallback text
      html: `
        <div style="font-family: sans-serif; padding: 20px; color: #333;">
          <h2 style="color: #4F46E5;">New Service Request</h2>
          <p><strong>Client:</strong> ${session.user?.email}</p>
          <p><strong>Project:</strong> ${title}</p>
          <hr />
          <p>${description}</p>
        </div>
      `,
    });
    
    console.log("Email sent: ", info.messageId);

    return NextResponse.json(newRequest, { status: 201 });
  } catch (error: any) {
    console.error("Detailed Error:", error);
    // Return the error so you can see it in the network tab if testing
    return NextResponse.json({ error: error.message || "Failed" }, { status: 500 });
  }
}