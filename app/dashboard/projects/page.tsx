"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Folder, Clock, ChevronRight, Loader2, MessageSquare } from "lucide-react";

export default function MyProjects() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserProjects = async () => {
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
    fetchUserProjects();
  }, []);

  if (loading) return (
    <div className="flex h-screen items-center justify-center bg-slate-50">
      <Loader2 className="animate-spin text-indigo-600" size={32} />
    </div>
  );

  return (
    <div className="min-h-screen bg-[#F8F9FD] p-10">
      <div className="max-w-6xl mx-auto">
        <header className="mb-10">
          <h1 className="text-3xl font-black text-slate-800 tracking-tight">My Projects</h1>
          <p className="text-slate-500 font-medium">Manage and track your service requests.</p>
        </header>

        {projects.length === 0 ? (
          <div className="bg-white rounded-[2.5rem] p-20 text-center border border-slate-100 shadow-sm">
            <Folder size={48} className="mx-auto text-slate-200 mb-4" />
            <p className="text-slate-400 font-bold">No projects yet. Start by creating a request!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {projects.map((project: any) => (
              <div key={project._id} className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm hover:shadow-md transition-all group">
                <div className="flex justify-between items-start mb-6">
                  <div className="p-4 bg-indigo-50 text-indigo-600 rounded-2xl group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                    <Folder size={24} />
                  </div>
                  <span className="px-4 py-1.5 bg-blue-50 text-blue-600 rounded-full text-[10px] font-black uppercase tracking-widest border border-blue-100">
                    {project.status || "Pending"}
                  </span>
                </div>
                
                <h3 className="text-xl font-extrabold text-slate-800">{project.title}</h3>
                <p className="text-sm text-slate-400 font-bold mt-1 uppercase tracking-tight">{project.service}</p>
                
                <div className="mt-8 pt-6 border-t border-slate-50 flex items-center justify-between">
                  <div className="flex items-center gap-2 text-slate-400">
                    <Clock size={14} />
                    <span className="text-[10px] font-bold uppercase">{new Date(project.createdAt).toLocaleDateString()}</span>
                  </div>
                  <Link href={`/dashboard/projects/${project._id}`} className="flex items-center gap-1 text-sm font-black text-indigo-600 hover:underline">
                    View Track <ChevronRight size={16} />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}