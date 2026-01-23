"use client";

import { useEffect, useState } from "react";
import { 
  Search, Bell, Settings, Plus, 
  MoreVertical, Calendar, UserPlus, 
  CheckCircle, Clock, Filter 
} from "lucide-react";

type Request = {
  _id: string;
  userId: string;
  serviceType: string;
  instructions: string;
  status: "pending" | "in_progress" | "completed";
  designation?: string; // For visual parity with the screenshot
  createdAt?: string;
};

export default function AdminRequestsPage() {
  const [requests, setRequests] = useState<Request[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchRequests = async () => {
    try {
      const res = await fetch("/api/admin/requests");
      const data = await res.json();
      setRequests(data);
    } catch (error) {
      console.error("Error fetching requests:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const updateStatus = async (id: string, status: string) => {
    await fetch("/api/admin/requests/update", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, status }),
    });
    fetchRequests();
  };

  if (loading) return (
    <div className="flex h-screen items-center justify-center bg-[#F8F9FD]">
      <p className="text-indigo-600 animate-pulse font-bold">Initializing Dashboard...</p>
    </div>
  );

  return (
    <div className="flex min-h-screen bg-[#F8F9FD] font-sans text-slate-800">
      {/* 1. Left Sidebar Navigation */}
      <aside className="w-64 bg-white border-r border-slate-100 flex flex-col p-6">
        <div className="flex items-center gap-3 mb-10 px-2">
          <div className="bg-indigo-600 p-2 rounded-xl text-white">
            <UserPlus size={20} />
          </div>
          <span className="text-xl font-black tracking-tight">Hireism</span>
        </div>
        
        <nav className="space-y-1">
          {["Dashboard", "Recruitment", "Interview", "Onboarding", "Training"].map((item) => (
            <button key={item} className={`w-full text-left px-4 py-3 rounded-xl font-bold text-sm transition-all ${item === 'Recruitment' ? 'bg-indigo-50 text-indigo-600' : 'text-slate-400 hover:bg-slate-50 hover:text-slate-600'}`}>
              {item}
            </button>
          ))}
        </nav>
      </aside>

      {/* 2. Main Content Area */}
      <main className="flex-1 p-8 overflow-y-auto">
        {/* Header */}
        <header className="flex justify-between items-center mb-8">
          <div className="relative w-96 group">
            <Search className="absolute left-4 top-3 text-slate-400 group-focus-within:text-indigo-600 transition-colors" size={18} />
            <input 
              type="text" 
              placeholder="Search something..." 
              className="w-full pl-12 pr-4 py-2.5 bg-white border border-slate-100 rounded-2xl shadow-sm focus:ring-2 focus:ring-indigo-500 transition-all outline-none"
            />
          </div>
          <button className="bg-indigo-600 text-white px-6 py-2.5 rounded-xl font-bold flex items-center gap-2 shadow-lg shadow-indigo-100 hover:bg-indigo-700 transition-all active:scale-95">
            <Plus size={18} /> Add New
          </button>
        </header>

        {/* Hero Banner */}
        <section className="bg-gradient-to-r from-indigo-500 to-indigo-700 rounded-[2.5rem] p-10 text-white flex justify-between items-center relative overflow-hidden mb-10 shadow-2xl shadow-indigo-100">
          <div className="relative z-10">
            <h2 className="text-3xl font-black mb-2">Good Morning Admin</h2>
            <p className="text-indigo-100 opacity-90 max-w-sm">
              You have {requests.length} new service requests today. Let's get them organized!
            </p>
            <button className="mt-6 bg-white text-indigo-600 px-6 py-2 rounded-xl font-black text-sm hover:bg-indigo-50 transition-colors">
              Review Now
            </button>
          </div>
          <div className="hidden lg:block relative z-10 mr-10">
             <div className="w-32 h-32 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center">
                <CheckCircle size={64} className="text-white opacity-80" />
             </div>
          </div>
          {/* Decorative shapes */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-20 -mt-20 blur-3xl"></div>
        </section>

        {/* Recruitment Progress Table */}
        <section className="bg-white rounded-[2.5rem] p-8 shadow-sm border border-slate-100">
          <div className="flex justify-between items-center mb-8">
            <h3 className="text-xl font-black">Service Requests Progress</h3>
            <button className="text-indigo-600 font-bold text-sm flex items-center gap-1 hover:underline">
              View All <Filter size={14} />
            </button>
          </div>

          <table className="w-full text-left">
            <thead>
              <tr className="text-slate-400 text-xs font-black uppercase tracking-widest border-b border-slate-50">
                <th className="pb-4 px-4">User ID</th>
                <th className="pb-4 px-4">Service Type</th>
                <th className="pb-4 px-4">Status</th>
                <th className="pb-4 px-4">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {requests.map((req) => (
                <tr key={req._id} className="group hover:bg-slate-50/50 transition-colors">
                  <td className="py-5 px-4 font-bold text-slate-700">{req.userId.substring(0, 8)}...</td>
                  <td className="py-5 px-4 font-bold text-slate-800">{req.serviceType}</td>
                  <td className="py-5 px-4">
                    <select
                      value={req.status}
                      onChange={(e) => updateStatus(req._id, e.target.value as any)}
                      className={`text-xs font-black px-3 py-1.5 rounded-full border-none outline-none appearance-none cursor-pointer ${
                        req.status === 'completed' ? 'bg-emerald-50 text-emerald-600' : 
                        req.status === 'in_progress' ? 'bg-amber-50 text-amber-600' : 'bg-blue-50 text-blue-600'
                      }`}
                    >
                      <option value="pending">● Pending</option>
                      <option value="in_progress">● In Progress</option>
                      <option value="completed">● Completed</option>
                    </select>
                  </td>
                  <td className="py-5 px-4">
                    <button className="text-slate-300 hover:text-indigo-600 transition-colors">
                      <MoreVertical size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      </main>

      {/* 3. Right Information Panel */}
      <aside className="w-80 bg-white border-l border-slate-100 p-8 hidden xl:flex flex-col gap-10">
        {/* User Profile Info */}
        <div className="flex items-center justify-between">
          <div className="flex gap-2">
            <button className="p-2 text-slate-400 hover:bg-slate-50 rounded-xl transition-colors"><Settings size={20} /></button>
            <button className="p-2 text-slate-400 hover:bg-slate-50 rounded-xl transition-colors relative">
              <Bell size={20} />
              <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
            </button>
          </div>
          <div className="flex items-center gap-3">
            <div className="text-right">
              <p className="text-sm font-black">Sara Abraham</p>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Administrator</p>
            </div>
            <div className="w-10 h-10 rounded-full bg-slate-200 overflow-hidden border-2 border-indigo-100">
               <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Sara" alt="Avatar" />
            </div>
          </div>
        </div>

        {/* Schedule Calendar Widget */}
        <div className="bg-indigo-50/50 rounded-3xl p-6">
          <div className="flex justify-between items-center mb-4">
             <h4 className="font-black text-sm">Schedule Calendar</h4>
             <Calendar size={16} className="text-indigo-400" />
          </div>
          <div className="flex justify-between">
            {['Mon', 'Tue', 'Wed', 'Thu', 'Fri'].map((day, i) => (
              <div key={day} className={`flex flex-col items-center p-2 rounded-xl ${i === 2 ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200' : 'text-slate-400'}`}>
                <span className="text-[10px] font-bold uppercase">{day}</span>
                <span className="text-sm font-black">{22 + i}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Activity Feed */}
        <div>
          <div className="flex justify-between items-center mb-6">
            <h4 className="font-black text-sm">Recent Activity</h4>
            <button className="text-indigo-600 text-[10px] font-black uppercase hover:underline">View All</button>
          </div>
          <div className="space-y-4">
             {requests.slice(0, 3).map((req) => (
               <div key={req._id} className="flex gap-4 items-center p-3 rounded-2xl hover:bg-slate-50 transition-colors cursor-pointer group">
                  <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-400 group-hover:bg-indigo-600 group-hover:text-white transition-all">
                    <Clock size={18} />
                  </div>
                  <div>
                    <p className="text-xs font-black text-slate-800">{req.serviceType}</p>
                    <p className="text-[10px] text-slate-400 font-bold">Request ID: {req._id.substring(0, 6)}</p>
                  </div>
               </div>
             ))}
          </div>
        </div>
      </aside>
    </div>
  );
}