"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Search, Filter, Folder, ArrowRight, Loader2 } from "lucide-react";

export default function AllProjects() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const res = await fetch("/api/projects");
        if (res.ok) {
          const data = await res.json();
          setProjects(data);
        }
      } catch (error) {
        console.error("Error fetching projects:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProjects();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-slate-500">
        <Loader2 className="animate-spin mb-4" size={32} />
        <p className="font-bold uppercase tracking-widest text-xs">Syncing with Studio...</p>
      </div>
    );
  }

  return (
    <div className="p-8 min-h-screen bg-slate-50 animate-in fade-in duration-500">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">All Projects</h1>
          <p className="text-slate-500 mt-1">Manage, track, and deliver client work.</p>
        </div>
      </div>

      {projects.length === 0 ? (
        <div className="bg-white border-2 border-dashed border-slate-200 rounded-[2.5rem] p-20 flex flex-col items-center justify-center text-center">
          <div className="p-6 bg-slate-50 rounded-full mb-4">
             <Folder size={48} className="text-slate-300" />
          </div>
          <h2 className="text-xl font-bold text-slate-800">No active requests found</h2>
          <p className="text-slate-500 max-w-xs mt-2">When clients submit service requests through their dashboard, they will appear here instantly.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects.map((project: any) => (
            <Link key={project._id} href={`/admin/projects/${project._id}`} className="block group">
              <div className="bg-white border border-slate-200 rounded-[2rem] p-8 hover:shadow-2xl hover:shadow-indigo-100 hover:border-indigo-300 transition-all duration-300 h-full flex flex-col">
                <div className="flex justify-between items-start mb-6">
                  <div className="p-4 bg-indigo-50 text-indigo-600 rounded-2xl group-hover:bg-indigo-600 group-hover:text-white transition-colors duration-300">
                    <Folder size={24} />
                  </div>
                  <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border ${
                    project.status === "Completed" ? "bg-green-50 text-green-700 border-green-100" :
                    project.status === "In Progress" ? "bg-blue-50 text-blue-700 border-blue-100" :
                    "bg-amber-50 text-amber-700 border-amber-100"
                  }`}>
                    {project.status || "New"}
                  </span>
                </div>
                
                <h3 className="font-bold text-xl text-slate-900 group-hover:text-indigo-600 transition-colors">{project.title}</h3>
                <p className="text-sm text-slate-500 mt-2 font-medium">{project.service}</p>
                <p className="text-xs text-slate-400 mt-1">Client: {project.userId}</p>

                <div className="mt-auto pt-6 flex items-center justify-between border-t border-slate-50 mt-8">
                   <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                     {new Date(project.createdAt).toLocaleDateString()}
                   </span>
                   <span className="text-sm font-bold text-indigo-600 flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                     Manage <ArrowRight size={16} />
                   </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}