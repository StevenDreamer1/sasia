"use client";

import { useEffect, useState } from "react";
import { socket } from "@/lib/socket";
import { Bell, X, Briefcase, MessageSquare } from "lucide-react";

type Notification = {
  id: number;
  title: string;
  message: string;
  time: string;
  type: "message" | "project" | "system";
  read: boolean;
};

export function NotificationBell({ role }: { role: "admin" | "user" }) {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [alert, setAlert] = useState<Notification | null>(null);

  useEffect(() => {
    if (!socket.connected) socket.connect();

    socket.emit("identify", role);

    socket.on("admin_notification", (data: any) => {
      const newNotif = { ...data, read: false };
      setNotifications(prev => [newNotif, ...prev]);
      setAlert(newNotif);
      setTimeout(() => setAlert(null), 5000);
    });

    socket.on("receive_message", (data: any) => {
      const myName = role === "admin" ? "Admin" : "Stephen";
      if (data.author !== myName) {
         const newNotif: Notification = {
            id: Date.now(),
            title: `Message from ${data.author}`,
            message: data.message,
            time: "Just Now",
            type: "message",
            read: false
         };
         setNotifications(prev => [newNotif, ...prev]);
         setAlert(newNotif);
      }
    });

    return () => {
      socket.off("admin_notification");
      socket.off("receive_message");
    };
  }, [role]);

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <>
      {alert && (
        <div className="fixed top-20 right-8 z-50 bg-white border-l-4 border-indigo-600 shadow-2xl rounded-lg p-4 w-80 animate-in slide-in-from-right flex gap-3">
          <div className="bg-indigo-50 p-2 rounded-full h-10 w-10 flex items-center justify-center shrink-0 text-indigo-600">
            {alert.type === "message" ? <MessageSquare size={20}/> : <Briefcase size={20} />}
          </div>
          <div className="flex-1">
            <h4 className="font-bold text-slate-800 text-sm">{alert.title}</h4>
            <p className="text-slate-600 text-xs mt-1">{alert.message}</p>
          </div>
          <button onClick={() => setAlert(null)} className="text-slate-400 hover:text-slate-600"><X size={16}/></button>
        </div>
      )}

      <div className="relative">
        <button 
          onClick={() => setIsOpen(!isOpen)}
          className="relative p-2 bg-white border border-slate-200 text-slate-500 hover:text-indigo-600 hover:bg-slate-50 rounded-full transition-all shadow-sm"
        >
          <Bell size={20} />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 h-4 w-4 bg-red-500 text-[10px] text-white flex items-center justify-center rounded-full border-2 border-white font-bold">
              {unreadCount}
            </span>
          )}
        </button>

        {isOpen && (
          <>
            <div className="fixed inset-0 z-10" onClick={() => setIsOpen(false)} />
            <div className="absolute right-0 mt-3 w-80 bg-white rounded-2xl shadow-xl border border-slate-100 z-20 overflow-hidden">
              <div className="p-4 border-b border-slate-50 flex justify-between items-center bg-slate-50/50">
                <h3 className="font-bold text-slate-800 text-sm">Notifications</h3>
                <button 
                  onClick={() => setNotifications(prev => prev.map(n => ({...n, read: true})))}
                  className="text-xs text-indigo-600 font-bold hover:underline"
                >
                  Mark all read
                </button>
              </div>
              <div className="max-h-60 overflow-y-auto">
                {notifications.length === 0 && <div className="p-8 text-center text-xs text-slate-400">No new notifications</div>}
                {notifications.map(n => (
                  <div key={n.id} className={`p-4 border-b border-slate-50 flex gap-3 ${n.read ? "opacity-50" : "bg-indigo-50/20"}`}>
                    <div className="flex-1">
                      <p className="text-sm font-bold text-slate-800">{n.title}</p>
                      <p className="text-xs text-slate-500">{n.message}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
      </div>
    </>
  );
}