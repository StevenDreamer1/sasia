"use client";

import { Bell, Search } from "lucide-react";

export default function Header({ title }: { title: string }) {
  return (
    <header className="flex h-20 items-center justify-between border-b border-slate-100 bg-white px-8">
      {/* Page Title */}
      <h1 className="text-2xl font-bold text-slate-800">{title}</h1>

      {/* Right Side: Search & Profile */}
      <div className="flex items-center gap-6">
        {/* Search Bar */}
        <div className="relative hidden md:block">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search files or chats..."
            className="h-10 w-64 rounded-full border border-slate-200 bg-slate-50 pl-10 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
          />
        </div>

        {/* Notifications */}
        <button className="relative rounded-full p-2 text-slate-500 hover:bg-slate-100 transition-colors">
          <Bell size={20} />
          <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-red-500 border border-white"></span>
        </button>

        {/* User Profile (Placeholder) */}
        <div className="flex items-center gap-3 border-l border-slate-200 pl-6">
          <div className="h-10 w-10 overflow-hidden rounded-full bg-slate-200 ring-2 ring-white shadow-sm">
            {/* Add <Image /> here later */}
            <div className="flex h-full w-full items-center justify-center bg-indigo-100 text-indigo-700 font-bold">
              SD
            </div>
          </div>
          <div className="hidden text-sm md:block">
            <p className="font-semibold text-slate-700">Stephen D.</p>
            <p className="text-xs text-slate-500">Premium Client</p>
          </div>
        </div>
      </div>
    </header>
  );
}