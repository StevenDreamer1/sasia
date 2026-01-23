"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { User, Shield, Save, Loader2, Phone, Mail } from "lucide-react";
import { toast } from "react-hot-toast";

export default function SettingsPage() {
  const { data: session } = useSession();
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("profile");
  
  // Form State
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    currentPassword: "",
    newPassword: ""
  });

  // Load existing data when session is ready
  useEffect(() => {
    if (session?.user) {
      setFormData(prev => ({
        ...prev,
        name: session.user.name || "",
        // Note: Phone isn't usually in the session default, 
        // in a real app you might fetch the latest profile data from an API here
      }));
    }
  }, [session]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/user/update", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.error);

      toast.success("Profile updated successfully!");
      setFormData(prev => ({ ...prev, currentPassword: "", newPassword: "" })); // Clear passwords
    } catch (error: any) {
      toast.error(error.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8 max-w-5xl mx-auto space-y-8 font-sans animate-in fade-in duration-500">
      
      {/* Header */}
      <div>
        <h1 className="text-3xl font-black text-slate-900 tracking-tight">Account Settings</h1>
        <p className="text-slate-500 mt-2">Manage your profile and security.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        
        {/* Settings Sidebar */}
        <div className="space-y-2">
           <button 
             onClick={() => setActiveTab("profile")}
             className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-sm transition-all ${activeTab === "profile" ? "bg-indigo-600 text-white shadow-lg shadow-indigo-200" : "bg-white text-slate-600 hover:bg-slate-50 border border-slate-100"}`}
           >
             <User size={18} /> Profile
           </button>
           <button 
             onClick={() => setActiveTab("security")}
             className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-sm transition-all ${activeTab === "security" ? "bg-indigo-600 text-white shadow-lg shadow-indigo-200" : "bg-white text-slate-600 hover:bg-slate-50 border border-slate-100"}`}
           >
             <Shield size={18} /> Security
           </button>
        </div>

        {/* Content Area */}
        <div className="md:col-span-3 space-y-6">
           
           {/* PROFILE TAB */}
           {activeTab === "profile" && (
             <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm">
                <h2 className="text-xl font-bold text-slate-800 mb-6">Personal Information</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-500 uppercase">Full Name</label>
                    <div className="relative">
                        <User className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                        <input name="name" value={formData.name} onChange={handleChange} type="text" className="w-full pl-10 p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none font-medium text-slate-700" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-500 uppercase">Email Address</label>
                    <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                        <input type="email" value={session?.user?.email || ""} disabled className="w-full pl-10 p-3 bg-slate-100 border border-slate-200 rounded-xl text-slate-500 font-medium cursor-not-allowed" />
                    </div>
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <label className="text-xs font-bold text-slate-500 uppercase">Phone Number</label>
                    <div className="relative">
                        <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                        <input name="phone" value={formData.phone} onChange={handleChange} type="tel" placeholder="+91 00000 00000" className="w-full pl-10 p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none font-medium text-slate-700" />
                    </div>
                  </div>
                </div>
                <div className="mt-8 flex justify-end">
                  <button onClick={handleSave} disabled={loading} className="bg-indigo-600 text-white px-6 py-3 rounded-xl font-bold text-sm shadow-lg shadow-indigo-200 hover:bg-indigo-700 transition-all active:scale-95 flex items-center gap-2">
                    {loading ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />}
                    {loading ? "Saving..." : "Save Changes"}
                  </button>
                </div>
             </div>
           )}

           {/* SECURITY TAB */}
           {activeTab === "security" && (
             <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm">
                <h2 className="text-xl font-bold text-slate-800 mb-6">Change Password</h2>
                <div className="space-y-4 max-w-md">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-500 uppercase">Current Password</label>
                    <input name="currentPassword" value={formData.currentPassword} onChange={handleChange} type="password" placeholder="••••••••" className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none font-medium" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-500 uppercase">New Password</label>
                    <input name="newPassword" value={formData.newPassword} onChange={handleChange} type="password" placeholder="••••••••" className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none font-medium" />
                  </div>
                  <div className="pt-4">
                    <button onClick={handleSave} disabled={loading} className="bg-slate-900 text-white px-6 py-3 rounded-xl font-bold text-sm hover:bg-slate-800 transition-colors w-full shadow-lg shadow-slate-200 flex justify-center items-center gap-2">
                       {loading ? <Loader2 className="animate-spin" size={18} /> : "Update Password"}
                    </button>
                  </div>
                </div>
             </div>
           )}

        </div>
      </div>
    </div>
  );
}