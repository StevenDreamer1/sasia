"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function loginUser(prevState: any, formData?: FormData) {
  
  // 1. Detect where formData is (User Form vs Admin Form)
  const data = (prevState instanceof FormData ? prevState : formData);

  if (!data) {
    console.log("❌ Error: No Form Data Received");
    return { error: "System Error: No data" };
  }

  // 2. Extract & Clean Data (Remove extra spaces)
  const rawEmail = data.get("email") as string;
  const rawPass = data.get("password") as string;

  const email = rawEmail?.trim();
  const password = rawPass?.trim();

  // 3. Debug Log (Check your VS Code Terminal when you click login)
  console.log(`🔐 Attempting Login: [${email}] with pass [${password}]`);

  // 4. ADMIN LOGIN CHECK
  if (email === "admin@sasia.com" && password === "admin123") {
    console.log("✅ Admin Logged In");
    const cookieStore = cookies();
    (await cookieStore).set("user_role", "admin");
    redirect("/admin/dashboard");
  }

  // 5. USER LOGIN CHECK (Stephen)
  if (email === "stephen@sasia.com" && password === "password") {
    console.log("✅ User Logged In");
    const cookieStore = cookies();
    (await cookieStore).set("user_role", "user");
    (await cookieStore).set("user_email", email);
    redirect("/dashboard");
  }

  // 6. FAILURE
  console.log("❌ Login Failed: Credentials did not match.");
  return { error: "Invalid credentials. Please check email/password." };
}

export async function logout() {
  const cookieStore = cookies();
  (await cookieStore).delete("user_role");
  (await cookieStore).delete("user_email");
  redirect("/login");
}