"use client";

import { useEffect, useState, useRef } from "react";
import { socket } from "@/lib/socket";
import { 
  Send, 
  User, 
  ShieldCheck, 
  CheckCheck, 
  Paperclip, 
  Image as ImageIcon, 
  FileText,
  Wifi,
  WifiOff
} from "lucide-react";

type Message = {
  author: string;
  message: string;
  time: string;
  type?: "text" | "image" | "file";
  fileName?: string;
};

export default function AdminChat() {
  const [message, setMessage] = useState("");
  const [chatHistory, setChatHistory] = useState<Message[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  
  const chatEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!socket.connected) socket.connect();

    socket.on("connect", () => {
      console.log("🟢 Admin Connected");
      setIsConnected(true);
    });

    socket.on("disconnect", () => {
      console.log("🔴 Admin Disconnected");
      setIsConnected(false);
    });

    const roomName = "project_123"; 
    socket.emit("join_room", roomName);

    socket.on("load_history", (history: Message[]) => {
      setChatHistory(history);
    });

    socket.on("receive_message", (data: Message) => {
      setChatHistory((prev) => [...prev, data]);
    });

    return () => {
      socket.off("connect");
      socket.off("disconnect");
      socket.off("join_room");
      socket.off("load_history");
      socket.off("receive_message");
    };
  }, []);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatHistory]);

  const sendMessage = async () => {
    if (message !== "") {
      const msgData: Message = {
        author: "Admin",
        message: message,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        type: "text"
      };
      await socket.emit("send_message", { ...msgData, room: "project_123" });
      setMessage("");
    }
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const fileType = file.type.startsWith("image/") ? "image" : "file";
      const fileMsgData: Message = {
        author: "Admin",
        message: `Sent a file: ${file.name}`,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        type: fileType as "image" | "file",
        fileName: file.name
      };
      socket.emit("send_message", { ...fileMsgData, room: "project_123" });
    }
  };

  return (
    <div className="flex h-screen bg-slate-100 overflow-hidden">
      
      {/* Sidebar */}
      <div className="w-80 bg-white border-r border-slate-200 flex flex-col hidden md:flex shrink-0">
        <div className="p-6 border-b border-slate-100">
          <h2 className="font-bold text-slate-800 text-xl">Inbox</h2>
          <p className="text-slate-400 text-xs mt-1">1 active conversation</p>
        </div>
        <div className="flex-1 overflow-y-auto">
          <div className="p-4 bg-indigo-50 border-l-4 border-indigo-600 cursor-pointer hover:bg-slate-50 transition-colors">
            <div className="flex justify-between mb-1">
               <span className="font-bold text-slate-900 text-sm">Stephen P.</span>
               <span className="text-xs text-slate-400">Now</span>
            </div>
            <p className="text-xs text-slate-600 truncate">Project: Summer Fashion Reel</p>
          </div>
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col min-w-0">
        
        {/* Chat Header */}
        <div className="h-16 bg-white border-b border-slate-200 flex items-center px-6 justify-between shadow-sm shrink-0">
           <div className="flex items-center gap-3 overflow-hidden">
             <div className="h-10 w-10 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center font-bold shrink-0">
               SP
             </div>
             <div className="overflow-hidden">
               <h3 className="font-bold text-slate-800 truncate">Stephen Palepu</h3>
               <div className="flex items-center gap-1.5">
                 <span className={`h-2 w-2 rounded-full shrink-0 transition-colors ${isConnected ? "bg-green-500 animate-pulse" : "bg-red-500"}`}></span>
                 <span className="text-xs text-slate-500 truncate">{isConnected ? "System Online" : "Disconnected"}</span>
               </div>
             </div>
           </div>
           
           <div className={`flex items-center gap-2 text-xs font-bold px-3 py-1.5 rounded-full shrink-0 transition-colors ${isConnected ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
              {isConnected ? <Wifi size={14} /> : <WifiOff size={14} />}
              <span className="hidden sm:inline">{isConnected ? "Connected" : "Offline"}</span>
           </div>
        </div>

        {/* Messages Feed */}
        <div className="flex-1 p-6 overflow-y-auto space-y-6 bg-slate-50/50">
           {chatHistory.map((msg, index) => {
             const isAdmin = msg.author === "Admin";
             return (
               <div key={index} className={`flex ${isAdmin ? "justify-end" : "justify-start"}`}>
                 <div className={`flex items-end gap-3 max-w-[85%] ${isAdmin ? "flex-row-reverse" : "flex-row"}`}>
                    
                    {/* Avatar */}
                    <div className={`h-8 w-8 rounded-full flex items-center justify-center shrink-0 shadow-sm ${isAdmin ? "bg-indigo-600 text-white" : "bg-white text-slate-600 border border-slate-200"}`}>
                      {isAdmin ? <ShieldCheck size={14} /> : <User size={14} />}
                    </div>

                    {/* Bubble */}
                    <div className={`p-4 shadow-sm ${
                      isAdmin 
                        ? "bg-indigo-600 text-white rounded-2xl rounded-tr-sm" 
                        : "bg-white text-slate-700 rounded-2xl rounded-tl-sm border border-slate-100"
                    }`}>
                      
                      {msg.type === "image" ? (
                        <div className="space-y-1">
                          <div className={`rounded-lg p-2 flex items-center gap-2 mb-1 ${isAdmin ? "bg-white/20" : "bg-slate-100"}`}>
                            <ImageIcon size={16} /> 
                            <span className="text-xs truncate max-w-[150px]">{msg.fileName}</span>
                          </div>
                          <p className="text-sm italic opacity-80">Image attached</p> 
                        </div>
                      ) : msg.type === "file" ? (
                        <div className={`flex items-center gap-3 p-2 rounded-lg ${isAdmin ? "bg-white/20" : "bg-slate-100"}`}>
                           <FileText size={24} />
                           <div>
                             <p className="text-sm font-bold truncate max-w-[150px]">{msg.fileName}</p>
                             <p className="text-xs opacity-70">Document</p>
                           </div>
                        </div>
                      ) : (
                        <p className="text-sm leading-relaxed break-words">{msg.message}</p>
                      )}

                      <div className={`flex items-center gap-1 mt-1 ${isAdmin ? "justify-end text-indigo-200" : "text-slate-400"}`}>
                        <span className="text-[10px]">{msg.time}</span>
                        {isAdmin && <CheckCheck size={12} />}
                      </div>
                    </div>

                 </div>
               </div>
             )
           })}
           <div ref={chatEndRef} />
        </div>

        {/* Input Area (SIMPLIFIED & FORCED FULL WIDTH) */}
        <div className="flex items-center gap-3 p-4 bg-white border-t border-slate-200 shrink-0 w-full">
             
             {/* File Attachment Button */}
             <input 
                type="file" 
                ref={fileInputRef} 
                className="hidden" 
                onChange={handleFileSelect} 
             />
             <button 
                onClick={() => fileInputRef.current?.click()}
                className="p-3 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-full transition-colors shrink-0"
                title="Attach File"
             >
                <Paperclip size={20} />
             </button>

             <input
               type="text"
               value={message}
               onChange={(e) => setMessage(e.target.value)}
               onKeyPress={(e) => e.key === "Enter" && sendMessage()}
               placeholder="Reply to Stephen..."
               className="flex-1 bg-slate-100 border-0 rounded-xl px-5 py-4 text-sm focus:ring-2 focus:ring-indigo-500 transition-all text-slate-800 placeholder:text-slate-400 min-w-0"
             />
             <button 
               onClick={sendMessage}
               className="p-4 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-200 shrink-0"
             >
               <Send size={20} />
             </button>
        </div>

      </div>
    </div>
  );
}