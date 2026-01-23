"use client";

import { use, useEffect, useState } from "react";
import Link from "next/link";
import { socket } from "@/lib/socket"; 
import { 
  ArrowLeft, Clock, CheckCircle2, FileText, 
  Download, ExternalLink, Loader2, MessageSquare, Megaphone, Check
} from "lucide-react";

export default function ProjectTracker({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const [project, setProject] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isMarking, setIsMarking] = useState(false);

  const steps = ["New Request", "In Progress", "Review", "Completed"];

  const fetchProject = async () => {
    try {
      const res = await fetch(`/api/projects/${resolvedParams.id}`);
      if (res.ok) {
        const data = await res.json();
        setProject(data);
      }
    } catch (error) {
      console.error("Error fetching project:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProject();

    if (!socket.connected) socket.connect();
    
    // Auto-refresh UI when admin sends delivery
    socket.on("user_notification", (data) => {
      if (data.projectId === resolvedParams.id) fetchProject();
    });

    return () => { socket.off("user_notification"); };
  }, [resolvedParams.id]);

  // ✅ ADDED FEATURE: Function to let user confirm receipt
  const handleMarkAsReceived = async () => {
    setIsMarking(true);
    try {
      const res = await fetch(`/api/projects/${resolvedParams.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "Assets Received" }),
      });
      
      if (res.ok) {
        socket.emit("project_received_by_user", { projectId: resolvedParams.id });
        await fetchProject();
      }
    } catch (error) {
      alert("Failed to update status.");
    } finally {
      setIsMarking(false);
    }
  };

  if (loading) return (
    <div className="flex h-screen items-center justify-center bg-[#F8F9FD]">
      <Loader2 className="animate-spin text-indigo-600" size={40} />
    </div>
  );

  if (!project) return (
    <div className="p-20 text-center font-bold text-slate-400 uppercase tracking-widest text-xs">Project track not found</div>
  );

  const currentStepIndex = steps.indexOf(project.status || "New Request");

  return (
    <div className="min-h-screen bg-[#F8F9FD] p-6 md:p-12">
      <div className="max-w-5xl mx-auto space-y-8">
        
        {/* Navigation */}
        <Link href="/dashboard/projects" className="flex items-center gap-2 text-slate-400 hover:text-indigo-600 mb-2 font-bold transition-all group w-fit">
          <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" /> 
          Back to My Projects
        </Link>

        {/* ✅ DYNAMIC DELIVERY CARD */}
        {project.deliveryLink && (
          <div className="bg-emerald-600 rounded-[2.5rem] p-10 text-white shadow-xl shadow-emerald-100 animate-in zoom-in duration-500 border border-white/10">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
              <div className="flex items-center gap-6">
                <div className="p-4 bg-white/20 rounded-3xl backdrop-blur-md">
                  <Megaphone size={32} />
                </div>
                <div>
                  <h3 className="text-2xl font-black">Project Assets Delivered!</h3>
                  <p className="text-emerald-100 text-[10px] font-black uppercase tracking-widest">Received from Admin</p>
                </div>
              </div>

              {/* ✅ ADDED FEATURE: Mark as Received Button */}
              {project.status !== "Assets Received" && (
                <button 
                  onClick={handleMarkAsReceived}
                  disabled={isMarking}
                  className="px-6 py-3 bg-emerald-500 hover:bg-emerald-400 text-white border border-emerald-400 rounded-2xl text-xs font-black uppercase tracking-widest transition-all active:scale-95 flex items-center gap-2 shadow-lg"
                >
                  {isMarking ? <Loader2 className="animate-spin" size={14} /> : <Check size={16} />}
                  Mark as Received
                </button>
              )}
            </div>

            <div className="bg-white/10 p-6 rounded-2xl border border-white/20 mb-8">
               <p className="text-lg font-medium break-all leading-relaxed">
                 {project.deliveryLink}
               </p>
            </div>

            {project.deliveryLink.startsWith("http") && (
              <a 
                href={project.deliveryLink} 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-full py-5 bg-white text-emerald-700 rounded-2xl font-black flex items-center justify-center gap-3 hover:bg-emerald-50 transition-all shadow-lg active:scale-95 uppercase tracking-widest"
              >
                Go to Download assets <ExternalLink size={20} />
              </a>
            )}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* LEFT: Tracker & Details */}
          <div className="lg:col-span-2 space-y-8">
            
            <div className="bg-white rounded-[2.5rem] p-10 shadow-sm border border-slate-100">
              <h2 className="text-2xl font-black text-slate-800 mb-10 tracking-tight">Project Tracking</h2>
              <div className="relative flex justify-between items-start px-2">
                <div className="absolute top-5 left-0 w-full h-1 bg-slate-100 -z-0"></div>
                {steps.map((step, index) => {
                  const isPast = index < currentStepIndex;
                  const isCurrent = index === currentStepIndex;
                  return (
                    <div key={step} className="relative z-10 flex flex-col items-center gap-3">
                      <div className={`h-10 w-10 rounded-full flex items-center justify-center transition-all duration-500 ${
                        isPast ? "bg-green-500 text-white shadow-lg shadow-green-100" :
                        isCurrent ? "bg-indigo-600 text-white shadow-lg shadow-indigo-100 ring-4 ring-indigo-50" :
                        "bg-white border-2 border-slate-200 text-slate-300"
                      }`}>
                        {isPast ? <CheckCircle2 size={20} /> : <span className="text-xs font-black">{index + 1}</span>}
                      </div>
                      <span className={`text-[10px] font-black uppercase tracking-widest ${
                        isCurrent ? "text-indigo-600" : "text-slate-400"
                      }`}>{step}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="bg-white rounded-[2.5rem] p-10 shadow-sm border border-slate-100">
              <h3 className="font-black text-slate-800 mb-6 flex items-center gap-2">
                <FileText size={20} className="text-indigo-600" /> Project Brief
              </h3>
              <div className="space-y-6">
                <div>
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Project Title</label>
                  <p className="text-xl font-extrabold text-slate-800 mt-1">{project.title}</p>
                </div>
                <div>
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Instructions</label>
                  <div className="mt-2 p-6 bg-slate-50 rounded-3xl border border-slate-100 text-slate-600 leading-relaxed italic">
                    "{project.instructions || "No custom instructions provided."}"
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-8">
            <div className="bg-white rounded-[2.5rem] p-8 shadow-sm border border-slate-100">
              <h3 className="font-black text-slate-800 mb-6 uppercase text-xs tracking-widest">Your Assets</h3>
              <div className="space-y-4">
                {project.files && project.files.length > 0 ? project.files.map((file: string, i: number) => (
                  <div key={i} className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100 hover:border-indigo-200 transition-colors group">
                    <div className="flex items-center gap-3 overflow-hidden">
                      <FileText className="text-indigo-600 shrink-0" size={18} />
                      <span className="text-xs font-bold text-slate-700 truncate">{file}</span>
                    </div>
                    <button className="text-slate-400 hover:text-indigo-600 transition-colors"><Download size={16} /></button>
                  </div>
                )) : (
                  <p className="text-xs text-slate-400 font-bold italic text-center py-4">No direct uploads.</p>
                )}
                {project.driveLink && (
                  <a href={project.driveLink} target="_blank" className="flex items-center justify-center gap-2 w-full py-4 bg-indigo-50 text-indigo-600 rounded-2xl font-black text-xs hover:bg-indigo-100 transition-all border border-indigo-100 mt-2 uppercase tracking-widest">
                    <ExternalLink size={16} /> GOOGLE DRIVE
                  </a>
                )}
              </div>
            </div>

            <div className="bg-slate-900 rounded-[2.5rem] p-8 shadow-xl shadow-slate-200">
              <h3 className="text-white font-black text-lg leading-tight">Need help?</h3>
              <p className="text-slate-400 text-xs mt-2 mb-6">Discuss details or request changes in real-time.</p>
              <Link href="/chat" className="flex items-center justify-center gap-2 w-full py-4 bg-white text-slate-900 rounded-2xl font-black text-sm hover:bg-slate-100 transition-all active:scale-95">
                <MessageSquare size={18} /> Open Chat
              </Link>
            </div>

            <div className="bg-white rounded-[2rem] p-6 border border-slate-100 flex gap-3">
              <Clock className="text-indigo-500 shrink-0" size={16} />
              <p className="text-[10px] text-slate-500 font-bold leading-tight">
                Received on {new Date(project.createdAt).toLocaleString()}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}