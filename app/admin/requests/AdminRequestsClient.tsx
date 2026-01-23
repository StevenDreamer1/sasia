"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { socket } from "@/lib/socket";
import { toast } from "react-hot-toast";

// ✅ 1. Define the props interface so TypeScript is happy
interface AdminRequestsClientProps {
  requests: any[];
}

export default function AdminRequestsClient({ requests }: AdminRequestsClientProps) {
  const router = useRouter();

  // ✅ 2. Socket Logic (Keep the connection alive)
  useEffect(() => {
    if (!socket.connected) socket.connect();

    const handleNewRequest = (data: any) => {
      toast.success(`New Request: ${data.title}`);
      router.refresh();
    };

    socket.on("new_request_created", handleNewRequest);

    return () => {
      socket.off("new_request_created", handleNewRequest);
    };
  }, [router]);

  // Helper for status badges
  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case "completed": return "bg-green-100 text-green-700";
      case "pending": return "bg-yellow-100 text-yellow-700";
      case "rejected": return "bg-red-100 text-red-700";
      default: return "bg-slate-100 text-slate-700";
    }
  };

  // ✅ 3. Render the UI (Table)
  return (
    <div className="p-8">
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200 text-xs uppercase text-slate-500 font-bold">
              <th className="p-4">Title</th>
              <th className="p-4">Client</th>
              <th className="p-4">Date</th>
              <th className="p-4">Status</th>
            </tr>
          </thead>
          <tbody>
            {requests.length === 0 ? (
               <tr><td colSpan={4} className="p-8 text-center text-slate-400">No requests found.</td></tr>
            ) : (
              requests.map((req) => (
                <tr key={req._id} className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                  <td className="p-4 font-bold text-slate-700">{req.title}</td>
                  <td className="p-4 text-slate-600">{req.sender || "Unknown"}</td>
                  <td className="p-4 text-slate-500 text-sm">
                    {req.createdAt ? new Date(req.createdAt).toLocaleDateString() : "-"}
                  </td>
                  <td className="p-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${getStatusColor(req.status)}`}>
                      {req.status || "Pending"}
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}