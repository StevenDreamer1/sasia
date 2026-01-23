"use client";

import Link from "next/link";
import { ArrowRight, Video } from "lucide-react";

export default function Navbar() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-100 h-20 flex items-center">
      <div className="max-w-7xl mx-auto w-full px-6 flex justify-between items-center">
        {/* Logo */}
        <div className="flex items-center gap-2">
          <div className="h-10 w-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-indigo-200">
             <Video size={20} />
          </div>
          <span className="text-xl font-bold text-slate-900 tracking-tight">Sasia Studio</span>
        </div>

        {/* Links */}
        <div className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-600">
           <Link href="#features" className="hover:text-indigo-600 transition-colors">Features</Link>
           <Link href="#services" className="hover:text-indigo-600 transition-colors">Services</Link>
           <Link href="#pricing" className="hover:text-indigo-600 transition-colors">Pricing</Link>
        </div>

        {/* Auth Buttons */}
        <div className="flex items-center gap-4">
           <Link href="/login" className="text-sm font-bold text-slate-600 hover:text-indigo-600">
             Log In
           </Link>
           <Link href="/login" className="bg-slate-900 text-white px-5 py-2.5 rounded-xl text-sm font-bold hover:bg-slate-800 transition-all flex items-center gap-2 shadow-lg shadow-slate-200">
             Start Project <ArrowRight size={16} />
           </Link>
        </div>
      </div>
    </nav>
  );
}