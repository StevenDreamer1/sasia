"use client";

import { useEffect, useState } from "react";
import { socket } from "@/lib/socket";
import { Bell, X } from "lucide-react";

export default function ToastProvider() {
  const [notification, setNotification] = useState<{title: string, message: string} | null>(null);
  const [show, setShow] = useState(false);

  // A simple beep sound (Base64) to avoid external link issues
  const playNotificationSound = () => {
    try {
      // Professional notification "ping" sound
      const audio = new Audio("https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3");
      audio.volume = 0.5; // 50% volume
      
      const playPromise = audio.play();

      if (playPromise !== undefined) {
        playPromise.catch((error) => {
          console.warn("🔊 Audio blocked. User must interact with the page first.", error);
        });
      }
    } catch (e) {
      console.error("Audio setup failed", e);
    }
  };

  useEffect(() => {
    if (!socket.connected) socket.connect();

    socket.on("admin_notification", (data) => {
      console.log("🔔 Notification Received:", data);
      
      // 1. Play Sound
      playNotificationSound();

      // 2. Show Visual
      setNotification(data);
      setShow(true);

      // 3. Hide after 5s
      setTimeout(() => setShow(false), 5000);
    });

    return () => {
      socket.off("admin_notification");
    };
  }, []);

  if (!show || !notification) return null;

  return (
    <div className="fixed top-6 right-6 z-50 animate-in slide-in-from-right-10 fade-in duration-300">
      <div className="bg-white border-l-4 border-indigo-600 rounded-lg shadow-2xl p-4 w-80 flex items-start gap-3">
        <div className="bg-indigo-100 text-indigo-600 p-2 rounded-full mt-1">
          <Bell size={20} />
        </div>
        <div className="flex-1">
          <h4 className="font-bold text-slate-800 text-sm">{notification.title}</h4>
          <p className="text-slate-600 text-xs mt-1">{notification.message}</p>
        </div>
        <button onClick={() => setShow(false)} className="text-slate-400 hover:text-slate-600">
          <X size={16} />
        </button>
      </div>
    </div>
  );
}