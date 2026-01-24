"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, LayoutDashboard, FolderPlus, MessageSquare, Settings, LogOut } from "lucide-react";
import { signOut } from "next-auth/react";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  const navItems = [
    { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { name: "Service Request", href: "/dashboard/request", icon: FolderPlus },
    { name: "Live Support", href: "/dashboard/chat", icon: MessageSquare },
    { name: "Settings", href: "/dashboard/settings", icon: Settings },
  ];

  return (
    <div className="flex h-screen bg-slate-50 font-sans">
      
      {/* 1. MOBILE HEADER (Visible only on small screens) */}
      <div className="md:hidden fixed top-0 left-0 right-0 h-16 bg-white border-b border-slate-200 z-50 flex items-center justify-between px-4">
        <div className="font-black text-xl text-indigo-600 tracking-tighter">SaSia Studio</div>
        <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="p-2 text-slate-600">
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* 2. SIDEBAR (Responsive) */}
      <aside 
        className={`
          fixed inset-y-0 left-0 z-40 w-64 bg-[#0F172A] text-white transition-transform duration-300 ease-in-out
          md:translate-x-0 md:static md:flex md:flex-col
          ${isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"} 
          pt-20 md:pt-0 /* Padding top for mobile header */
        `}
      >
        <div className="p-6 hidden md:block">
           <h1 className="text-2xl font-black tracking-tighter">SaSia Studio</h1>
           <p className="text-xs text-slate-400 tracking-widest uppercase mt-1">Client Portal</p>
        </div>

        <nav className="flex-1 px-4 space-y-2 mt-4">
          {navItems.map((item) => {
             const isActive = pathname === item.href;
             return (
               <Link 
                 key={item.href} 
                 href={item.href}
                 onClick={() => setIsMobileMenuOpen(false)} // Close menu on click (mobile)
                 className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-bold text-sm ${isActive ? "bg-indigo-600 text-white shadow-lg shadow-indigo-900/50" : "text-slate-400 hover:bg-white/5 hover:text-white"}`}
               >
                 <item.icon size={18} />
                 {item.name}
               </Link>
             );
          })}
        </nav>

        <div className="p-4 border-t border-white/10">
          <button onClick={() => signOut()} className="flex items-center gap-3 px-4 py-3 text-slate-400 hover:text-white transition-colors w-full font-bold text-sm">
            <LogOut size={18} /> Logout
          </button>
        </div>
      </aside>

      {/* 3. MAIN CONTENT AREA */}
      <main className="flex-1 overflow-y-auto pt-16 md:pt-0">
        <div className="max-w-7xl mx-auto">
          {children}
        </div>
      </main>
      
      {/* 4. Overlay for Mobile (Click to close) */}
      {isMobileMenuOpen && (
        <div 
          onClick={() => setIsMobileMenuOpen(false)}
          className="md:hidden fixed inset-0 z-30 bg-black/50 backdrop-blur-sm"
        />
      )}
    </div>
  );
}