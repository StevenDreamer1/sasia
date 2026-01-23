"use client";

import "./globals.css";
import { Inter } from "next/font/google";
import Sidebar from "@/components/Sidebar";
import AdminSidebar from "@/components/AdminSidebar"; // <--- Import this
import ToastProvider from "@/components/ToastProvider";
import { usePathname } from "next/navigation";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  const isPublicPage = pathname === "/" || pathname === "/login" || pathname.startsWith("/admin/login");
  const isAdminPage = pathname.startsWith("/admin");

  return (
    <html lang="en">
      <body className={inter.className}>
        <ToastProvider />

        <div className="flex">
          {/* 1. Show User Sidebar (For Users) */}
          {!isPublicPage && !isAdminPage && <Sidebar />}

          {/* 2. Show Admin Sidebar (For Admins) - NEW */}
          {isAdminPage && !isPublicPage && <AdminSidebar />}

          {/* 3. Main Content */}
          <main className={`flex-1 ${!isPublicPage ? "ml-64" : ""}`}>
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}