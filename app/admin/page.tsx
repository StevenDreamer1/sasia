"use client";

import { useEffect, useState } from "react";
import { Users, Briefcase, DollarSign, CheckCircle, ArrowUpRight } from "lucide-react";

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalClients: 0,
    activeProjects: 0,
    totalRevenue: 0,
    completedProjects: 0
  });

  useEffect(() => {
    fetch("/api/admin/stats")
      .then((res) => res.json())
      .then((data) => {
        if (!data.error) setStats(data);
      });
  }, []);

  return (
    <div className="p-8 space-y-8">
      <div>
        <h1 className="text-3xl font-black text-slate-900">Dashboard Overview</h1>
        <p className="text-slate-500 mt-2">Welcome back, Admin.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Card 1 */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
           <div className="flex justify-between items-start">
              <div className="p-3 bg-indigo-50 text-indigo-600 rounded-xl"><DollarSign size={24} /></div>
              <span className="flex items-center text-xs font-bold text-green-600 bg-green-50 px-2 py-1 rounded-full">+12% <ArrowUpRight size={12}/></span>
           </div>
           <h3 className="text-3xl font-black text-slate-900 mt-4">${stats.totalRevenue.toLocaleString()}</h3>
           <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mt-1">Total Revenue</p>
        </div>

        {/* Card 2 */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
           <div className="p-3 bg-blue-50 text-blue-600 rounded-xl w-fit"><Briefcase size={24} /></div>
           <h3 className="text-3xl font-black text-slate-900 mt-4">{stats.activeProjects}</h3>
           <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mt-1">Active Projects</p>
        </div>

        {/* Card 3 */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
           <div className="p-3 bg-purple-50 text-purple-600 rounded-xl w-fit"><Users size={24} /></div>
           <h3 className="text-3xl font-black text-slate-900 mt-4">{stats.totalClients}</h3>
           <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mt-1">Total Clients</p>
        </div>

        {/* Card 4 */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
           <div className="p-3 bg-green-50 text-green-600 rounded-xl w-fit"><CheckCircle size={24} /></div>
           <h3 className="text-3xl font-black text-slate-900 mt-4">{stats.completedProjects}</h3>
           <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mt-1">Completed</p>
        </div>
      </div>
    </div>
  );
}