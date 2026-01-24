import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import dbConnect from "@/lib/mongodb";
import ServiceRequest from "@/models/ServiceRequest";
import User from "@/models/User"; 
import { authOptions } from "@/lib/authOptions";
import nodemailer from "nodemailer";

// ✅ FIXED GET: Finds user ID first, then finds their projects
export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    await dbConnect();

    // 1. Check if the logged-in user is the Admin
    // (Ensure ADMIN_EMAIL is set correctly in Vercel)
    const isAdmin = session.user?.email === process.env.ADMIN_EMAIL;

    let query = {};

    if (!isAdmin) {
        // 2. If not Admin, find the user's ObjectId
        const user = await User.findOne({ email: session.user?.email });
        if (!user) {
            return NextResponse.json([]); // User not found in DB, return empty list
        }
        // 3. Filter projects by this ObjectId
        query = { userId: user._id };
    }

    // 4. Fetch Projects
    console.log(`🔍 Fetching projects for ${session.user?.email} (Admin: ${isAdmin})`);
    const projects = await ServiceRequest.find(query).sort({ createdAt: -1 });
    
    console.log(`✅ Found ${projects.length} projects`);
    return NextResponse.json(projects);

  } catch (error) {
    console.error("Fetch Error:", error);
    return NextResponse.json({ error: "Failed to fetch projects" }, { status: 500 });
  }
}

// POST: Create Project (No changes needed if it works, but including for completeness)
export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { title, description, category } = await req.json(); 
    await dbConnect();

    const user = await User.findOne({ email: session.user?.email });
    if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

    const newRequest = await ServiceRequest.create({
      userId: user._id,           
      user: session.user?.email,  
      title,
      description,
      serviceType: category,      
      category: category,         
      status: "pending",          
      createdAt: new Date(),
    });

    // Email Logic
    if (process.env.EMAIL_SERVER_USER && process.env.EMAIL_SERVER_PASSWORD) {
        const transporter = nodemailer.createTransport({
          host: "smtp.gmail.com", 
          port: 465, 
          secure: true,
          auth: { user: process.env.EMAIL_SERVER_USER, pass: process.env.EMAIL_SERVER_PASSWORD }
        });
        
        try {
          await transporter.sendMail({
              from: `"SaSia Bot" <${process.env.EMAIL_SERVER_USER}>`,
              to: process.env.ADMIN_EMAIL, 
              subject: `🚀 New Project: ${title}`,
              html: `<p>New project from <strong>${session.user?.email}</strong></p>`
          });
        } catch (e) { console.error("Email Error", e); }
    }

    return NextResponse.json(newRequest, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}