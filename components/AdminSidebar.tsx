"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, 
  MessageSquare, 
  Users,
  Settings,
  LogOut,
  ShieldCheck,
  FolderOpen,
  FileText // New Icon for Project Overview
} from "lucide-react";
import { logout } from "@/app/actions/auth";

export default function AdminSidebar() {
  const pathname = usePathname();

  // Check if we are inside a specific project (e.g., /admin/projects/1)
  // We check if the path starts with projects AND has an ID after it.
  const isProjectDetail = pathname.startsWith("/admin/projects/") && pathname.split("/").length > 3;

  const menuItems = [
    { name: "Overview", href: "/admin/dashboard", icon: LayoutDashboard },
    { name: "All Projects", href: "/admin/projects", icon: FolderOpen },
    
    // 🌟 CONDITIONALLY ADDED: "Project Overview"
    // Only shows up when you are actually looking at a project
    ...(isProjectDetail ? [{ 
      name: "Project Overview", 
      href: pathname, // Stays on the current page (highlighted)
      icon: FileText,
      isSubItem: true // Custom flag for styling
    }] : []),

    { name: "Live Chat", href: "/admin/chat", icon: MessageSquare },
    { name: "Clients", href: "/admin/clients", icon: Users },
    { name: "Settings", href: "/admin/settings", icon: Settings },
  ];

  return (
    <aside className="w-64 bg-slate-950 h-screen fixed left-0 top-0 text-white flex flex-col z-40 border-r border-slate-900 shrink-0">
      
      {/* Brand */}
      <div className="p-6 border-b border-slate-900 flex items-center gap-3">
        <div className="h-8 w-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white">
          <ShieldCheck size={18} />
        </div>
        <span className="font-bold text-lg tracking-wide">SaSia Admin</span>
      </div>

      {/* Menu */}
      <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
        {menuItems.map((item) => {
          // Determine if this specific item is active
          const active = item.href === pathname || (item.name === "All Projects" && pathname.startsWith("/admin/projects") && !isProjectDetail);

          return (
            <Link 
              key={item.name} 
              href={item.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 
                ${item.isSubItem ? "ml-4 border-l-2 border-slate-700 pl-4 rounded-l-none" : ""} 
                ${active 
                  ? "bg-indigo-600 text-white shadow-lg shadow-indigo-900/50 font-medium" 
                  : "text-slate-400 hover:bg-slate-900 hover:text-white"
                }
              `}
            >
              <item.icon size={item.isSubItem ? 18 : 20} />
              <span>{item.name}</span>
            </Link>
          );
        })}
      </nav>

      {/* Logout */}
      <div className="p-4 border-t border-slate-900">
        <button 
          onClick={() => logout()}
          className="flex items-center gap-3 px-4 py-3 w-full text-left text-red-400 hover:bg-slate-900 rounded-xl transition-colors"
        >
          <LogOut size={20} />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
}