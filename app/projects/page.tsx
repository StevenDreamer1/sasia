"use client";

import { useEffect, useState } from "react";
import Header from "@/components/Header";
import { useRouter } from "next/navigation";
import { Video, Clock, CheckCircle, MessageSquare, Download, AlertCircle, MoreHorizontal } from "lucide-react";

// Define the shape of our API data
type Project = {
  _id: string;
  title: string;
  service: string;
  status: string;
  finalLink?: string;
  createdAt: string;
};

export default function MyProjects() {
  const router = useRouter();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  // FETCH DATA FROM API
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const res = await fetch("/api/projects");
        if (res.ok) {
          const data = await res.json();
          setProjects(data);
        }
      } catch (error) {
        console.error("Failed to load projects", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  const getStatusColor = (status: string) => {
    switch(status) {
      case "Completed": return "bg-green-100 text-green-700 border-green-200";
      case "In Progress": return "bg-blue-50 text-blue-700 border-blue-200";
      case "Review Needed": return "bg-amber-50 text-amber-700 border-amber-200";
      default: return "bg-slate-100 text-slate-600 border-slate-200";
    }
  };

  if (loading) return <div className="p-12 text-center text-slate-500">Loading your workspace...</div>;

  return (
    <div className="flex flex-col min-h-screen bg-slate-50">
      <Header title="My Projects" />

      <div className="p-8 max-w-6xl mx-auto w-full space-y-8">
        
        {/* Stats Row (Calculated from Real Data) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
           <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4">
              <div className="h-12 w-12 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600">
                <Clock size={24} />
              </div>
              <div>
                <p className="text-slate-500 text-xs font-bold uppercase tracking-wider">Active</p>
                <p className="text-2xl font-bold text-slate-800">{projects.filter(p => p.status === "In Progress").length} Projects</p>
              </div>
           </div>
           
           <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4">
               <div className="h-12 w-12 bg-green-50 rounded-xl flex items-center justify-center text-green-600">
                <CheckCircle size={24} />
              </div>
              <div>
                <p className="text-slate-500 text-xs font-bold uppercase tracking-wider">Completed</p>
                <p className="text-2xl font-bold text-slate-800">{projects.filter(p => p.status === "Completed").length} Total</p>
              </div>
           </div>
        </div>

        {/* Projects Grid */}
        <div>
          <h2 className="text-xl font-bold text-slate-800 mb-6">Recent Orders</h2>
          {projects.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-2xl border border-dashed border-slate-300">
                <p className="text-slate-500">You haven't placed any orders yet.</p>
                <button onClick={() => router.push("/services")} className="mt-4 text-indigo-600 font-bold hover:underline">Start a New Project</button>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4">
              {projects.map((project) => (
                <div key={project._id} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow flex flex-col md:flex-row md:items-center justify-between gap-6">
                  
                  {/* Info */}
                  <div className="flex items-start gap-4">
                    <div className="h-12 w-12 bg-slate-900 rounded-xl flex items-center justify-center text-white shrink-0">
                      <Video size={20} />
                    </div>
                    <div>
                      <h3 className="font-bold text-lg text-slate-900">{project.title}</h3>
                      <div className="flex items-center gap-3 mt-1">
                        <span className="text-sm text-slate-500">{project.service}</span>
                        <span className="text-xs text-slate-300">•</span>
                        <span className="text-xs text-slate-400">ID: {project._id.substring(project._id.length - 6)}</span>
                      </div>
                    </div>
                  </div>

                  {/* Status */}
                  <div className="flex items-center gap-6">
                     <div className={`px-4 py-1.5 rounded-full text-xs font-bold border ${getStatusColor(project.status)}`}>
                        {project.status}
                     </div>
                     <p className="text-xs text-slate-400 w-24 text-right">
                       {new Date(project.createdAt).toLocaleDateString()}
                     </p>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-3 pt-4 md:pt-0 border-t md:border-t-0 border-slate-100">
                     <button 
                       onClick={() => router.push("/chat")}
                       className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors" 
                       title="Open Chat"
                     >
                       <MessageSquare size={20} />
                     </button>

                     {project.status === "Completed" && project.finalLink ? (
                        <a 
                          href={project.finalLink} 
                          target="_blank"
                          className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white text-sm font-bold rounded-lg hover:bg-indigo-700 shadow-md shadow-indigo-200 transition-all"
                        >
                          <Download size={16} /> Download
                        </a>
                     ) : (
                       <div className="w-32"></div> 
                     )}

                     <button className="p-2 text-slate-300 hover:text-slate-600">
                       <MoreHorizontal size={20} />
                     </button>
                  </div>

                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}