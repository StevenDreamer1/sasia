"use client";

import { useEffect, useState, useRef } from "react";
import { socket } from "@/lib/socket";
import { Send, Wifi, WifiOff, Loader2, Paperclip, ShieldCheck } from "lucide-react";
import { useSession } from "next-auth/react";

export default function ChatPage() {
  const { data: session } = useSession();
  const [message, setMessage] = useState("");
  const [chatHistory, setChatHistory] = useState<any[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);
  
  const userEmail = session?.user?.email;
  const userRoomId = userEmail ? `user_${userEmail}` : null;

  useEffect(() => {
    if (!userRoomId) return;

    if (!socket.connected) socket.connect();

    socket.emit("join_room", userRoomId);
    socket.emit("get_history", userRoomId);

    const onConnect = () => setIsConnected(true);
    const onDisconnect = () => setIsConnected(false);

    // Handle incoming messages (Both mine and Admin's)
    const handleMessage = (data: any) => {
      if (data.projectId === userRoomId) {
        setChatHistory((prev) => [...prev, data]);
      }
    };

    const handleHistory = (history: any[]) => {
       setChatHistory(history.map(msg => ({
          ...msg,
          time: new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
       })));
    };

    socket.on("connect", onConnect);
    socket.on("disconnect", onDisconnect);
    socket.on("receive_message", handleMessage);
    socket.on("load_history", handleHistory);

    return () => {
      socket.off("connect", onConnect);
      socket.off("disconnect", onDisconnect);
      socket.off("receive_message", handleMessage);
      socket.off("load_history", handleHistory);
    };
  }, [userRoomId]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatHistory]);

  const sendMessage = () => {
    if (message.trim() !== "" && userRoomId) {
      const msgData = {
        projectId: userRoomId, 
        sender: userEmail, 
        text: message,
        type: "text"
      };

      // ❌ REMOVED setChatHistory here. We trust the socket response.
      socket.emit("send_message", msgData);
      setMessage("");
    }
  };

  if (!session) return <div className="h-full flex items-center justify-center"><Loader2 className="animate-spin text-indigo-600"/></div>;

  return (
    <div className="flex flex-col h-full bg-[#FAFAFA] font-sans">
      <div className="h-20 bg-white border-b border-slate-200 px-8 flex justify-between items-center shadow-sm shrink-0 z-10">
        <div className="flex items-center gap-4">
          <div className="h-10 w-10 bg-indigo-600 rounded-full flex items-center justify-center text-white shadow-lg shadow-indigo-200">
             <ShieldCheck size={20} />
          </div>
          <div>
            <h1 className="font-black text-slate-800 text-lg tracking-tight">Support Team</h1>
            <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">Typically replies instantly</p>
          </div>
        </div>
        <div className={`flex items-center gap-2 text-[10px] font-black px-3 py-1.5 rounded-full uppercase tracking-wider ${isConnected ? "bg-green-50 text-green-600 ring-1 ring-green-100" : "bg-red-50 text-red-600 ring-1 ring-red-100"}`}>
          {isConnected ? <Wifi size={12} /> : <WifiOff size={12} />}
          {isConnected ? "Live" : "Offline"}
        </div>
      </div>

      <div className="flex-1 p-8 overflow-y-auto space-y-6">
        {chatHistory.map((msg, index) => {
          const isMe = msg.sender === userEmail;
          return (
            <div key={index} className={`flex w-full ${isMe ? "justify-end" : "justify-start"}`}>
              <div className={`flex items-end gap-3 max-w-[70%] ${isMe ? "flex-row-reverse" : "flex-row"}`}>
                
                {!isMe && (
                  <div className="h-8 w-8 bg-white border border-slate-200 rounded-full flex items-center justify-center text-indigo-600 shadow-sm shrink-0">
                    <ShieldCheck size={14} />
                  </div>
                )}

                <div className={`p-4 shadow-sm relative group ${
                  isMe 
                    ? "bg-indigo-600 text-white rounded-2xl rounded-br-sm" 
                    : "bg-white text-slate-700 rounded-2xl rounded-bl-sm border border-slate-200"
                }`}>
                  <p className="text-[14px] leading-relaxed font-medium">{msg.text}</p>
                  <span className={`text-[10px] absolute -bottom-5 opacity-0 group-hover:opacity-100 transition-opacity font-bold ${isMe ? "right-0 text-slate-400" : "left-0 text-slate-400"}`}>
                      {msg.time}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
        <div ref={chatEndRef} />
      </div>

      <div className="p-6 bg-white border-t border-slate-200 shrink-0">
        <div className="flex items-center gap-4 bg-slate-50 p-2 rounded-2xl border border-slate-200 focus-within:ring-2 focus-within:ring-indigo-100 focus-within:border-indigo-300 transition-all">
          <button className="p-3 text-slate-400 hover:bg-white hover:text-indigo-600 rounded-xl transition-all shadow-sm">
             <Paperclip size={20} />
          </button>
          <input
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && sendMessage()}
            placeholder="Write a message..."
            className="flex-1 bg-transparent border-none outline-none text-sm font-medium text-slate-700 placeholder:text-slate-400"
          />
          <button onClick={sendMessage} className="p-3 bg-indigo-600 text-white rounded-xl shadow-lg shadow-indigo-200 hover:bg-indigo-700 transition-all active:scale-95">
             <Send size={20} />
          </button>
        </div>
      </div>
    </div>
  );
}