"use client";

import { useEffect, useState, useRef } from "react";
import { socket } from "@/lib/socket";
import { Send, Search, User, ShieldCheck, Phone, Video, Paperclip, RefreshCw } from "lucide-react";

export default function AdminChat() {
  const [users, setUsers] = useState<any[]>([]);
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [message, setMessage] = useState("");
  const [chatHistory, setChatHistory] = useState<any[]>([]);
  const chatEndRef = useRef<HTMLDivElement>(null);

  // 1. Fetch Users from the new API
  const fetchUsers = async () => {
    try {
      const res = await fetch("/api/admin/inbox");
      const data = await res.json();
      
      // Filter out admin just in case
      const validUsers = data.filter((u: any) => 
        !u._id.toLowerCase().includes("admin")
      );
      
      setUsers(validUsers);
      
      // If no user selected yet, select the first one
      if (!selectedUser && validUsers.length > 0) {
        setSelectedUser(validUsers[0]);
      }
    } catch (err) {
      console.error("Failed to load inbox", err);
    }
  };

  useEffect(() => {
    fetchUsers();
    // Optional: Poll for new users every 10 seconds
    const interval = setInterval(fetchUsers, 10000);
    return () => clearInterval(interval);
  }, []);

  // 2. Connect to Specific User Room
  useEffect(() => {
    if (!selectedUser) return;
    
    // ✅ The room ID is user_{EMAIL}
    const targetRoom = `user_${selectedUser._id}`;
    console.log("Admin joining:", targetRoom);

    if (!socket.connected) socket.connect();
    
    socket.emit("join_room", targetRoom);
    socket.emit("get_history", targetRoom);

    const handleHistory = (data: any[]) => setChatHistory(data);
    const handleMessage = (data: any) => {
      if (data.projectId === targetRoom) {
        setChatHistory((prev) => [...prev, data]);
      }
    };

    socket.on("load_history", handleHistory);
    socket.on("receive_message", handleMessage);

    return () => {
      socket.off("load_history", handleHistory);
      socket.off("receive_message", handleMessage);
    };
  }, [selectedUser]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatHistory]);

  const sendMessage = () => {
    if (message.trim() !== "" && selectedUser) {
      const targetRoom = `user_${selectedUser._id}`;
      const msgData = {
        projectId: targetRoom,
        sender: "Admin",
        text: message,
        type: "text"
      };

      socket.emit("send_message", msgData);
      setMessage("");
    }
  };

  return (
    <div className="flex h-full bg-slate-50 font-sans overflow-hidden">
      {/* Sidebar */}
      <div className="w-80 bg-white border-r border-slate-200 flex flex-col shrink-0 z-20">
        <div className="p-6 border-b border-slate-100 flex justify-between items-center">
          <h2 className="font-black text-2xl text-slate-800">Inbox</h2>
          <button onClick={fetchUsers} className="p-2 hover:bg-slate-100 rounded-full text-slate-500" title="Refresh List">
             <RefreshCw size={16} />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto p-2 space-y-1">
          {users.length === 0 && <p className="text-center text-slate-400 text-sm mt-10">No messages yet.</p>}
          
          {users.map((u) => (
            <div 
              key={u._id} 
              onClick={() => setSelectedUser(u)} 
              className={`p-4 rounded-xl cursor-pointer flex items-center gap-3 transition-all ${
                selectedUser?._id === u._id ? "bg-indigo-600 text-white shadow-md" : "hover:bg-slate-100 text-slate-700"
              }`}
            >
              <div className={`h-10 w-10 rounded-full flex items-center justify-center font-bold uppercase text-xs ${
                 selectedUser?._id === u._id ? "bg-white/20 text-white" : "bg-indigo-100 text-indigo-600"
              }`}>
                {u._id.charAt(0)}
              </div>
              <div className="min-w-0 flex-1">
                <p className="font-bold text-sm truncate">{u._id}</p>
                <p className={`text-xs truncate ${selectedUser?._id === u._id ? "text-indigo-100" : "text-slate-400"}`}>
                  {u.lastMessage || "Click to chat"}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col min-w-0 bg-[#FAFAFA]">
        {selectedUser ? (
          <>
            <div className="h-20 border-b border-slate-200 bg-white px-8 flex justify-between items-center shadow-sm z-10">
                <div className="flex items-center gap-4">
                  <div className="h-10 w-10 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600 font-bold uppercase">
                    {selectedUser._id.charAt(0)}
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-800 text-lg">{selectedUser._id}</h3>
                    <span className="text-xs text-green-600 font-bold flex items-center gap-1">● Active Chat</span>
                  </div>
                </div>
            </div>

            <div className="flex-1 p-8 overflow-y-auto space-y-6">
               {chatHistory.map((msg, index) => {
                   const isAdmin = msg.sender === "Admin";
                   return (
                     <div key={index} className={`flex w-full ${isAdmin ? "justify-end" : "justify-start"}`}>
                       <div className={`flex items-end gap-2 max-w-[60%] ${isAdmin ? "flex-row-reverse" : "flex-row"}`}>
                         <div className={`h-8 w-8 rounded-full flex items-center justify-center shrink-0 ${isAdmin ? "bg-indigo-600 text-white" : "bg-white border border-slate-200 text-slate-500"}`}>
                            {isAdmin ? <ShieldCheck size={14} /> : <User size={14} />}
                         </div>
                         <div className={`p-3 px-4 shadow-sm rounded-2xl text-sm ${isAdmin ? "bg-indigo-600 text-white rounded-tr-sm" : "bg-white text-slate-700 rounded-tl-sm border border-slate-200"}`}>
                           {msg.text}
                         </div>
                       </div>
                     </div>
                   );
               })}
               <div ref={chatEndRef} />
            </div>

            <div className="p-6 bg-white border-t border-slate-200">
               <div className="flex items-center gap-2 bg-slate-50 p-2 rounded-2xl border border-slate-200">
                 <input 
                   value={message} 
                   onChange={(e) => setMessage(e.target.value)} 
                   onKeyPress={(e) => e.key === "Enter" && sendMessage()} 
                   placeholder="Type a reply..." 
                   className="flex-1 bg-transparent border-none outline-none text-sm px-4" 
                 />
                 <button onClick={sendMessage} className="p-3 bg-indigo-600 text-white rounded-xl shadow-lg hover:bg-indigo-700 transition-all">
                    <Send size={18} />
                 </button>
               </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-slate-300">
             <User size={64} className="opacity-20 mb-4" />
             <p className="font-bold text-lg text-slate-400">Select a client from the sidebar</p>
          </div>
        )}
      </div>
    </div>
  );
}