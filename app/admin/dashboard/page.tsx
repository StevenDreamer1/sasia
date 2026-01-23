"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { NotificationBell } from "@/components/NotificationSystem"; // ✅ Import Bell
import { 
  Briefcase, DollarSign, AlertCircle, Users, 
  MessageSquare, Plus, FileText
} from "lucide-react";

export default function AdminDashboard() {
  const [projects] = useState([
    { id: 1, name: "Summer Fashion Reel", client: "Stephen Palepu", status: "In Progress", due: "2 Days" },
    { id: 2, name: "Tech Startup Promo", client: "Sarah Connor", status: "Pending Review", due: "Today" },
    { id: 3, name: "Podcast Editing", client: "Mike Ross", status: "Completed", due: "Ago 1d" },
  ]);

  return (
    <div className="p-8 space-y-8 bg-slate-50 min-h-screen animate-in fade-in duration-500">
      
      {/* HEADER WITH NOTIFICATION BELL */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Command Center</h1>
          <p className="text-slate-500 mt-1">Overview of all active studio operations.</p>
        </div>
        
        <div className="flex items-center gap-4">
          {/* ✅ THE BELL IS HERE */}
          <NotificationBell role="admin" />
          
          <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-3 rounded-xl font-bold flex items-center gap-2 shadow-lg shadow-indigo-200 transition-all active:scale-95">
            <Plus size={20} />
            Create New Project
          </button>
        </div>
      </div>

      {/* METRICS GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm relative overflow-hidden group hover:border-indigo-200 transition-colors">
          <div className="flex justify-between items-start relative">
             <div className="p-3 bg-indigo-50 text-indigo-600 rounded-xl">
               <DollarSign size={24} />
             </div>
             <span className="flex items-center text-xs font-bold text-green-600 bg-green-100 px-2 py-1 rounded-full">+12%</span>
          </div>
          <div className="mt-4">
            <h3 className="text-3xl font-bold text-slate-800">₹65,500</h3>
            <p className="text-xs text-slate-500 font-bold uppercase tracking-wider mt-1">Monthly Revenue</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:border-blue-200 transition-colors">
          <div className="p-3 bg-blue-50 text-blue-600 rounded-xl w-fit mb-4"><Briefcase size={24} /></div>
          <h3 className="text-3xl font-bold text-slate-800">8</h3>
          <p className="text-xs text-slate-500 font-bold uppercase tracking-wider mt-1">Active Projects</p>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:border-amber-200 transition-colors">
          <div className="p-3 bg-amber-50 text-amber-600 rounded-xl w-fit mb-4"><AlertCircle size={24} /></div>
          <h3 className="text-3xl font-bold text-slate-800">3</h3>
          <p className="text-xs text-slate-500 font-bold uppercase tracking-wider mt-1">Pending Review</p>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:border-purple-200 transition-colors">
          <div className="p-3 bg-purple-50 text-purple-600 rounded-xl w-fit mb-4"><Users size={24} /></div>
          <h3 className="text-3xl font-bold text-slate-800">14</h3>
          <p className="text-xs text-slate-500 font-bold uppercase tracking-wider mt-1">Total Clients</p>
        </div>
      </div>

      {/* RECENT PROJECTS TABLE */}
      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
          <div className="p-6 border-b border-slate-100 flex justify-between items-center">
            <h2 className="font-bold text-lg text-slate-800">Recent Projects</h2>
            <Link href="/admin/projects" className="text-indigo-600 text-sm font-bold hover:underline">View All</Link>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead className="bg-slate-50 text-slate-500 text-xs uppercase tracking-wider">
                <tr>
                  <th className="p-4 font-bold">Project Name</th>
                  <th className="p-4 font-bold">Client</th>
                  <th className="p-4 font-bold">Status</th>
                  <th className="p-4 font-bold text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm text-slate-700">
                {projects.map((project) => (
                  <tr key={project.id} className="hover:bg-slate-50 transition-colors group">
                    <td className="p-4 font-medium text-slate-900">
                      {project.name}
                      <span className="block text-xs text-slate-400 font-normal mt-0.5">Due: {project.due}</span>
                    </td>
                    <td className="p-4">{project.client}</td>
                    <td className="p-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                        project.status === "Completed" ? "bg-green-100 text-green-700" :
                        project.status === "Pending Review" ? "bg-amber-100 text-amber-700" :
                        "bg-blue-100 text-blue-700"
                      }`}>
                        {project.status}
                      </span>
                    </td>
                    <td className="p-4 text-right">
                       <Link href="/admin/chat" className="text-slate-400 hover:text-indigo-600 transition-colors inline-block p-2 hover:bg-indigo-50 rounded-lg">
                         <MessageSquare size={18} />
                       </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
      </div>
    </div>
  );
}