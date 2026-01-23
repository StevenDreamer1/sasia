"use client";

import { useActionState } from "react"; // ✅ Import the hook
import { loginUser } from "@/app/actions/auth";
import { ShieldCheck, Lock, ArrowRight, AlertCircle } from "lucide-react";

// Initial state for the form
const initialState = {
  error: "",
};

export default function AdminLogin() {
  // ✅ Use the hook to handle the server action
  const [state, formAction, isPending] = useActionState(loginUser, initialState);

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950">
      <div className="bg-slate-900 p-8 rounded-2xl border border-slate-800 shadow-2xl w-full max-w-md">
        
        {/* Header */}
        <div className="text-center mb-8">
           <div className="h-16 w-16 bg-indigo-600/10 rounded-2xl flex items-center justify-center text-indigo-500 mx-auto mb-4 border border-indigo-500/20">
             <ShieldCheck size={32} />
           </div>
           <h1 className="text-2xl font-bold text-white tracking-tight">Admin Portal</h1>
           <p className="text-slate-400 text-sm mt-2">Restricted Access. Authorized Personnel Only.</p>
        </div>

        {/* Error Message (If login fails) */}
        {state?.error && (
          <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl flex items-center gap-3 text-red-400 text-sm">
            <AlertCircle size={18} />
            {state.error}
          </div>
        )}

        {/* Form */}
        <form action={formAction} className="space-y-5">
           
           <div className="space-y-2">
             <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Email Access</label>
             <div className="relative group">
               <div className="absolute left-4 top-3.5 text-slate-500 group-focus-within:text-indigo-500 transition-colors">
                 <ShieldCheck size={18} />
               </div>
               <input 
                 type="email" 
                 name="email"
                 placeholder="admin@sasia.com"
                 defaultValue="admin@sasia.com"
                 className="w-full bg-slate-950 border border-slate-800 text-white rounded-xl py-3 pl-12 pr-4 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all placeholder:text-slate-600"
                 required
               />
             </div>
           </div>

           <div className="space-y-2">
             <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Secure Key</label>
             <div className="relative group">
               <div className="absolute left-4 top-3.5 text-slate-500 group-focus-within:text-indigo-500 transition-colors">
                 <Lock size={18} />
               </div>
               <input 
                 type="password" 
                 name="password"
                 placeholder="••••••••"
                 defaultValue="admin123"
                 className="w-full bg-slate-950 border border-slate-800 text-white rounded-xl py-3 pl-12 pr-4 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all placeholder:text-slate-600"
                 required
               />
             </div>
           </div>

           <button 
             type="submit"
             disabled={isPending}
             className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-3.5 rounded-xl transition-all shadow-lg shadow-indigo-900/20 flex items-center justify-center gap-2 group disabled:opacity-50 disabled:cursor-not-allowed"
           >
             {isPending ? "Authenticating..." : "Access Dashboard"} 
             {!isPending && <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform"/>}
           </button>

        </form>

        <div className="mt-8 text-center">
          <p className="text-xs text-slate-600">
            Unauthorized access attempts are monitored and logged.
          </p>
        </div>

      </div>
    </div>
  );
}