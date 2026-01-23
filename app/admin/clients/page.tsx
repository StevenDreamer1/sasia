"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { 
  Search, MoreHorizontal, Mail, Filter, 
  Download, Plus, ChevronLeft, ChevronRight, Loader2, MessageSquare
} from "lucide-react";

export default function ClientsPage() {
  const [clients, setClients] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  // 1. Fetch Real Data
  useEffect(() => {
    fetch("/api/admin/clients")
      .then((res) => res.json())
      .then((data) => {
        setClients(data);
        setLoading(false);
      });
  }, []);

  // 2. Search Filter Logic
  const filteredClients = clients.filter(client => 
    client._id.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) return <div className="flex h-screen items-center justify-center"><Loader2 className="animate-spin text-indigo-600" /></div>;

  return (
    <div className="p-8 space-y-6 bg-slate-50 min-h-screen font-sans">
      
      {/* HEADER SECTION */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
           <h1 className="text-2xl font-black text-slate-900 tracking-tight">Client Management</h1>
           <p className="text-slate-500 text-sm mt-1">View and manage your client base.</p>
        </div>
        <div className="flex gap-3">
          <button className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 text-slate-600 rounded-xl hover:bg-slate-50 font-bold text-xs shadow-sm transition-all">
            <Download size={16} /> Export
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 font-bold text-xs shadow-lg shadow-indigo-200 transition-all active:scale-95">
            <Plus size={16} /> Add New
          </button>
        </div>
      </div>

      {/* FILTER BAR */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row gap-4 justify-between items-center">
        
        {/* TABS */}
        <div className="flex gap-2 bg-slate-50 p-1 rounded-xl">
           <button className="px-4 py-1.5 bg-white text-slate-800 rounded-lg text-xs font-bold shadow-sm">All Clients</button>
           <button className="px-4 py-1.5 text-slate-500 hover:text-slate-700 rounded-lg text-xs font-bold transition-colors">Active</button>
           <button className="px-4 py-1.5 text-slate-500 hover:text-slate-700 rounded-lg text-xs font-bold transition-colors">Archived</button>
        </div>

        {/* SEARCH & FILTER */}
        <div className="flex items-center gap-3 w-full md:w-auto">
           <div className="relative flex-1 md:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16}/>
              <input 
                type="text" 
                placeholder="Search clients..." 
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border-0 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 transition-all"
              />
           </div>
           <button className="p-2.5 border border-slate-200 rounded-xl hover:bg-slate-50 text-slate-600">
             <Filter size={18} />
           </button>
        </div>
      </div>

      {/* TABLE SECTION */}
      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr>
              <th className="px-6 py-5 text-[11px] font-black text-slate-400 uppercase tracking-wider">Client Name</th>
              <th className="px-6 py-5 text-[11px] font-black text-slate-400 uppercase tracking-wider">Contact</th>
              <th className="px-6 py-5 text-[11px] font-black text-slate-400 uppercase tracking-wider">Projects</th>
              <th className="px-6 py-5 text-[11px] font-black text-slate-400 uppercase tracking-wider">Total Value</th>
              <th className="px-6 py-5 text-[11px] font-black text-slate-400 uppercase tracking-wider">Status</th>
              <th className="px-6 py-5 text-[11px] font-black text-slate-400 uppercase tracking-wider text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filteredClients.length > 0 ? (
              filteredClients.map((client, index) => (
                <tr key={index} className="hover:bg-slate-50 transition-colors group">
                  <td className="px-6 py-4">
                     <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold text-sm uppercase">
                           {client._id.charAt(0)}
                        </div>
                        <div>
                           <p className="font-bold text-slate-800 text-sm">{client._id.split('@')[0]}</p>
                           <p className="text-[10px] text-slate-400">ID: #C-{Math.floor(Math.random() * 1000) + 1000}</p>
                        </div>
                     </div>
                  </td>
                  <td className="px-6 py-4">
                     <div className="flex items-center gap-2 text-slate-500 text-xs font-medium">
                        <Mail size={14} className="text-slate-400" /> 
                        {client._id}
                     </div>
                  </td>
                  <td className="px-6 py-4">
                     <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-slate-100 text-slate-700">
                        {client.projectCount} Projects
                     </span>
                  </td>
                  <td className="px-6 py-4">
                     <p className="font-bold text-slate-800 text-sm">${client.totalSpent.toLocaleString()}</p>
                     <p className="text-[10px] text-slate-400">Est. Revenue</p>
                  </td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black bg-green-100 text-green-700 uppercase tracking-wide">
                       <span className="h-1.5 w-1.5 rounded-full bg-green-600 animate-pulse"></span>
                       Active
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                     <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Link href="/admin/chat" className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors" title="Message">
                           <MessageSquare size={18} />
                        </Link>
                        <button className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors">
                           <MoreHorizontal size={18} />
                        </button>
                     </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6} className="px-6 py-12 text-center text-slate-400 text-sm">
                   No clients found matching "{search}"
                </td>
              </tr>
            )}
          </tbody>
        </table>
        
        {/* PAGINATION FOOTER */}
        <div className="px-6 py-4 border-t border-slate-100 flex items-center justify-between bg-slate-50/50">
           <p className="text-xs font-bold text-slate-500">Showing 1-{filteredClients.length} of {clients.length}</p>
           <div className="flex gap-2">
              <button className="p-2 bg-white border border-slate-200 rounded-lg text-slate-400 hover:text-indigo-600 hover:border-indigo-200 disabled:opacity-50">
                 <ChevronLeft size={16} />
              </button>
              <button className="p-2 bg-white border border-slate-200 rounded-lg text-slate-400 hover:text-indigo-600 hover:border-indigo-200">
                 <ChevronRight size={16} />
              </button>
           </div>
        </div>
      </div>
    </div>
  );
}