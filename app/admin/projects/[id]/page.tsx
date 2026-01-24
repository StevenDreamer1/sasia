"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, Clock, MessageSquare, FileText, CheckCircle, Loader2 } from "lucide-react";
import Link from "next/link";

export default function ProjectDetailsPage() {
  const params = useParams(); // ✅ Safe way to get ID in Next.js 15 (Client)
  const id = params?.id as string;
  const router = useRouter();

  const [project, setProject] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!id) return;

    const fetchProject = async () => {
      try {
        console.log("Fetching Project ID:", id); // Debug Log
        const res = await fetch(`/api/projects/${id}`);
        
        if (!res.ok) {
           const errData = await res.json();
           throw new Error(errData.error || "Failed to load project");
        }

        const data = await res.json();
        console.log("✅ Project Data Received:", data); // Debug Log
        setProject(data);
      } catch (err: any) {
        console.error("❌ Frontend Error:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProject();
  }, [id]);

  if (loading) return (
    <div className="flex h-screen items-center justify-center bg-slate-50">
      <Loader2 className="animate-spin text-indigo-600" size={40} />
    </div>
  );

  if (error || !project) return (
    <div className="p-10 text-center">
      <h2 className="text-2xl font-bold text-slate-800">Project Not Found</h2>
      <p className="text-slate-500 mb-6">{error || "We couldn't locate this project track."}</p>
      <Link href="/dashboard/projects" className="text-indigo-600 font-bold hover:underline">
        ← Back to My Projects
      </Link>
    </div>
  );

  return (
    <div className="max-w-5xl mx-auto p-6 space-y-8 animate-in fade-in duration-500">
      
      {/* Header */}
      <div className="flex items-center gap-4">
        <button onClick={() => router.back()} className="p-2 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors">
          <ArrowLeft size={20} className="text-slate-600" />
        </button>
        <div>
          <h1 className="text-2xl font-black text-slate-800 tracking-tight">{project.title}</h1>
          <div className="flex items-center gap-2 text-sm text-slate-500 font-bold mt-1">
            <span className="uppercase tracking-wider">{project.serviceType || project.category || "Project"}</span>
            <span>•</span>
            <span className="text-indigo-600">ID: {project._id.slice(-6)}</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left: Project Status & Details */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Status Card */}
          <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-slate-200">
             <div className="flex justify-between items-start mb-6">
                <h3 className="font-bold text-slate-400 uppercase tracking-widest text-xs">Current Status</h3>
                <span className={`px-4 py-2 rounded-full text-xs font-black uppercase tracking-wider ${
                  project.status === 'pending' ? 'bg-amber-100 text-amber-700' : 
                  project.status === 'completed' ? 'bg-green-100 text-green-700' : 
                  'bg-indigo-100 text-indigo-700'
                }`}>
                  {project.status || "Pending"}
                </span>
             </div>
             
             {/* Progress Bar Visual */}
             <div className="relative pt-4 pb-2">
               <div className="flex mb-2 items-center justify-between">
                 <div>
                   <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-indigo-600 bg-indigo-200">
                     Progress
                   </span>
                 </div>
                 <div className="text-right">
                   <span className="text-xs font-semibold inline-block text-indigo-600">
                     {project.status === 'completed' ? '100%' : project.status === 'in_progress' ? '50%' : '10%'}
                   </span>
                 </div>
               </div>
               <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-indigo-100">
                 <div style={{ width: project.status === 'completed' ? '100%' : project.status === 'in_progress' ? '50%' : '10%' }} className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-indigo-600 transition-all duration-1000"></div>
               </div>
             </div>
          </div>

          {/* Description */}
          <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-slate-200">
            <h3 className="font-bold text-lg text-slate-800 mb-4 flex items-center gap-2">
              <FileText size={20} className="text-indigo-500"/> Project Brief
            </h3>
            <p className="text-slate-600 leading-relaxed whitespace-pre-wrap">
              {project.description}
            </p>
          </div>
        </div>

        {/* Right: Metadata & Actions */}
        <div className="space-y-6">
           <div className="bg-slate-900 text-white p-8 rounded-[2rem] shadow-xl">
              <h3 className="font-bold text-lg mb-6">Details</h3>
              
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                   <div className="p-2 bg-white/10 rounded-lg"><Clock size={18} /></div>
                   <div>
                     <p className="text-xs text-slate-400 font-bold uppercase">Created</p>
                     <p className="text-sm font-bold">{new Date(project.createdAt).toLocaleDateString()}</p>
                   </div>
                </div>

                <div className="flex items-center gap-3">
                   <div className="p-2 bg-white/10 rounded-lg"><CheckCircle size={18} /></div>
                   <div>
                     <p className="text-xs text-slate-400 font-bold uppercase">Estimated Delivery</p>
                     <p className="text-sm font-bold">2-4 Business Days</p>
                   </div>
                </div>
              </div>

              <div className="mt-8 pt-6 border-t border-white/10">
                 <Link href="/dashboard/chat" className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-bold flex items-center justify-center gap-2 transition-all">
                   <MessageSquare size={18} /> Chat with Support
                 </Link>
              </div>
           </div>
        </div>

      </div>
    </div>
  );
}