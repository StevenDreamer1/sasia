import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import User from "@/models/User";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
  try {
    const { name, email, password } = await req.json();
    await dbConnect();

    // 1. Check if user exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json({ error: "Email already registered." }, { status: 400 });
    }

    // 2. Hash Password (Security Layer)
    const hashedPassword = await bcrypt.hash(password, 10);

    // 3. Create User
    await User.create({
      name,
      email,
      password: hashedPassword,
      role: "user", // Default role
      image: "", // Placeholder
    });

    return NextResponse.json({ message: "User created successfully" }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Registration failed" }, { status: 500 });
  }
}