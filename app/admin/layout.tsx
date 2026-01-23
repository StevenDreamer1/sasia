"use client";

import { useEffect } from "react";
import { socket } from "@/lib/socket";
import { Toaster, toast } from "react-hot-toast"; 
import AdminSidebar from "@/components/AdminSidebar"; // ✅ Using the correct sidebar

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  
  useEffect(() => {
    if (!socket.connected) socket.connect();
    
    // Join global admin feed for notifications
    socket.emit("join_admin_feed");

    const handleRequest = (data: any) => {
      // Play sound if you want: new Audio('/ping.mp3').play();
      toast.success(`🚀 New Request: ${data.title}`, { duration: 5000 });
    };

    const handleMessage = (data: any) => {
      if (data.sender !== "Admin") {
        toast(`💬 ${data.sender}: ${data.text}`, { 
          icon: '📩',
          duration: 4000,
          style: { border: '1px solid #6366f1', padding: '16px' }
        });
      }
    };

    socket.on("admin_notification", handleRequest);
    socket.on("admin_message_alert", handleMessage);

    return () => {
      socket.off("admin_notification");
      socket.off("admin_message_alert");
    };
  }, []);

  return (
    <>
      <Toaster position="top-right" />
      
      {/* MASTER CONTAINER: Locks the viewport height */}
      <div className="flex h-screen bg-slate-50 overflow-hidden font-sans">
        
        {/* SIDEBAR: Fixed width, full height */}
        <AdminSidebar />

        {/* MAIN CONTENT: Takes remaining width, allows internal scrolling */}
        <main className="flex-1 flex flex-col h-full min-w-0 overflow-y-auto relative">
          {children}
        </main>
        
      </div>
    </>
  );
}