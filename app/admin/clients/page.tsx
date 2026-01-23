"use client";
import { useEffect, useState } from "react";
import { Mail, Phone, Calendar } from "lucide-react";

export default function ClientsPage() {
  const [clients, setClients] = useState<any[]>([]);

  useEffect(() => {
    fetch("/api/admin/users")
      .then(res => res.json())
      .then(data => setClients(data));
  }, []);

  return (
    <div className="p-8">
      <h1 className="text-3xl font-black text-slate-900 mb-8">Client List</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {clients.map((client) => (
          <div key={client._id} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-all">
             <div className="flex items-center gap-4 mb-6">
                <div className="h-12 w-12 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600 font-bold text-lg">
                  {client.name?.[0] || client.email[0].toUpperCase()}
                </div>
                <div>
                   <h3 className="font-bold text-slate-900">{client.name || "No Name"}</h3>
                   <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full font-bold">Active</span>
                </div>
             </div>
             <div className="space-y-3 text-sm text-slate-600">
                <div className="flex items-center gap-3">
                   <Mail size={16} className="text-slate-400"/> {client.email}
                </div>
                <div className="flex items-center gap-3">
                   <Phone size={16} className="text-slate-400"/> {client.phone || "No Phone"}
                </div>
                <div className="flex items-center gap-3">
                   <Calendar size={16} className="text-slate-400"/> Joined {new Date(client.createdAt).toLocaleDateString()}
                </div>
             </div>
          </div>
        ))}
      </div>
    </div>
  );
}