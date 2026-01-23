"use client";

import { useEffect, useState, useRef } from "react";
import { socket } from "@/lib/socket";
import { Send, User, Paperclip, Image as ImageIcon, FileText, Wifi, WifiOff } from "lucide-react";

type Message = {
  author: string;
  message: string;
  time: string;
  type?: "text" | "image" | "file";
  fileName?: string;
};

export default function ChatPage() {
  const [message, setMessage] = useState("");
  const [chatHistory, setChatHistory] = useState<Message[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  
  const chatEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // 1. Connect
    if (!socket.connected) socket.connect();

    // 2. Listen for connection status
    socket.on("connect", () => {
      console.log("🟢 User Connected to Server");
      setIsConnected(true);
    });

    socket.on("disconnect", () => {
      console.log("🔴 User Disconnected");
      setIsConnected(false);
    });

    // 3. Join Room
    const roomName = "project_123"; 
    socket.emit("join_room", roomName);

    // --- NEW: Handle Loading History ---
    socket.on("load_history", (history: Message[]) => {
      console.log("📜 History Loaded:", history.length, "messages");
      setChatHistory(history);
    });

    // 4. Listen for New Messages
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
        author: "Stephen", 
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
        author: "Stephen",
        message: `Sent a file: ${file.name}`,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        type: fileType as "image" | "file",
        fileName: file.name
      };
      socket.emit("send_message", { ...fileMsgData, room: "project_123" });
    }
  };

  return (
    <div className="flex flex-col h-screen bg-slate-50">
      
      {/* CUSTOM HEADER WITH STATUS */}
      <div className="bg-white border-b border-slate-200 px-6 py-4 flex justify-between items-center shadow-sm">
        <h1 className="font-bold text-xl text-slate-800">Studio Chat</h1>
        <div className={`flex items-center gap-2 text-xs font-bold px-3 py-1.5 rounded-full transition-colors ${isConnected ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
          {isConnected ? <Wifi size={14} /> : <WifiOff size={14} />}
          {isConnected ? "Connected" : "Offline"}
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 p-6 overflow-y-auto space-y-4">
        {chatHistory.length === 0 && (
          <div className="text-center text-slate-400 text-sm mt-10">No messages yet. Start the conversation!</div>
        )}
        
        {chatHistory.map((msg, index) => {
          const isMe = msg.author === "Stephen";
          return (
            <div key={index} className={`flex ${isMe ? "justify-end" : "justify-start"}`}>
              <div className={`flex items-end gap-2 max-w-[70%] ${isMe ? "flex-row-reverse" : "flex-row"}`}>
                
                <div className={`h-8 w-8 rounded-full flex items-center justify-center text-xs text-white shrink-0 ${isMe ? "bg-indigo-600" : "bg-slate-400"}`}>
                  {isMe ? "Me" : "ED"}
                </div>

                <div className={`p-3 rounded-2xl shadow-sm ${
                  isMe ? "bg-indigo-600 text-white rounded-br-none" : "bg-white text-slate-700 rounded-bl-none border border-slate-100"
                }`}>
                  
                  {msg.type === "image" ? (
                    <div className="space-y-1">
                      <div className="bg-black/10 rounded-lg p-2 flex items-center gap-2 mb-1">
                        <ImageIcon size={16} /> 
                        <span className="text-xs truncate max-w-[150px]">{msg.fileName}</span>
                      </div>
                      <p className="text-sm italic opacity-80">Image uploading simulated...</p> 
                    </div>
                  ) : msg.type === "file" ? (
                    <div className="flex items-center gap-3 bg-white/10 p-2 rounded-lg">
                       <FileText size={24} />
                       <div>
                         <p className="text-sm font-bold truncate max-w-[150px]">{msg.fileName}</p>
                         <p className="text-xs opacity-70">Document</p>
                       </div>
                    </div>
                  ) : (
                    <p className="text-sm">{msg.message}</p>
                  )}

                  <span className={`text-[10px] block mt-1 text-right ${isMe ? "text-indigo-200" : "text-slate-400"}`}>
                    {msg.time}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
        <div ref={chatEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-4 bg-white border-t border-slate-200">
        <div className="max-w-4xl mx-auto flex items-center gap-3">
          
          <input 
            type="file" 
            ref={fileInputRef} 
            className="hidden" 
            onChange={handleFileSelect} 
          />
          <button 
            onClick={() => fileInputRef.current?.click()}
            className="p-3 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-full transition-colors"
            title="Attach File"
          >
            <Paperclip size={20} />
          </button>

          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && sendMessage()}
            placeholder="Type your feedback here..."
            className="flex-1 bg-slate-50 border border-slate-200 rounded-full px-5 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          
          <button 
            onClick={sendMessage}
            className="p-3 bg-indigo-600 text-white rounded-full hover:bg-indigo-700 shadow-md transition-transform active:scale-95"
          >
            <Send size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}