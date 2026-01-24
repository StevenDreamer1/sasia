import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import dbConnect from "@/lib/mongodb";
import ServiceRequest from "@/models/ServiceRequest";
import { authOptions } from "@/lib/authOptions";
import nodemailer from "nodemailer";

// Handle GET (Fetch all projects)
export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    await dbConnect();
    
    // If admin, fetch all. If user, fetch only theirs.
    // Adjust this logic if you have specific Admin roles setup
    let query = {};
    if (session.user?.email !== process.env.ADMIN_EMAIL) {
       query = { user: session.user?.email }; // Filter for normal users
    }

    const projects = await ServiceRequest.find(query).sort({ createdAt: -1 });
    return NextResponse.json(projects);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch projects" }, { status: 500 });
  }
}

// Handle POST (Create new project & Send Email)
export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { title, description, category } = await req.json();
    await dbConnect();

    // 1. Save to Database
    const newRequest = await ServiceRequest.create({
      user: session.user?.email, // ensure your schema uses 'user' or 'userId' consistently
      userId: session.user?.email, // Saving both for safety based on your previous schemas
      title,
      description,
      category,
      status: "Pending",
      createdAt: new Date(),
    });

    // 2. SEND EMAIL (The Missing Part)
    console.log("📧 (Projects Route) Starting Email Process...");

    if (!process.env.EMAIL_SERVER_USER || !process.env.EMAIL_SERVER_PASSWORD) {
      console.error("❌ CRITICAL: Email Env Vars missing in Vercel!");
    } else {
        const transporter = nodemailer.createTransport({
          host: "smtp.gmail.com",
          port: 465, // Try 465 (SSL) first, if fails we try 587
          secure: true, 
          auth: {
            user: process.env.EMAIL_SERVER_USER,
            pass: process.env.EMAIL_SERVER_PASSWORD,
          },
        });

        try {
          await transporter.sendMail({
            from: `"SaSia Bot" <${process.env.EMAIL_SERVER_USER}>`,
            to: process.env.ADMIN_EMAIL, 
            subject: `🚀 New Project: ${title}`,
            html: `
              <h2>New Project Request</h2>
              <p><strong>Client:</strong> ${session.user?.email}</p>
              <p><strong>Title:</strong> ${title}</p>
              <p><strong>Description:</strong> ${description}</p>
            `,
          });
          console.log("✅ Email Sent Successfully to Admin!");
        } catch (mailError: any) {
          console.error("❌ Email Sending Failed:", mailError.message);
        }
    }

    return NextResponse.json(newRequest, { status: 201 });
  } catch (error) {
    console.error("Server Error:", error);
    return NextResponse.json({ error: "Failed to create project" }, { status: 500 });
  }
}