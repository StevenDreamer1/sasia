"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { socket } from "@/lib/socket"; // ✅ Import the shared socket instance
import { toast } from "react-hot-toast";

export default function AdminRequestsClient() {
  const router = useRouter();

  useEffect(() => {
    // 1. Connect to the Render Socket Server
    if (!socket.connected) {
      socket.connect();
    }

    // 2. Listen for new requests
    const handleNewRequest = (data: any) => {
      toast.success(`New Request: ${data.title}`);
      router.refresh(); // Refresh the page data
    };

    socket.on("new_request_created", handleNewRequest);

    // 3. Cleanup
    return () => {
      socket.off("new_request_created", handleNewRequest);
      // We don't disconnect here to keep the connection alive for chat
    };
  }, [router]);

  return null; // This component handles logic only, no UI
}