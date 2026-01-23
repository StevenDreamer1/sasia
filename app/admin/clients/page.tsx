import { Search, MoreHorizontal, Mail, Phone } from "lucide-react";

// Mock Data
const clients = [
  { id: 1, name: "Stephen D.", email: "stephen@example.com", projects: 4, spent: "$4,200", status: "Active" },
  { id: 2, name: "Sarah Connor", email: "sarah@skynet.com", projects: 1, spent: "$999", status: "Active" },
  { id: 3, name: "Mike Ross", email: "mike@suits.com", projects: 0, spent: "$0", status: "Inactive" },
];

export default function ClientsPage() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-slate-900">Clients</h1>
        <div className="relative">
           <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16}/>
           <input 
             type="text" 
             placeholder="Search clients..." 
             className="pl-10 pr-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 w-64"
           />
        </div>
      </div>

      <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-50 border-b border-slate-200 text-xs uppercase text-slate-500 font-semibold">
            <tr>
              <th className="px-6 py-4">Client Name</th>
              <th className="px-6 py-4">Contact</th>
              <th className="px-6 py-4">Total Projects</th>
              <th className="px-6 py-4">Total Spent</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {clients.map((client) => (
              <tr key={client.id} className="hover:bg-slate-50 transition-colors">
                <td className="px-6 py-4 font-medium text-slate-800 flex items-center gap-3">
                   <div className="h-8 w-8 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center font-bold text-xs">
                      {client.name.substring(0,2)}
                   </div>
                   {client.name}
                </td>
                <td className="px-6 py-4 text-slate-500">
                   <div className="flex flex-col gap-1">
                     <span className="flex items-center gap-1"><Mail size={12}/> {client.email}</span>
                   </div>
                </td>
                <td className="px-6 py-4 font-medium">{client.projects}</td>
                <td className="px-6 py-4 text-slate-600">{client.spent}</td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                    client.status === "Active" ? "bg-green-100 text-green-700" : "bg-slate-100 text-slate-600"
                  }`}>
                    {client.status}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <button className="text-slate-400 hover:text-slate-600"><MoreHorizontal size={18}/></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}