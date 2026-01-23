"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react"; 
import { 
  LayoutDashboard, PlusCircle, FolderHeart, Settings, LogOut, Sparkles, LifeBuoy
} from "lucide-react";

const menuItems = [
  { name: "Dashboard", icon: LayoutDashboard, path: "/dashboard" },
  { name: "Service Request", icon: PlusCircle, path: "/dashboard/request" },
  { name: "My Projects", icon: FolderHeart, path: "/dashboard/projects" },
  // ✅ FIX: Updated path to match the new folder location
  { name: "Live Support", icon: LifeBuoy, path: "/dashboard/chat" }, 
  { name: "Settings", icon: Settings, path: "/dashboard/settings" },
];

export default function UserSidebar() {
  const pathname = usePathname();

  return (
    <div className="w-64 min-w-[16rem] h-full bg-[#0F172A] text-white flex flex-col shadow-xl shrink-0 font-sans border-r border-slate-800">
      
      {/* Brand Header */}
      <div className="p-6 flex items-center gap-3">
        <div className="h-10 w-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-indigo-900/50">
          <Sparkles size={24} strokeWidth={2.5} />
        </div>
        <div>
          <h1 className="text-lg font-black tracking-tight">SaSia Studio</h1>
          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Client Portal</p>
        </div>
      </div>

      {/* Navigation Menu */}
      <nav className="flex-1 px-4 space-y-2 mt-4">
        {menuItems.map((item) => {
          // Fix active state highlighting for sub-routes
          const isActive = item.path === "/dashboard" 
            ? pathname === "/dashboard"
            : pathname.startsWith(item.path);

          return (
            <Link 
              key={item.path} 
              href={item.path}
              className={`flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all duration-200 group ${
                isActive 
                  ? "bg-indigo-600 text-white shadow-lg shadow-indigo-900/50 font-bold" 
                  : "text-slate-400 hover:bg-slate-800 hover:text-white font-medium"
              }`}
            >
              <item.icon size={20} className={isActive ? "text-white" : "text-slate-500 group-hover:text-white"} />
              <span className="text-sm">{item.name}</span>
            </Link>
          );
        })}
      </nav>

      {/* Logout Button */}
      <div className="p-4 mt-auto">
        <button 
          onClick={() => signOut({ callbackUrl: "/login" })}
          className="flex items-center gap-3 px-4 py-3 w-full rounded-xl text-slate-400 hover:bg-red-500/10 hover:text-red-400 transition-colors font-bold text-sm"
        >
          <LogOut size={18} />
          <span>Logout</span>
        </button>
      </div>
    </div>
  );
}