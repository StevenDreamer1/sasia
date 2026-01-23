"use client";

import { useState } from "react";
import { socket } from "@/lib/socket";
import { useRouter } from "next/navigation";
import { ArrowLeft, Sparkles, Send } from "lucide-react";

export default function NewRequestPage() {
  const [projectName, setProjectName] = useState("");
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (projectName.trim()) {
      socket.emit("new_request_created", {
        client: "Stephen Palepu",
        projectName: projectName
      });
      router.push("/dashboard");
    }
  };

  return (
    <div className="min-h-screen bg-[#F8F9FD] p-10">
      <button onClick={() => router.back()} className="flex items-center gap-2 text-slate-400 hover:text-indigo-600 transition-colors mb-8 font-bold">
        <ArrowLeft size={20} /> Back to Dashboard
      </button>

      <div className="max-w-2xl mx-auto bg-white rounded-[3rem] p-12 shadow-sm border border-slate-100">
        <div className="h-16 w-16 bg-indigo-50 text-indigo-600 rounded-3xl flex items-center justify-center mb-6">
          <Sparkles size={32} />
        </div>
        <h1 className="text-4xl font-black text-slate-800 mb-2">New Service Request</h1>
        <p className="text-slate-500 font-medium mb-10 text-lg">Tell us what you need and we'll handle the rest.</p>

        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="space-y-3">
            <label className="text-sm font-black text-slate-700 uppercase tracking-widest ml-1">Project Name</label>
            <input 
              type="text" 
              placeholder="e.g. YouTube Branding, Video Editing..."
              className="w-full px-8 py-5 bg-slate-50 border-none rounded-[2rem] text-lg font-medium focus:ring-4 ring-indigo-50 transition-all outline-none"
              value={projectName}
              onChange={(e) => setProjectName(e.target.value)}
              required
            />
          </div>

          <button 
            type="submit" 
            className="w-full py-6 bg-indigo-600 text-white rounded-[2rem] text-xl font-black flex items-center justify-center gap-3 hover:bg-indigo-700 shadow-2xl shadow-indigo-100 transition-all active:scale-95"
          >
            Send Request <Send size={24} />
          </button>
        </form>
      </div>
    </div>
  );
}