import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import dbConnect from "@/lib/mongodb";
import ServiceRequest from "@/models/ServiceRequest";
import User from "@/models/User"; // ✅ CRITICAL IMPORT
import { authOptions } from "@/lib/authOptions";
import nodemailer from "nodemailer";

// GET: Fetch Projects
export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    await dbConnect();
    
    let query = {};
    if (session.user?.email !== process.env.ADMIN_EMAIL) {
       query = { user: session.user?.email };
    }

    const projects = await ServiceRequest.find(query).sort({ createdAt: -1 });
    return NextResponse.json(projects);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch projects" }, { status: 500 });
  }
}

// POST: Create Project & Send Email
export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    // 1. Get Data from Frontend
    const { title, description, category } = await req.json(); 
    
    await dbConnect();

    // 2. Find the User to get their real MongoDB ID
    const user = await User.findOne({ email: session.user?.email });
    if (!user) {
        return NextResponse.json({ error: "User profile not found. Please log out and back in." }, { status: 404 });
    }

    // 3. Create Request (Mapping 'category' to 'serviceType')
    const newRequest = await ServiceRequest.create({
      userId: user._id,           // ✅ Real MongoDB ID
      user: session.user?.email,  // Email for reference
      title,
      description,
      serviceType: category,      // ✅ FIXED: Maps 'category' input to 'serviceType' schema
      category: category,         // Save both just in case
      status: "pending",          // ✅ Lowercase 'pending'
      createdAt: new Date(),
    });

    // 4. Send Email Alert
    console.log("📧 Sending Email Alert...");
    
    if (process.env.EMAIL_SERVER_USER && process.env.EMAIL_SERVER_PASSWORD) {
        const transporter = nodemailer.createTransport({
          host: "smtp.gmail.com",
          port: 465,
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
                <h2>New Service Request</h2>
                <p><strong>Client:</strong> ${session.user?.email}</p>
                <p><strong>Service Type:</strong> ${category}</p>
                <hr/>
                <p>${description}</p>
              `
          });
          console.log("✅ Email Sent!");
        } catch (mailError) {
          console.error("❌ Email Failed (but project saved):", mailError);
        }
    }

    return NextResponse.json(newRequest, { status: 201 });

  } catch (error: any) {
    console.error("❌ Project Creation Error:", error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}