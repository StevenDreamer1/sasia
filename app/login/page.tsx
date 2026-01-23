"use client";

import { loginUser } from "@/app/actions/auth"; // Import the server action
import { ArrowRight, Video } from "lucide-react";
import { useActionState } from "react";

export default function UserLogin() {
  const [state, formAction, isPending] = useActionState(loginUser, null);

  return (
    <div className="flex min-h-screen bg-white">
      
      {/* LEFT: Login Form */}
      <div className="flex-1 flex flex-col justify-center px-12 sm:px-24 max-w-2xl">
        <div className="mb-10">
          <div className="h-12 w-12 bg-indigo-600 rounded-xl flex items-center justify-center text-white mb-4 shadow-lg shadow-indigo-200">
             <Video size={24} />
          </div>
          <h1 className="text-4xl font-bold text-slate-900 tracking-tight">Welcome back</h1>
          <p className="text-slate-500 mt-2 text-lg">Please enter your details to access your workspace.</p>
        </div>

        <form action={formAction} className="space-y-5">
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">Email</label>
            <input 
              name="email" 
              type="email" 
              defaultValue="stephen@sasia.com"
              className="w-full p-4 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none bg-slate-50 font-medium" 
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">Password</label>
            <input 
              name="password" 
              type="password" 
              defaultValue="user123"
              className="w-full p-4 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none bg-slate-50 font-medium" 
            />
          </div>

          {state?.error && (
            <div className="p-3 bg-red-50 text-red-600 text-sm rounded-lg font-medium">
              ⚠️ {state.error}
            </div>
          )}

          <button 
            disabled={isPending}
            className="w-full py-4 bg-indigo-600 text-white rounded-xl font-bold text-lg hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-200 flex items-center justify-center gap-2"
          >
            {isPending ? "Signing in..." : "Sign In"} <ArrowRight size={20} />
          </button>
        </form>

        <p className="mt-8 text-center text-slate-500">
          New here? <span className="text-indigo-600 font-bold cursor-pointer hover:underline">Create an account</span>
        </p>
      </div>

      {/* RIGHT: Visual Showcase */}
      <div className="hidden lg:flex flex-1 bg-slate-900 relative overflow-hidden items-center justify-center">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-600 to-purple-800 opacity-90"></div>
        <div className="relative z-10 text-center text-white px-12">
           <h2 className="text-5xl font-bold mb-6">Create without limits.</h2>
           <p className="text-xl text-indigo-100 leading-relaxed">Join the premium workspace for creators. Manage uploads, chat with editors, and track your projects in real-time.</p>
        </div>
        {/* Decorative Circle */}
        <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-purple-500 rounded-full blur-3xl opacity-50"></div>
      </div>
    </div>
  );
}