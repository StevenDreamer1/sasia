"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  Menu, X, LayoutDashboard, FolderPlus, 
  MessageSquare, Settings, LogOut, User 
} from "lucide-react";
import { signOut, useSession } from "next-auth/react";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  const { data: session } = useSession();

  const navItems = [
    { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { name: "Service Request", href: "/dashboard/request", icon: FolderPlus },
    { name: "My Projects", href: "/dashboard/projects", icon: FolderPlus },
    { name: "Live Support", href: "/dashboard/chat", icon: MessageSquare },
    { name: "Settings", href: "/dashboard/settings", icon: Settings },
  ];

  return (
    <div className="flex h-screen bg-slate-50 font-sans overflow-hidden">
      
      {/* 1. MOBILE HEADER (Only visible on Phone) */}
      <div className="md:hidden fixed top-0 left-0 right-0 h-16 bg-[#0F172A] z-50 flex items-center justify-between px-4 shadow-md">
        <div className="text-white font-black text-lg tracking-tight">SaSia Studio</div>
        <button 
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} 
          className="p-2 text-white hover:bg-white/10 rounded-lg transition-colors"
        >
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* 2. SIDEBAR (Smart Responsive) */}
      <aside 
        className={`
          fixed inset-y-0 left-0 z-40 w-64 bg-[#0F172A] text-white transition-transform duration-300 ease-in-out shadow-2xl
          md:translate-x-0 md:static md:shadow-none
          ${isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"}
        `}
      >
        <div className="flex flex-col h-full">
          {/* Logo Area */}
          <div className="p-8 hidden md:block">
             <h1 className="text-2xl font-black tracking-tighter">SaSia Studio</h1>
             <p className="text-xs text-slate-400 tracking-widest uppercase mt-1">Client Portal</p>
          </div>

          {/* Spacer for Mobile Header */}
          <div className="h-20 md:hidden"></div>

          {/* Navigation Links */}
          <nav className="flex-1 px-4 space-y-2 overflow-y-auto">
            {navItems.map((item) => {
               const isActive = pathname === item.href;
               return (
                 <Link 
                   key={item.href} 
                   href={item.href}
                   onClick={() => setIsMobileMenuOpen(false)} 
                   className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-bold text-sm ${isActive ? "bg-indigo-600 text-white shadow-lg shadow-indigo-900/50" : "text-slate-400 hover:bg-white/5 hover:text-white"}`}
                 >
                   <item.icon size={18} />
                   {item.name}
                 </Link>
               );
            })}
          </nav>

          {/* User & Logout */}
          <div className="p-4 border-t border-white/10 bg-[#0F172A]">
            <div className="flex items-center gap-3 px-4 py-3 mb-2">
               <div className="h-8 w-8 rounded-full bg-indigo-500 flex items-center justify-center text-xs font-bold">
                 {session?.user?.name?.[0] || "U"}
               </div>
               <div className="overflow-hidden">
                 <p className="text-sm font-bold truncate">{session?.user?.name || "User"}</p>
                 <p className="text-xs text-slate-400 truncate">{session?.user?.email}</p>
               </div>
            </div>
            <button onClick={() => signOut()} className="flex items-center gap-3 px-4 py-3 text-red-400 hover:bg-white/5 hover:text-red-300 transition-colors w-full font-bold text-sm rounded-xl">
              <LogOut size={18} /> Logout
            </button>
          </div>
        </div>
      </aside>

      {/* 3. MAIN CONTENT (Scrollable) */}
      <main className="flex-1 overflow-y-auto h-full w-full bg-slate-50 pt-16 md:pt-0 relative">
        {/* Overlay for Mobile when menu is open */}
        {isMobileMenuOpen && (
          <div 
            onClick={() => setIsMobileMenuOpen(false)}
            className="md:hidden fixed inset-0 bg-black/50 z-30 backdrop-blur-sm"
          />
        )}
        
        <div className="max-w-7xl mx-auto min-h-full">
          {children}
        </div>
      </main>
    </div>
  );
}