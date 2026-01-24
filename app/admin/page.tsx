"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { socket } from "@/lib/socket";
import { toast, Toaster } from "react-hot-toast"; 
import { 
  Briefcase, DollarSign, Users, 
  Plus, User, Zap, Loader2, ArrowUpRight
} from "lucide-react";

export default function AdminDashboard() {
  const [projects, setProjects] = useState<any[]>([]);
  const [newClients, setNewClients] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // 1. REAL-TIME SOCKET LISTENERS
  useEffect(() => {
    if (!socket.connected) socket.connect();

    const handleNewRequest = (data: any) => {
      toast.success(`🚀 New Request: ${data.title}`, { duration: 5000, icon: '🔔' });
      fetchDashboardData(); 
    };

    const handleNewMessage = (data: any) => {
      if (data.sender !== "Admin") {
        toast(`💬 New Message from ${data.sender}`, { duration: 4000, position: "bottom-right" });
      }
    };

    socket.on("admin_notification", handleNewRequest);
    socket.on("receive_message", handleNewMessage);

    return () => {
      socket.off("admin_notification", handleNewRequest);
      socket.off("receive_message", handleNewMessage);
    };
  }, []);

  // 2. FETCH DASHBOARD DATA
  const fetchDashboardData = async () => {
    try {
      // Ensure you have this API route created
      const res = await fetch("/api/admin/requests"); 
      if (res.ok) {
        const data = await res.json();
        
        // Sort by most recent
        const sorted = data.sort((a: any, b: any) => 
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );

        setProjects(sorted.slice(0, 5)); // Keep top 5 for table

        // Extract Unique Clients safely (handling user or userId field)
        const uniqueClients = Array.from(new Set(sorted.map((p: any) => p.user || p.userId)))
          .map(email => sorted.find((p: any) => (p.user || p.userId) === email))
          .filter(Boolean)
          .slice(0, 5);
          
        setNewClients(uniqueClients);
      }
    } catch (error) {
      console.error("Fetch error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  if (loading) return (
    <div className="flex h-screen items-center justify-center bg-slate-50">
      <Loader2 className="animate-spin text-indigo-600" size={40} />
    </div>
  );

  return (
    <div className="p-8 space-y-8 bg-slate-50 min-h-screen animate-in fade-in duration-500">
      <Toaster />
      
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Command Center</h1>
          <p className="text-slate-500 mt-1">Overview of all active studio operations.</p>
        </div>
        
        <div className="flex items-center gap-4">
          <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-3 rounded-xl font-bold flex items-center gap-2 shadow-lg shadow-indigo-200 transition-all active:scale-95 text-sm">
            <Plus size={20} />
            Create Project
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* LEFT COLUMN: Metrics & Projects Table */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* METRICS GRID */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm relative overflow-hidden group hover:border-indigo-200 transition-colors">
              <div className="flex justify-between items-start relative">
                 <div className="p-3 bg-indigo-50 text-indigo-600 rounded-xl">
                   <DollarSign size={24} />
                 </div>
                 <span className="flex items-center text-xs font-bold text-green-600 bg-green-100 px-2 py-1 rounded-full">+12%</span>
              </div>
              <div className="mt-4">
                <h3 className="text-3xl font-black text-slate-800">₹65,500</h3>
                <p className="text-xs text-slate-500 font-bold uppercase tracking-wider mt-1">Monthly Revenue</p>
              </div>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:border-blue-200 transition-colors">
              <div className="p-3 bg-blue-50 text-blue-600 rounded-xl w-fit mb-4"><Briefcase size={24} /></div>
              <h3 className="text-3xl font-black text-slate-800">{projects.length}</h3>
              <p className="text-xs text-slate-500 font-bold uppercase tracking-wider mt-1">Active Projects</p>
            </div>
          </div>

          {/* RECENT PROJECTS TABLE */}
          <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
             <div className="p-6 border-b border-slate-100 flex justify-between items-center">
               <h2 className="font-bold text-lg text-slate-800">Recent Projects</h2>
               <Link href="/admin/projects" className="text-indigo-600 text-sm font-bold hover:underline">View All</Link>
             </div>
             
             <div className="overflow-x-auto">
               <table className="w-full text-left border-collapse min-w-[600px]">
                 <thead className="bg-slate-50 text-slate-500 text-xs uppercase tracking-wider">
                   <tr>
                     <th className="p-4 font-bold">Project Name</th>
                     <th className="p-4 font-bold">Client</th>
                     <th className="p-4 font-bold">Status</th>
                     <th className="p-4 font-bold text-right">Action</th>
                   </tr>
                 </thead>
                 <tbody className="divide-y divide-slate-100 text-sm text-slate-700">
                   {projects.length === 0 ? (
                      <tr><td colSpan={4} className="p-8 text-center text-slate-400">No active projects.</td></tr>
                   ) : (
                     projects.map((project) => (
                       <tr key={project._id} className="hover:bg-slate-50 transition-colors group">
                         <td className="p-4 font-medium text-slate-900">
                           {project.title}
                           <span className="block text-xs text-slate-400 font-normal mt-0.5">
                             {new Date(project.createdAt).toLocaleDateString()}
                           </span>
                         </td>
                         {/* Handles user/userId mismatch safely */}
                         <td className="p-4 font-bold text-slate-600">{(project.user || project.userId || "Unknown").split('@')[0]}</td>
                         <td className="p-4">
                           <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                             project.status === "Completed" ? "bg-green-100 text-green-700" :
                             project.status === "Pending" ? "bg-amber-100 text-amber-700" :
                             "bg-blue-100 text-blue-700"
                           }`}>
                             {project.status || "Pending"}
                           </span>
                         </td>
                         <td className="p-4 text-right">
                            <Link href={`/admin/projects/${project._id}`} className="text-slate-400 hover:text-indigo-600 transition-colors inline-block p-2 hover:bg-indigo-50 rounded-lg">
                              <ArrowUpRight size={18} />
                            </Link>
                         </td>
                       </tr>
                     ))
                   )}
                 </tbody>
               </table>
             </div>
          </div>
        </div>

        {/* RIGHT COLUMN: Client Monitoring Panel */}
        <div className="space-y-6">
          
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:border-purple-200 transition-colors">
             <div className="p-3 bg-purple-50 text-purple-600 rounded-xl w-fit mb-4"><Users size={24} /></div>
             <h3 className="text-3xl font-black text-slate-800">{newClients.length}</h3>
             <p className="text-xs text-slate-500 font-bold uppercase tracking-wider mt-1">New Clients</p>
          </div>

          <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm space-y-6">
            <h2 className="text-xl font-black text-slate-800 flex items-center gap-2">
              <User size={20} className="text-indigo-600" /> Client Monitor
            </h2>
            
            <div className="space-y-4">
              {newClients.map((client) => (
                <div key={client._id} className="flex items-center justify-between border-b border-slate-50 pb-4 last:border-0 last:pb-0">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 bg-slate-100 rounded-full flex items-center justify-center font-bold text-slate-500 uppercase text-xs">
                      {(client.user || client.userId || "C").charAt(0)}
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-bold text-slate-800 truncate w-28">{(client.user || client.userId || "").split('@')[0]}</p>
                      <div className="flex items-center gap-1 mt-0.5">
                        <Zap size={10} className="text-indigo-500" />
                        <p className="text-[9px] font-black text-indigo-500 uppercase tracking-tighter">{client.category || "General"} PLAN</p>
                      </div>
                    </div>
                  </div>
                  <div className="text-[9px] font-bold text-slate-400">
                    {new Date(client.createdAt).toLocaleDateString()}
                  </div>
                </div>
              ))}
            </div>
            
            <Link href="/admin/clients" className="block text-center text-xs font-black text-indigo-600 hover:text-indigo-700 pt-2 transition-colors">
              VIEW ALL CLIENTS
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
}