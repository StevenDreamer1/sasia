"use client";

import { use, useState, useEffect } from "react";
import Link from "next/link";
import { 
  ArrowLeft, User, Download, FileText, CheckCircle, 
  Clock, Link as LinkIcon, Loader2, MessageSquare, Trash2,
  AlertCircle, Save, Star
} from "lucide-react";

export default function AdminProjectOverview({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const [project, setProject] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [newStatus, setNewStatus] = useState("");
  const [deliveryLink, setDeliveryLink] = useState("");

  const statusSteps = ["New Request", "In Progress", "Review", "Completed"];

  useEffect(() => {
    fetchProjectDetails();
  }, [resolvedParams.id]);

  const fetchProjectDetails = async () => {
    try {
      const res = await fetch(`/api/projects/${resolvedParams.id}`);
      if (res.ok) {
        const data = await res.json();
        setProject(data);
        setNewStatus(data.status || "New Request");
        setDeliveryLink(data.deliveryLink || "");
      }
    } catch (error) {
      console.error("Error fetching project:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async (statusOverride?: string) => {
    setUpdating(true);
    try {
      const res = await fetch(`/api/projects/${resolvedParams.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          status: statusOverride || newStatus,
          deliveryLink: deliveryLink 
        }),
      });
      if (res.ok) {
        await fetchProjectDetails();
        alert("Project updated successfully!");
      }
    } catch (error) {
      alert("Failed to update project.");
    } finally {
      setUpdating(false);
    }
  };

  if (loading) return (
    <div className="flex h-screen items-center justify-center bg-slate-50">
      <Loader2 className="animate-spin text-indigo-600" size={40} />
    </div>
  );

  return (
    <div className="p-8 min-h-screen bg-slate-50 animate-in slide-in-from-right-4 duration-500">
      <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2">
          <Link href="/admin/projects" className="flex items-center gap-2 text-slate-400 hover:text-indigo-600 transition-colors w-fit font-bold">
            <ArrowLeft size={18} /> Back to Projects
          </Link>
          <h1 className="text-3xl font-black text-slate-800 tracking-tight">{project.title}</h1>
          <div className="flex items-center gap-3">
             <span className="px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full text-[10px] font-black uppercase tracking-widest border border-indigo-200">
               {project.service}
             </span>
             <p className="text-slate-400 text-xs font-bold">ID: {project._id}</p>
          </div>
        </div>

        <div className="flex items-center gap-4 bg-white p-4 rounded-3xl border border-slate-200 shadow-sm">
           <div className="space-y-1">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Current Workflow</p>
              <select 
                value={newStatus}
                onChange={(e) => setNewStatus(e.target.value)}
                className="bg-transparent font-bold text-slate-800 outline-none cursor-pointer"
              >
                {statusSteps.map(step => <option key={step} value={step}>{step}</option>)}
              </select>
           </div>
           <button 
             onClick={() => handleUpdate()}
             disabled={updating}
             className="px-6 py-2.5 bg-indigo-600 text-white rounded-2xl font-black text-xs hover:bg-indigo-700 disabled:bg-slate-200 transition-all flex items-center gap-2 shadow-lg shadow-indigo-100"
           >
             {updating ? <Loader2 className="animate-spin" size={14} /> : <Save size={14} />}
             Update Status
           </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          
          {/* ✅ DYNAMIC DELIVERY BOX: Appears only when status is "Completed" */}
          {project.status === "Completed" && (
            <div className="bg-slate-900 rounded-[2.5rem] p-8 text-white shadow-2xl relative overflow-hidden animate-in zoom-in duration-300">
              <div className="relative z-10">
                <h3 className="text-xl font-black mb-2">Deliver Project</h3>
                <p className="text-slate-400 text-sm mb-6 font-medium">Paste the final download link to notify the user and complete the project.</p>
                <div className="flex flex-col md:flex-row gap-4">
                  <input 
                    type="text" 
                    className="flex-1 bg-white/10 border border-white/20 rounded-2xl px-6 py-4 outline-none focus:ring-2 ring-indigo-500 text-sm"
                    placeholder="Google Drive or WeTransfer Link..."
                    value={deliveryLink}
                    onChange={(e) => setDeliveryLink(e.target.value)}
                  />
                  <button 
                    onClick={() => handleUpdate("Completed")}
                    className="bg-indigo-600 px-8 py-4 rounded-2xl font-black hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-500/20 active:scale-95 whitespace-nowrap"
                  >
                    SEND DELIVERY
                  </button>
                </div>
              </div>
            </div>
          )}

          <div className="bg-white p-10 rounded-[2.5rem] border border-slate-200 shadow-sm relative overflow-hidden">
            <h3 className="font-black text-slate-800 mb-10 flex items-center gap-2">
              <Clock size={20} className="text-indigo-600" /> Live Workflow Status
            </h3>
            <div className="flex items-center justify-between relative px-4">
               <div className="absolute left-10 right-10 top-5 h-1 bg-slate-100 -z-0"></div>
               {statusSteps.map((step, i) => {
                 const isCompleted = statusSteps.indexOf(project.status) >= i;
                 return (
                   <div key={i} className="flex flex-col items-center gap-3 relative z-10">
                     <div className={`h-10 w-10 rounded-full flex items-center justify-center border-2 transition-all duration-500 ${
                       isCompleted ? "bg-indigo-600 border-indigo-600 text-white shadow-lg shadow-indigo-100" : "bg-white border-slate-200 text-slate-300"
                     }`}>
                       {isCompleted ? <CheckCircle size={20} /> : <span className="text-xs font-black">{i + 1}</span>}
                     </div>
                     <span className={`text-[10px] font-black uppercase tracking-widest ${isCompleted ? "text-indigo-600" : "text-slate-400"}`}>
                       {step}
                     </span>
                   </div>
                 );
               })}
            </div>
          </div>

          <div className="bg-white p-10 rounded-[2.5rem] border border-slate-200 shadow-sm">
             <h3 className="font-black text-slate-800 mb-6 flex items-center gap-2">
               <FileText size={20} className="text-indigo-600" /> Instructions & Assets
             </h3>
             <div className="p-8 bg-slate-50 rounded-[2rem] border border-slate-100 text-slate-600 font-medium leading-relaxed italic mb-10">
               "{project.instructions || "No custom instructions provided."}"
             </div>

             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {project.files?.map((file: any, i: number) => (
                  <div key={i} className="flex items-center justify-between p-4 bg-white border border-slate-100 rounded-2xl hover:border-indigo-600 transition-colors group">
                    <div className="flex items-center gap-3 overflow-hidden">
                       <FileText size={20} className="text-indigo-600" />
                       <span className="text-xs font-bold truncate text-slate-700">{file}</span>
                    </div>
                    <button className="text-slate-300 hover:text-indigo-600 transition-colors"><Download size={18} /></button>
                  </div>
                ))}
                {project.driveLink && (
                  <a href={project.driveLink} target="_blank" className="md:col-span-2 flex items-center justify-center gap-2 p-5 bg-indigo-50 text-indigo-600 rounded-2xl font-black text-xs border border-indigo-100 hover:bg-indigo-100 transition-all">
                    <LinkIcon size={16} /> OPEN EXTERNAL ASSETS (GOOGLE DRIVE)
                  </a>
                )}
             </div>
          </div>
        </div>

        <div className="space-y-8">
          <div className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm">
             <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-6">Client Identity</h4>
             <div className="flex items-center gap-4 mb-8">
                <div className="h-14 w-14 bg-indigo-600 text-white rounded-2xl flex items-center justify-center font-black text-xl shadow-lg shadow-indigo-100">
                  {project.userId?.charAt(0).toUpperCase() || "S"}
                </div>
                <div>
                  <h5 className="font-black text-slate-900 leading-tight truncate max-w-[150px]">{project.userId}</h5>
                  <p className="text-[10px] font-black text-indigo-600 uppercase">Premium Member</p>
                </div>
             </div>
             <Link href="/admin/chat" className="w-full py-4 bg-slate-900 text-white font-black rounded-2xl flex items-center justify-center gap-2 hover:bg-slate-800 transition-all shadow-xl shadow-slate-200">
                <MessageSquare size={18} /> Direct Chat
             </Link>
          </div>

          <div className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm">
             <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-6">Management Tools</h4>
             <div className="space-y-4">
                <button className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl flex items-center justify-between group hover:border-amber-400 transition-all">
                   <div className="flex items-center gap-3">
                      <Star size={18} className="text-slate-300 group-hover:text-amber-400" />
                      <span className="text-xs font-black text-slate-700">Flag as Priority</span>
                   </div>
                   <div className="h-2 w-2 rounded-full bg-slate-200"></div>
                </button>
                <button className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl flex items-center justify-between group hover:border-red-400 transition-all">
                   <div className="flex items-center gap-3 text-slate-400 group-hover:text-red-500">
                      <Trash2 size={18} />
                      <span className="text-xs font-black">Archive Project</span>
                   </div>
                </button>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}