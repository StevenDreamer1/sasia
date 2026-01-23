"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, 
  MessageSquare, 
  PlusSquare, 
  Settings, 
  LogOut,
  FolderKanban
} from "lucide-react";

export default function Sidebar() {
  const pathname = usePathname();
  const isActive = (path: string) => pathname === path;

  const menuItems = [
    { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { name: "Service Request", href: "/dashboard/services", icon: PlusSquare }, // ✅ RENAMED
    { name: "My Projects", href: "/dashboard/projects", icon: FolderKanban },
    { name: "Messages", href: "/chat", icon: MessageSquare },
    { name: "Settings", href: "/dashboard/settings", icon: Settings },
  ];

  return (
    <aside className="w-64 bg-slate-900 h-screen fixed left-0 top-0 text-white flex flex-col z-40">
      <div className="p-8">
        <h1 className="text-2xl font-bold">SaSia Studio</h1>
      </div>

      <nav className="flex-1 px-4 space-y-2">
        {menuItems.map((item) => (
          <Link 
            key={item.href} 
            href={item.href}
            className={`flex items-center gap-3 px-4 py-3 rounded-2xl transition-all ${
              isActive(item.href) 
                ? "bg-indigo-600 text-white shadow-lg" 
                : "text-slate-400 hover:bg-slate-800 hover:text-white"
            }`}
          >
            <item.icon size={20} />
            <span className="font-medium">{item.name}</span>
          </Link>
        ))}
      </nav>

      <div className="p-6 border-t border-slate-800">
        <button className="flex items-center gap-3 text-slate-400 hover:text-red-400 px-4 w-full">
          <LogOut size={20} />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
}