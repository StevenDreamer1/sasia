"use client";

import { useState, useEffect } from "react";
import { Bell } from "lucide-react";
import { socket } from "@/lib/socket";

export function NotificationBell({ role }: { role: "admin" | "user" }) {
  const [notifications, setNotifications] = useState<any[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    if (!socket.connected) socket.connect();

    // 1. Join the feed based on role
    if (role === "admin") {
      socket.emit("join_admin_feed");
    }

    // 2. Listen for Service Requests
    const handleRequest = (data: any) => {
      const newNotif = {
        id: Date.now(),
        title: "New Service Request",
        msg: `${data.user} requested ${data.title}`,
        time: "Just Now",
        type: "request"
      };
      setNotifications(prev => [newNotif, ...prev]);
      setUnreadCount(prev => prev + 1);
    };

    // 3. Listen for Messages
    const handleMessage = (data: any) => {
      // Don't notify admin of their own messages
      if (data.sender === "Admin") return;

      const newNotif = {
        id: Date.now(),
        title: "New Message",
        msg: `${data.sender}: ${data.text}`,
        time: "Just Now",
        type: "message"
      };
      setNotifications(prev => [newNotif, ...prev]);
      setUnreadCount(prev => prev + 1);
    };

    socket.on("admin_notification", handleRequest);
    socket.on("admin_message_alert", handleMessage);

    return () => {
      socket.off("admin_notification", handleRequest);
      socket.off("admin_message_alert", handleMessage);
    };
  }, [role]);

  return (
    <div className="relative">
      <button 
        onClick={() => {
          setIsOpen(!isOpen);
          if (!isOpen) setUnreadCount(0); // Clear count on open
        }}
        className="p-3 bg-white border border-slate-200 text-slate-600 rounded-xl hover:bg-slate-50 transition-colors relative"
      >
        <Bell size={20} />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 h-5 w-5 bg-red-500 text-white text-[10px] font-bold flex items-center justify-center rounded-full animate-bounce">
            {unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 top-full mt-2 w-80 bg-white rounded-2xl shadow-xl border border-slate-100 z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
          <div className="p-4 border-b border-slate-50 flex justify-between items-center">
            <h3 className="font-bold text-slate-800 text-sm">Notifications</h3>
            <button onClick={() => setNotifications([])} className="text-[10px] text-indigo-600 font-bold hover:underline">Clear all</button>
          </div>
          <div className="max-h-[300px] overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="p-6 text-center text-slate-400 text-xs italic">
                No new notifications
              </div>
            ) : (
              notifications.map((notif) => (
                <div key={notif.id} className="p-4 border-b border-slate-50 hover:bg-slate-50 transition-colors cursor-pointer">
                  <div className="flex items-start gap-3">
                    <div className={`h-2 w-2 mt-1.5 rounded-full shrink-0 ${notif.type === 'request' ? 'bg-green-500' : 'bg-indigo-500'}`} />
                    <div>
                      <p className="text-xs font-bold text-slate-800">{notif.title}</p>
                      <p className="text-xs text-slate-500 mt-0.5 line-clamp-2">{notif.msg}</p>
                      <p className="text-[9px] text-slate-300 mt-2 font-bold uppercase">{notif.time}</p>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}