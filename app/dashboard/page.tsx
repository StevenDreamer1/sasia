"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { NotificationBell } from "@/components/NotificationSystem";
import { 
  Plus, Search, TrendingUp, Briefcase, 
  Clock, ChevronRight, Star, Loader2
} from "lucide-react";

export default function UserDashboard() {
  const [latestProjects, setLatestProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ active: 0, finished: 0 });

  // 1. Fetch real projects from your API
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const res = await fetch("/api/projects");
        if (res.ok) {
          const data = await res.json();
          // Filter stats based on status
          const active = data.filter((p: any) => p.status !== "Completed").length;
          const finished = data.filter((p: any) => p.status === "Completed").length;
          
          setStats({ active, finished });
          // Show only the 3 most recent for the feed
          setLatestProjects(data.slice(0, 3));
        }
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboardData();
  }, []);

  if (loading) return (
    <div className="flex h-screen items-center justify-center bg-[#F8F9FD]">
      <Loader2 className="animate-spin text-indigo-600" size={40} />
    </div>
  );

  return (
    <div className="flex min-h-screen bg-[#F8F9FD]">
      {/* Main Content Area */}
      <div className="flex-1 p-10 pr-4">
        <header className="flex justify-between items-center mb-10">
          <div>
            <h2 className="text-3xl font-extrabold text-slate-800 tracking-tight">Good morning, Stephen</h2>
            <p className="text-slate-500 font-medium">Here's what's happening with your projects today.</p>
          </div>
          <div className="relative w-64 group">
            <Search className="absolute left-4 top-3 text-slate-400 group-focus-within:text-indigo-600 transition-colors" size={18} />
            <input 
              type="text" 
              placeholder="Search projects..." 
              className="w-full pl-12 pr-4 py-2.5 bg-white border-none rounded-2xl shadow-sm focus:ring-2 focus:ring-indigo-500 transition-all outline-none"
            />
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-10">
          {/* Featured Card (Sourced from Tidal Light reference) */}
          <div className="bg-indigo-600 rounded-[2.5rem] p-10 text-white relative overflow-hidden shadow-2xl shadow-indigo-200">
            <div className="relative z-10">
              <TrendingUp className="mb-4 opacity-80" size={32} />
              <p className="text-indigo-100 font-bold uppercase tracking-widest text-[10px]">Current Plan</p>
              <h3 className="text-4xl font-black mt-1">Pro Level</h3>
              <div className="mt-10 flex items-center gap-2 bg-white/20 w-fit px-5 py-2 rounded-full backdrop-blur-md text-xs font-black">
                <Star size={14} className="fill-white" /> +10% PRIORITY DELIVERY
              </div>
            </div>
            {/* Decorative Blurs */}
            <div className="absolute -right-10 -bottom-10 h-48 w-48 bg-white/10 rounded-full blur-3xl"></div>
            <div className="absolute top-0 right-0 h-32 w-32 bg-indigo-400/20 rounded-full blur-2xl"></div>
          </div>

          {/* Quick Stats Grid */}
          <div className="grid grid-cols-2 gap-6">
            <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100 flex flex-col justify-between hover:scale-[1.02] transition-all hover:shadow-lg group">
              <span className="h-12 w-12 bg-blue-50 text-blue-500 rounded-2xl flex items-center justify-center font-black text-lg group-hover:bg-blue-500 group-hover:text-white transition-colors">
                {stats.active.toString().padStart(2, '0')}
              </span>
              <p className="font-black text-slate-800 mt-4 leading-tight">Active<br/>Projects</p>
            </div>
            <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100 flex flex-col justify-between hover:scale-[1.02] transition-all hover:shadow-lg group">
              <span className="h-12 w-12 bg-purple-50 text-purple-500 rounded-2xl flex items-center justify-center font-black text-lg group-hover:bg-purple-500 group-hover:text-white transition-colors">
                {stats.finished.toString().padStart(2, '0')}
              </span>
              <p className="font-black text-slate-800 mt-4 leading-tight">Finished<br/>Tasks</p>
            </div>
          </div>
        </div>

        {/* Dynamic Project Feed */}
        <div className="bg-white rounded-[2.5rem] p-8 shadow-sm border border-slate-100">
          <div className="flex justify-between items-center mb-8 px-2">
            <h3 className="font-black text-xl text-slate-800">Your Projects</h3>
            <Link href="/dashboard/projects" className="text-indigo-600 font-black text-sm hover:underline flex items-center gap-1">
              See all <ChevronRight size={14} />
            </Link>
          </div>
          
          <div className="space-y-3">
            {latestProjects.length > 0 ? latestProjects.map((project: any) => (
              <Link 
                key={project._id} 
                href={`/dashboard/projects/${project._id}`}
                className="flex items-center justify-between p-5 hover:bg-slate-50 rounded-[2rem] transition-all group border border-transparent hover:border-slate-100"
              >
                <div className="flex items-center gap-5">
                  <div className="h-14 w-14 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-400 group-hover:bg-indigo-600 group-hover:text-white transition-all shadow-sm">
                    <Briefcase size={24} />
                  </div>
                  <div>
                    <h4 className="font-extrabold text-slate-800 group-hover:text-indigo-600 transition-colors">{project.title}</h4>
                    <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mt-1">
                      {project.status || "Processing"} • {new Date(project.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <ChevronRight className="text-slate-300 group-hover:text-indigo-600 transition-all" size={20} />
              </Link>
            )) : (
              <div className="py-10 text-center space-y-2">
                <p className="text-slate-400 font-bold italic">No active projects found.</p>
                <Link href="/dashboard/request" className="text-indigo-600 text-xs font-black uppercase hover:underline">Start your first request</Link>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Right Action Sidebar */}
      <div className="w-[380px] p-10 space-y-10 border-l border-slate-100 bg-white/50 backdrop-blur-sm">
        <div className="flex justify-end gap-4 items-center">
          <NotificationBell role="user" />
          <Link href="/dashboard/settings" className="h-12 w-12 bg-white rounded-2xl flex items-center justify-center shadow-sm border border-slate-100 overflow-hidden hover:ring-4 ring-indigo-50 transition-all">
            <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Stephen" alt="Profile" className="h-full w-full object-cover" />
          </Link>
        </div>

        {/* New Request Promotion Card */}
        <div className="bg-slate-900 rounded-[2.5rem] p-8 shadow-2xl shadow-slate-200 relative overflow-hidden group">
          <div className="relative z-10">
            <h3 className="text-2xl font-black text-white leading-tight">Need a new<br/>design?</h3>
            <p className="text-slate-400 text-sm mt-3 mb-8 font-medium">Launch a service request and our team will start instantly.</p>
            <Link 
              href="/dashboard/services" 
              className="w-full py-4 bg-indigo-600 text-white rounded-2xl font-black flex items-center justify-center gap-2 hover:bg-indigo-500 transition-all shadow-lg shadow-indigo-900/20 active:scale-95"
            >
              <Plus size={20} /> Service Request
            </Link>
          </div>
          <div className="absolute -bottom-6 -right-6 h-24 w-24 bg-indigo-600/20 rounded-full blur-2xl group-hover:bg-indigo-600/40 transition-colors"></div>
        </div>

        {/* Real-time Update Widget */}
        <div className="space-y-6">
          <h4 className="font-black text-[10px] uppercase tracking-[0.2em] text-slate-400 flex items-center gap-2 px-2">
            <Clock size={14} className="text-indigo-500" /> Recent Activity
          </h4>
          <div className="space-y-3">
             {latestProjects.slice(0, 1).map((p: any) => (
               <div key={p._id} className="bg-white rounded-[2rem] p-6 border border-slate-100 shadow-sm">
                 <div className="flex gap-4">
                   <div className="h-2 w-2 rounded-full bg-indigo-500 mt-2 shrink-0 animate-pulse"></div>
                   <p className="text-sm text-slate-600 font-medium leading-relaxed">
                     Your project <b>{p.title}</b> has been received and is currently marked as <span className="text-indigo-600 font-bold">{p.status || "Pending"}</span>.
                   </p>
                 </div>
               </div>
             ))}
          </div>
        </div>
      </div>
    </div>
  );
}