"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Loader2, ArrowRight, Sparkles, Mail, Lock, User, CheckCircle } from "lucide-react";
import { toast, Toaster } from "react-hot-toast";

export default function RegisterPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState({ name: "", email: "", password: "" });

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const json = await res.json();

      if (!res.ok) {
        toast.error(json.error || "Registration failed");
        setLoading(false);
        return;
      }

      toast.success("Account created! Redirecting...");
      
      // Auto-redirect to login after 2 seconds
      setTimeout(() => {
        router.push("/login");
      }, 1500);

    } catch (error) {
      toast.error("Something went wrong");
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-white font-sans">
      <Toaster position="top-center" />
      
      {/* LEFT SIDE: Visuals */}
      <div className="hidden lg:flex w-1/2 bg-[#0F172A] relative overflow-hidden items-center justify-center p-12">
         <div className="absolute top-0 left-0 w-full h-full opacity-10">
            <div className="absolute bottom-20 left-20 w-80 h-80 bg-purple-600 rounded-full blur-[120px]"></div>
            <div className="absolute top-20 right-20 w-64 h-64 bg-indigo-500 rounded-full blur-[100px]"></div>
         </div>
         
         <div className="relative z-10 text-white max-w-lg">
            <div className="h-16 w-16 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center mb-8 shadow-2xl">
               <Sparkles size={32} />
            </div>
            <h1 className="text-5xl font-black tracking-tight mb-6 leading-tight">
               Join the future of creative work.
            </h1>
            <ul className="space-y-4 text-slate-400 text-lg">
               <li className="flex items-center gap-3"><CheckCircle className="text-green-400" size={20}/> Real-time project tracking</li>
               <li className="flex items-center gap-3"><CheckCircle className="text-green-400" size={20}/> Direct chat with creators</li>
               <li className="flex items-center gap-3"><CheckCircle className="text-green-400" size={20}/> Fast & secure payments</li>
            </ul>
         </div>
      </div>

      {/* RIGHT SIDE: Form */}
      <div className="flex-1 flex items-center justify-center p-8 bg-slate-50 lg:bg-white">
        <div className="w-full max-w-md space-y-8">
          
          <div className="text-center lg:text-left">
            <h2 className="text-3xl font-black text-slate-900 tracking-tight">Create Account</h2>
            <p className="text-slate-500 mt-2">Get started with SaSia Studio today.</p>
          </div>

          <form onSubmit={handleRegister} className="space-y-5">
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase">Full Name</label>
              <div className="relative">
                <User size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  required
                  placeholder="John Doe"
                  className="w-full pl-11 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-600 focus:bg-white outline-none font-medium transition-all"
                  value={data.name}
                  onChange={(e) => setData({ ...data, name: e.target.value })}
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase">Email Address</label>
              <div className="relative">
                <Mail size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="email"
                  required
                  placeholder="name@company.com"
                  className="w-full pl-11 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-600 focus:bg-white outline-none font-medium transition-all"
                  value={data.email}
                  onChange={(e) => setData({ ...data, email: e.target.value })}
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase">Password</label>
              <div className="relative">
                <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="password"
                  required
                  placeholder="Create a strong password"
                  className="w-full pl-11 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-600 focus:bg-white outline-none font-medium transition-all"
                  value={data.password}
                  onChange={(e) => setData({ ...data, password: e.target.value })}
                />
              </div>
            </div>

            <button
              disabled={loading}
              className="w-full py-4 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-200 flex items-center justify-center gap-2 active:scale-95 text-sm"
            >
              {loading ? <Loader2 className="animate-spin" /> : "Create Account"} 
              {!loading && <ArrowRight size={18} />}
            </button>
          </form>

          <div className="pt-6 border-t border-slate-100 text-center">
            <p className="text-slate-500 text-sm">
              Already have an account? 
              <Link href="/login" className="ml-2 text-indigo-600 font-black hover:underline">
                 Log In
              </Link>
            </p>
          </div>

        </div>
      </div>
    </div>
  );
}