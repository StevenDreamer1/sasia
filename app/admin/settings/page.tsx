"use client";

import { useState } from "react";
import { 
  Shield, Bell, Lock, Globe, Database, 
  ToggleLeft, ToggleRight, Save, UserX, Search, AlertTriangle, 
  Ban, CheckCircle, StopCircle
} from "lucide-react";

export default function AdminSettings() {
  // 1. GLOBAL SYSTEM SETTINGS
  const [system, setSystem] = useState({
    maintenanceMode: false,      // Kicks everyone out
    pauseNewOrders: false,       // Users can login but can't buy
    allowRegistration: true,     // New users can join
    twoFactorAdmin: true         // Security
  });

  // 2. USER MANAGEMENT (Mock Database)
  const [searchEmail, setSearchEmail] = useState("");
  const [foundUser, setFoundUser] = useState<any>(null);
  const [users, setUsers] = useState([
    { id: 1, name: "Stephen Palepu", email: "stephen@sasia.com", status: "Active", role: "User" },
    { id: 2, name: "Sarah Connor", email: "sarah@skynet.com", status: "Active", role: "User" },
    { id: 3, name: "Mike Ross", email: "mike@suits.com", status: "Blocked", role: "User" }, // Example blocked user
  ]);

  // 3. GLOBAL ANNOUNCEMENT
  const [announcement, setAnnouncement] = useState("");

  // TOGGLE FUNCTION
  const toggleSystem = (key: keyof typeof system) => {
    setSystem(prev => ({ ...prev, [key]: !prev[key] }));
  };

  // SEARCH USER FUNCTION
  const handleSearchUser = () => {
    const user = users.find(u => u.email.toLowerCase() === searchEmail.toLowerCase());
    setFoundUser(user || "not-found");
  };

  // BLOCK/UNBLOCK FUNCTION
  const toggleBlockUser = (id: number) => {
    setUsers(users.map(u => {
      if (u.id === id) {
        // Toggle status
        const newStatus = u.status === "Blocked" ? "Active" : "Blocked";
        // Update the 'foundUser' view as well so it reflects instantly
        if (foundUser && foundUser.id === id) {
           setFoundUser({ ...u, status: newStatus });
        }
        return { ...u, status: newStatus };
      }
      return u;
    }));
  };

  return (
    <div className="p-8 min-h-screen bg-slate-50 animate-in fade-in duration-500">
      
      <div className="max-w-5xl mx-auto space-y-8">
        
        <div className="flex justify-between items-center">
          <div>
             <h1 className="text-3xl font-bold text-slate-900">Control Panel</h1>
             <p className="text-slate-500 mt-1">Full administrative control over platform access and users.</p>
          </div>
          <button className="flex items-center gap-2 bg-slate-900 text-white px-6 py-3 rounded-xl font-bold hover:bg-slate-800 shadow-lg transition-transform active:scale-95">
             <Save size={20} /> Save All Changes
          </button>
        </div>

        {/* 1. EMERGENCY CONTROLS (KILL SWITCHES) */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="p-6 border-b border-slate-100 bg-red-50/50 flex items-center gap-3">
             <AlertTriangle className="text-red-600" size={24} />
             <h2 className="font-bold text-lg text-slate-800">Danger Zone & Access Control</h2>
          </div>
          
          <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Maintenance Mode */}
            <div className="flex items-start justify-between p-4 border border-slate-100 rounded-xl bg-slate-50">
              <div>
                <h3 className="font-bold text-slate-900 flex items-center gap-2">
                  Maintenance Mode
                  {system.maintenanceMode && <span className="text-[10px] bg-red-600 text-white px-2 py-0.5 rounded-full uppercase">Active</span>}
                </h3>
                <p className="text-sm text-slate-500 mt-1">Shut down the site. Only Admins can login.</p>
              </div>
              <button onClick={() => toggleSystem("maintenanceMode")} className={`text-4xl transition-colors ${system.maintenanceMode ? "text-red-600" : "text-slate-300"}`}>
                {system.maintenanceMode ? <ToggleRight /> : <ToggleLeft />}
              </button>
            </div>

            {/* Pause Orders */}
            <div className="flex items-start justify-between p-4 border border-slate-100 rounded-xl bg-slate-50">
              <div>
                <h3 className="font-bold text-slate-900 flex items-center gap-2">
                   Stop New Requests
                   {system.pauseNewOrders && <span className="text-[10px] bg-amber-500 text-white px-2 py-0.5 rounded-full uppercase">Paused</span>}
                </h3>
                <p className="text-sm text-slate-500 mt-1">Hide the "New Project" button for all users.</p>
              </div>
              <button onClick={() => toggleSystem("pauseNewOrders")} className={`text-4xl transition-colors ${system.pauseNewOrders ? "text-amber-500" : "text-slate-300"}`}>
                {system.pauseNewOrders ? <ToggleRight /> : <ToggleLeft />}
              </button>
            </div>
            
             {/* Registration */}
             <div className="flex items-start justify-between p-4 border border-slate-100 rounded-xl bg-slate-50">
              <div>
                <h3 className="font-bold text-slate-900">Allow Registration</h3>
                <p className="text-sm text-slate-500 mt-1">If off, new users cannot create accounts.</p>
              </div>
              <button onClick={() => toggleSystem("allowRegistration")} className={`text-4xl transition-colors ${system.allowRegistration ? "text-indigo-600" : "text-slate-300"}`}>
                {system.allowRegistration ? <ToggleRight /> : <ToggleLeft />}
              </button>
            </div>
          </div>
        </div>

        {/* 2. USER MANAGEMENT (BLOCK/BAN) */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="p-6 border-b border-slate-100 bg-slate-50/50 flex items-center gap-3">
             <UserX className="text-indigo-600" size={24} />
             <h2 className="font-bold text-lg text-slate-800">User Management & Bans</h2>
          </div>
          
          <div className="p-6">
            <div className="flex gap-4 mb-6">
              <div className="relative flex-1">
                <Search className="absolute left-4 top-3.5 text-slate-400" size={20} />
                <input 
                  type="text" 
                  placeholder="Enter user email to manage access..." 
                  className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                  value={searchEmail}
                  onChange={(e) => setSearchEmail(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && handleSearchUser()}
                />
              </div>
              <button 
                onClick={handleSearchUser}
                className="px-6 py-3 bg-white border border-slate-200 font-bold text-slate-700 rounded-xl hover:bg-slate-50"
              >
                Search User
              </button>
            </div>

            {/* SEARCH RESULTS */}
            {foundUser === "not-found" && (
              <div className="p-4 bg-slate-100 rounded-xl text-center text-slate-500 text-sm">
                No user found with that email.
              </div>
            )}

            {foundUser && foundUser !== "not-found" && (
              <div className={`p-6 rounded-2xl border-2 transition-all ${foundUser.status === "Blocked" ? "border-red-100 bg-red-50" : "border-green-100 bg-green-50"}`}>
                 <div className="flex justify-between items-center">
                    <div className="flex items-center gap-4">
                       <div className={`h-12 w-12 rounded-full flex items-center justify-center font-bold text-lg ${foundUser.status === "Blocked" ? "bg-red-200 text-red-700" : "bg-green-200 text-green-700"}`}>
                         {foundUser.name.charAt(0)}
                       </div>
                       <div>
                         <h3 className="font-bold text-slate-900 text-lg">{foundUser.name}</h3>
                         <p className="text-slate-600">{foundUser.email}</p>
                         <div className="flex items-center gap-2 mt-1">
                            <span className={`text-xs font-bold px-2 py-0.5 rounded-full uppercase ${foundUser.status === "Blocked" ? "bg-red-200 text-red-800" : "bg-green-200 text-green-800"}`}>
                              {foundUser.status}
                            </span>
                            <span className="text-xs text-slate-500">• Role: {foundUser.role}</span>
                         </div>
                       </div>
                    </div>

                    <button 
                      onClick={() => toggleBlockUser(foundUser.id)}
                      className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold shadow-sm transition-all active:scale-95 ${
                        foundUser.status === "Blocked" 
                          ? "bg-white text-green-600 hover:bg-green-50 border border-green-200" 
                          : "bg-red-600 text-white hover:bg-red-700 shadow-red-200"
                      }`}
                    >
                      {foundUser.status === "Blocked" ? <><CheckCircle size={18}/> Unblock User</> : <><Ban size={18}/> Block Access</>}
                    </button>
                 </div>
              </div>
            )}
          </div>
        </div>

        {/* 3. GLOBAL ANNOUNCEMENTS */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="p-6 border-b border-slate-100 bg-slate-50/50 flex items-center gap-3">
             <Bell className="text-indigo-600" size={24} />
             <h2 className="font-bold text-lg text-slate-800">Global Announcements</h2>
          </div>
          <div className="p-6">
             <label className="text-sm font-bold text-slate-700 mb-2 block">Site-wide Banner Message</label>
             <div className="flex gap-4">
               <input 
                 type="text" 
                 placeholder="e.g. 'We are experiencing high volume. Response times may be delayed.'"
                 className="flex-1 px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
                 value={announcement}
                 onChange={(e) => setAnnouncement(e.target.value)}
               />
               <button className="px-6 py-3 bg-white border border-slate-200 font-bold text-slate-700 rounded-xl hover:bg-slate-50">
                 Post
               </button>
             </div>
             <p className="text-xs text-slate-400 mt-2">This message will appear at the top of every user's dashboard.</p>
          </div>
        </div>

      </div>
    </div>
  );
}