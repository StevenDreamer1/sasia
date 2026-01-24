import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import dbConnect from "@/lib/mongodb";
import ServiceRequest from "@/models/ServiceRequest";
import User from "@/models/User"; // ✅ Added User import
import { authOptions } from "@/lib/authOptions";
import nodemailer from "nodemailer";

// Handle GET (Fetch all projects)
export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    await dbConnect();
    
    // Admin Check: If email matches ADMIN_EMAIL, fetch all requests.
    // Otherwise, fetch only requests belonging to the logged-in user.
    let query = {};
    if (session.user?.email !== process.env.ADMIN_EMAIL) {
       query = { user: session.user?.email }; 
    }

    const projects = await ServiceRequest.find(query).sort({ createdAt: -1 });
    return NextResponse.json(projects);
  } catch (error) {
    console.error("GET Projects Error:", error);
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

    // 1. Find the User's Real MongoDB ID (Prevents Cast to ObjectId error)
    const userProfile = await User.findOne({ email: session.user?.email });
    
    if (!userProfile) {
        return NextResponse.json({ error: "User profile not found in database" }, { status: 404 });
    }

    // 2. Save to Database
    // We map 'category' from the frontend to 'serviceType' for the schema
    const newRequest = await ServiceRequest.create({
      userId: userProfile._id,   // ✅ Use actual ObjectId
      user: session.user?.email, 
      title,
      description,
      serviceType: category,     // ✅ Required by most ServiceRequest schemas
      category: category,        
      status: "pending",         // ✅ Lowercase to match typical Enum values
      createdAt: new Date(),
    });

    // 3. SEND EMAIL NOTIFICATION
    console.log("📧 Starting Email Alert Process...");

    if (!process.env.EMAIL_SERVER_USER || !process.env.EMAIL_SERVER_PASSWORD) {
      console.error("❌ CRITICAL: Email credentials missing in Environment Variables!");
    } else {
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
              <div style="font-family: sans-serif; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
                <h2 style="color: #4F46E5;">New Project Request</h2>
                <p><strong>Client Email:</strong> ${session.user?.email}</p>
                <p><strong>Service Category:</strong> ${category}</p>
                <p><strong>Title:</strong> ${title}</p>
                <hr style="border: 0; border-top: 1px solid #eee;" />
                <p><strong>Description:</strong></p>
                <p style="background: #f9f9f9; padding: 15px; border-radius: 5px;">${description}</p>
                <p style="font-size: 12px; color: #666; margin-top: 20px;">
                  This is an automated notification from your Dashboard.
                </p>
              </div>
            `,
          });
          console.log("✅ Email Sent Successfully to Admin!");
        } catch (mailError: any) {
          console.error("❌ Email Sending Failed:", mailError.message);
          // We don't return 500 here because the DB record was already created successfully.
        }
    }

    return NextResponse.json(newRequest, { status: 201 });
  } catch (error: any) {
    console.error("❌ Project Creation Error:", error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}