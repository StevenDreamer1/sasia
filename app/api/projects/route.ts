import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import dbConnect from "@/lib/mongodb";
import ServiceRequest from "@/models/ServiceRequest";
import User from "@/models/User"; // ✅ CRITICAL IMPORT
import { authOptions } from "@/lib/authOptions";
import nodemailer from "nodemailer";

/**
 * GET: Fetch Projects
 * Admins see everything; Users see only their own projects.
 */
export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    await dbConnect();
    
    let query = {};
    // If the user is not the admin, filter by their email
    if (session.user?.email !== process.env.ADMIN_EMAIL) {
       query = { user: session.user?.email };
    }

    const projects = await ServiceRequest.find(query).sort({ createdAt: -1 });
    return NextResponse.json(projects);
  } catch (error) {
    console.error("❌ Failed to fetch projects:", error);
    return NextResponse.json({ error: "Failed to fetch projects" }, { status: 500 });
  }
}

/**
 * POST: Create Project & Send Email
 * Maps frontend 'category' to backend 'serviceType' and handles email alerts.
 */
export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    // 1. Get Data from Frontend
    const body = await req.json();
    console.log("📝 Incoming Request Body:", body); // DEBUG LOG

    const { title, description, category, serviceType } = body;
    
    // ✅ FIX: Force field mapping to prevent "serviceType required" error
    // Uses body.serviceType first, then body.category, then a fallback string
    const finalServiceType = serviceType || category || "General Support";

    await dbConnect();

    // 2. Find the User to get their real MongoDB ObjectId (Prevents CastError)
    const user = await User.findOne({ email: session.user?.email });
    if (!user) {
        return NextResponse.json({ 
          error: "User profile not found. Please log out and back in." 
        }, { status: 404 });
    }

    // 3. Create Request in Database
    const newRequest = await ServiceRequest.create({
      userId: user._id,           // ✅ Valid MongoDB ObjectId
      user: session.user?.email,  // Email string for quick reference
      title,
      description,
      serviceType: finalServiceType, // ✅ REQUIRED FIELD
      category: finalServiceType,    // Duplicate for safety/schema flexibility
      status: "pending",             // ✅ Matches lowercase Enum standard
      createdAt: new Date(),
    });

    // 4. Send Email Alert (Nodemailer)
    if (process.env.EMAIL_SERVER_USER && process.env.EMAIL_SERVER_PASSWORD) {
        console.log("📧 Attempting to send Email Alert...");
        
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
                <div style="font-family: Arial, sans-serif; max-width: 600px; border: 1px solid #e0e0e0; border-radius: 8px; padding: 20px;">
                  <h2 style="color: #4f46e5;">New Service Request</h2>
                  <p><strong>Client:</strong> ${session.user?.email}</p>
                  <p><strong>Service Type:</strong> ${finalServiceType}</p>
                  <p><strong>Project Title:</strong> ${title}</p>
                  <hr style="border: 0; border-top: 1px solid #eeeeee;" />
                  <p style="color: #333333; line-height: 1.5;">${description}</p>
                  <br />
                  <p style="font-size: 12px; color: #999;">Received at: ${new Date().toLocaleString()}</p>
                </div>
              `
          });
          console.log("✅ Email Sent successfully!");
        } catch (mailError) {
          // We log the error but don't stop the process, as the DB entry is already created
          console.error("❌ Email Failed (Project still saved):", mailError);
        }
    } else {
        console.warn("⚠️ Email credentials missing. Skipping email notification.");
    }

    // Return the newly created project
    return NextResponse.json(newRequest, { status: 201 });

  } catch (error: any) {
    console.error("❌ Project Creation Error:", error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}