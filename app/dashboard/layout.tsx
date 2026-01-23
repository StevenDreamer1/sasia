"use client";

import UserSidebar from "@/components/UserSidebar"; // ✅ Import the new sidebar
import { Toaster } from "react-hot-toast";

export default function UserLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      {/* Toast notifications for the user (like "Request Sent") */}
      <Toaster position="top-right" />

      {/* Main Layout Container: Locks viewport height */}
      <div className="flex h-screen bg-slate-50 overflow-hidden font-sans">
        
        {/* Left: Fixed Sidebar */}
        <UserSidebar />

        {/* Right: Scrollable Content Area */}
        <main className="flex-1 flex flex-col h-full min-w-0 overflow-y-auto relative">
          {children}
        </main>
      </div>
    </>
  );
}