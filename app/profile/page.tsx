"use client";

import Header from "@/components/Header";
import { User, Mail, Shield, CreditCard, Clock, Camera } from "lucide-react";

export default function UserProfile() {
  return (
    <div className="min-h-screen bg-slate-50">
      <Header title="My Profile" />

      <div className="p-8 max-w-4xl mx-auto space-y-8">
        
        {/* 1. Identity Section */}
        <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row items-center gap-8">
           <div className="relative group">
             {/* Profile Image Placeholder */}
             <div className="h-24 w-24 rounded-full bg-slate-200 border-4 border-white shadow-md overflow-hidden">
                <img src="https://ui-avatars.com/api/?name=Stephen+P&background=6366f1&color=fff" alt="User" className="w-full h-full object-cover"/>
             </div>
             <button className="absolute bottom-0 right-0 p-2 bg-indigo-600 text-white rounded-full shadow-lg hover:bg-indigo-700 transition-colors">
               <Camera size={14} />
             </button>
           </div>
           <div className="text-center md:text-left flex-1">
             <h2 className="text-2xl font-bold text-slate-900">Stephen Palepu</h2>
             <p className="text-slate-500">Member since Oct 2025</p>
             <div className="flex items-center justify-center md:justify-start gap-2 mt-2">
               <span className="px-3 py-1 bg-indigo-50 text-indigo-700 rounded-full text-xs font-bold">Pro Plan</span>
             </div>
           </div>
        </div>

        {/* 2. Login Details */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
           <div className="p-6 border-b border-slate-100 bg-slate-50/50">
             <h3 className="font-bold text-slate-800 flex items-center gap-2">
               <Shield size={18} className="text-slate-400"/> Login & Security
             </h3>
           </div>
           <div className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 <div>
                   <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Email Address</label>
                   <div className="flex items-center gap-3 p-3 border border-slate-200 rounded-xl bg-slate-50 text-slate-600">
                     <Mail size={18}/>
                     <span>stephen@sasia.com</span>
                   </div>
                 </div>
                 <div>
                   <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Password</label>
                   <div className="flex items-center justify-between p-3 border border-slate-200 rounded-xl bg-slate-50 text-slate-600">
                     <span>••••••••••••</span>
                     <button className="text-xs font-bold text-indigo-600 hover:underline">Change</button>
                   </div>
                 </div>
              </div>
           </div>
        </div>

        {/* 3. Payment Details */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
           <div className="p-6 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
             <h3 className="font-bold text-slate-800 flex items-center gap-2">
               <CreditCard size={18} className="text-slate-400"/> Payment Methods
             </h3>
             <button className="text-sm font-bold text-indigo-600 hover:bg-indigo-50 px-3 py-1.5 rounded-lg transition-colors">
               + Add New
             </button>
           </div>
           <div className="p-6">
              {/* Saved Card */}
              <div className="flex items-center justify-between p-4 border border-slate-200 rounded-xl mb-6">
                 <div className="flex items-center gap-4">
                   <div className="h-10 w-14 bg-slate-900 rounded-lg flex items-center justify-center text-white font-bold text-xs italic tracking-wider">
                     VISA
                   </div>
                   <div>
                     <p className="font-bold text-slate-800 text-sm">Visa ending in 4242</p>
                     <p className="text-xs text-slate-500">Expires 12/28</p>
                   </div>
                 </div>
                 <span className="text-xs font-bold bg-green-50 text-green-700 px-2 py-1 rounded">Default</span>
              </div>

              {/* Billing History */}
              <h4 className="text-xs font-bold text-slate-500 uppercase mb-3">Recent Transactions</h4>
              <div className="space-y-3">
                {[
                  { desc: "Weekly Pass (Oct 22 - Oct 29)", amount: "₹499.00", date: "Oct 22, 2025" },
                  { desc: "Additional Video Request", amount: "₹850.00", date: "Oct 15, 2025" }
                ].map((bill, i) => (
                  <div key={i} className="flex justify-between items-center text-sm py-2 border-b border-slate-50 last:border-0">
                     <div className="flex items-center gap-3">
                       <Clock size={16} className="text-slate-300"/>
                       <span className="text-slate-700">{bill.desc}</span>
                     </div>
                     <div className="text-right">
                       <p className="font-bold text-slate-900">{bill.amount}</p>
                       <p className="text-xs text-slate-400">{bill.date}</p>
                     </div>
                  </div>
                ))}
              </div>
           </div>
        </div>

      </div>
    </div>
  );
}