"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { socket } from "@/lib/socket";
import { toast } from "react-hot-toast";

// ✅ 1. Define the props interface for strict type safety
interface AdminRequestsClientProps {
  requests: any[];
}

export default function AdminRequestsClient({ requests }: AdminRequestsClientProps) {
  const router = useRouter();

  // ✅ 2. Socket Logic & Cleanup Fix
  useEffect(() => {
    // Ensure socket is connected on mount
    if (!socket.connected) socket.connect();

    const handleNewRequest = (data: any) => {
      toast.success(`New Request: ${data.title}`, {
        icon: '🚀',
        duration: 4000
      });
      // Refresh the server components to show the new data
      router.refresh();
    };

    socket.on("new_request_created", handleNewRequest);

    // ✅ FIX: Cleanup function must return void, not the socket object
    return () => {
      socket.off("new_request_created", handleNewRequest);
      // We don't call socket.disconnect() here to keep the connection 
      // active for other admin pages/notifications.
    };
  }, [router]);

  // Helper for status badges
  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case "completed": return "bg-green-100 text-green-700";
      case "pending": return "bg-yellow-100 text-yellow-700";
      case "rejected": return "bg-red-100 text-red-700";
      case "processing": return "bg-blue-100 text-blue-700";
      default: return "bg-slate-100 text-slate-700";
    }
  };

  // ✅ 3. Render the UI
  return (
    <div className="p-4 md:p-8">
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        
        {/* ✅ MOBILE SCROLL FIX: Wrap the table in a container */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[700px]">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-[10px] uppercase text-slate-500 font-black tracking-wider">
                <th className="p-5">Project Title</th>
                <th className="p-5">Client Email</th>
                <th className="p-5">Submission Date</th>
                <th className="p-5">Status</th>
                <th className="p-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {requests.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-12 text-center text-slate-400 italic">
                    No service requests found in the database.
                  </td>
                </tr>
              ) : (
                requests.map((req) => (
                  <tr key={req._id} className="hover:bg-slate-50/50 transition-colors group">
                    <td className="p-5">
                      <div className="flex flex-col">
                        <span className="font-bold text-slate-800">{req.title}</span>
                        <span className="text-[10px] text-slate-400 font-medium uppercase tracking-tighter">
                          {req.serviceType || req.category || "General"}
                        </span>
                      </div>
                    </td>
                    <td className="p-5 text-slate-600 font-medium">
                      {req.user || req.sender || "Unknown"}
                    </td>
                    <td className="p-5 text-slate-500 text-sm">
                      {req.createdAt ? new Date(req.createdAt).toLocaleDateString(undefined, {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric'
                      }) : "-"}
                    </td>
                    <td className="p-5">
                      <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wide ${getStatusColor(req.status)}`}>
                        {req.status || "Pending"}
                      </span>
                    </td>
                    <td className="p-5 text-right">
                      <button 
                        onClick={() => router.push(`/admin/requests/${req._id}`)}
                        className="text-xs font-black text-indigo-600 hover:text-indigo-800 uppercase tracking-widest"
                      >
                        Details
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        {/* END MOBILE SCROLL FIX */}

      </div>
    </div>
  );
}