import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import dbConnect from "@/lib/mongodb";
import User from "@/models/User";
import bcrypt from "bcryptjs";
// ✅ FIX: Import from the new lib file
import { authOptions } from "@/lib/authOptions"; 

export async function PUT(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    
    // 1. Check if user is logged in
    if (!session || !session.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { name, phone, currentPassword, newPassword } = await req.json();
    await dbConnect();

    const user = await User.findOne({ email: session.user.email });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // 2. Handle Password Change (Optional)
    if (newPassword && currentPassword) {
      // If user uses Google login, they might not have a password
      if (user.password) {
        const isMatch = await bcrypt.compare(currentPassword, user.password);
        if (!isMatch) {
          return NextResponse.json({ error: "Incorrect current password" }, { status: 400 });
        }
      }
      user.password = await bcrypt.hash(newPassword, 10);
    }

    // 3. Update Basic Fields
    if (name) user.name = name;
    if (phone) user.phone = phone;

    await user.save();

    return NextResponse.json({ success: true, message: "Profile updated successfully" });

  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Update failed" }, { status: 500 });
  }
}