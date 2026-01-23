"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Header from "@/components/Header";
import { Video, PenTool, Camera, MonitorPlay, ChevronRight, Check, Link as LinkIcon } from "lucide-react";
import FileUpload from "@/components/FileUpload"; 
// 1. Import socket instance
import { socket } from "@/lib/socket";

const services = [
  { id: "video-edit", name: "Video Editing", icon: Video, desc: "Reels, YouTube, Ads" },
  { id: "gfx", name: "Graphic Design", icon: PenTool, desc: "Thumbnails, Branding" },
  { id: "photo", name: "Photography", icon: Camera, desc: "Product & Event Shoots" },
  { id: "tech", name: "Tech Support", icon: MonitorPlay, desc: "Web & App Fixes" },
];

export default function ServiceRequest() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    service: "",
    title: "",
    instructions: "",
    driveLink: "",
    files: [] as string[]
  });

  const handleNext = () => setStep((prev) => prev + 1);
  const handleBack = () => setStep((prev) => prev - 1);

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      // Send data to our new API
      const response = await fetch("/api/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        // 2. CONNECT & EMIT THE ALERT
        if (!socket.connected) socket.connect();
        
        // Emit the event so Admins get notified immediately
        socket.emit("project_created", { 
          title: formData.title,
          user: "Client" // Replace with actual user name/email if you have auth
        });

        // Redirect to projects list on success
        router.push("/projects");
      } else {
        alert("Failed to create project. Please try again.");
        setIsSubmitting(false);
      }
    } catch (error) {
      console.error("Error:", error);
      alert("An error occurred.");
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-slate-50">
      <Header title="Service Request" />

      <div className="flex-1 p-8 max-w-5xl mx-auto w-full">
        
        {/* Progress Bar */}
        <div className="flex items-center justify-center mb-12">
          {[1, 2, 3].map((s) => (
            <div key={s} className="flex items-center">
              <div className={`h-10 w-10 rounded-full flex items-center justify-center font-bold text-sm transition-all ${
                step >= s ? "bg-indigo-600 text-white shadow-lg shadow-indigo-200" : "bg-white text-slate-400 border border-slate-200"
              }`}>
                {step > s ? <Check size={18}/> : s}
              </div>
              {s < 3 && <div className={`w-20 h-1 mx-2 rounded-full ${step > s ? "bg-indigo-600" : "bg-slate-200"}`} />}
            </div>
          ))}
        </div>

        {/* STEP 1: Selection */}
        {step === 1 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {services.map((srv) => (
              <div 
                key={srv.id}
                onClick={() => setFormData({...formData, service: srv.name})}
                className={`p-6 rounded-2xl cursor-pointer border-2 transition-all hover:scale-[1.02] ${
                  formData.service === srv.name 
                  ? "border-indigo-600 bg-indigo-50 shadow-md" 
                  : "border-white bg-white hover:border-indigo-200 shadow-sm"
                }`}
              >
                <div className={`h-12 w-12 rounded-xl flex items-center justify-center mb-4 ${
                  formData.service === srv.name ? "bg-indigo-600 text-white" : "bg-indigo-50 text-indigo-600"
                }`}>
                  <srv.icon size={24} />
                </div>
                <h3 className="font-bold text-lg text-slate-800">{srv.name}</h3>
                <p className="text-slate-500 text-sm mt-1">{srv.desc}</p>
              </div>
            ))}
          </div>
        )}

        {/* STEP 2: Details */}
        {step === 2 && (
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 animate-in fade-in slide-in-from-right-8 duration-500">
            <h2 className="text-xl font-bold text-slate-800 mb-6">Tell us about your {formData.service} project</h2>
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Project Title</label>
                <input 
                  type="text" 
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                  className="w-full p-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
                  placeholder="e.g. Summer Fashion Reel"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Instructions</label>
                <textarea 
                  rows={5}
                  value={formData.instructions}
                  onChange={(e) => setFormData({...formData, instructions: e.target.value})}
                  className="w-full p-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none resize-none"
                  placeholder="Describe your vision..."
                />
              </div>
            </div>
          </div>
        )}

        {/* STEP 3: Uploads & Links */}
        {step === 3 && (
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 animate-in fade-in slide-in-from-right-8 duration-500">
             <h2 className="text-xl font-bold text-slate-800 mb-2">Upload Raw Files</h2>
             <p className="text-slate-500 text-sm mb-6">Drag and drop your footage here.</p>
             
             {/* 1. Drag & Drop Zone */}
             <FileUpload onUploadComplete={(fileName: string) => {
               setFormData(prev => ({...prev, files: [...prev.files, fileName]}))
             }} />

             {/* File List */}
             {formData.files.length > 0 && (
               <div className="mt-4 flex flex-wrap gap-2">
                 {formData.files.map((f, i) => (
                   <div key={i} className="flex items-center gap-2 text-xs text-indigo-700 bg-indigo-50 px-3 py-1.5 rounded-full border border-indigo-100">
                     <Check size={12} /> {f}
                   </div>
                 ))}
               </div>
             )}

             {/* Divider */}
             <div className="relative my-8">
               <div className="absolute inset-0 flex items-center"><span className="w-full border-t border-slate-200"></span></div>
               <div className="relative flex justify-center text-xs uppercase"><span className="bg-white px-2 text-slate-400">Or share a link</span></div>
             </div>

             {/* 2. Google Drive Link Input */}
             <div>
               <label className="block text-sm font-medium text-slate-700 mb-2 flex items-center gap-2">
                  <LinkIcon size={16} /> Google Drive / Dropbox Link
               </label>
               <input 
                 type="text" 
                 value={formData.driveLink}
                 onChange={(e) => setFormData({...formData, driveLink: e.target.value})}
                 className="w-full p-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none bg-slate-50 placeholder:text-slate-400"
                 placeholder="https://drive.google.com/drive/folders/..."
               />
               <p className="text-[11px] text-slate-400 mt-2">
                   Use this for files larger than 2GB. Make sure the link permission is set to "Anyone with the link".
               </p>
             </div>
          </div>
        )}

        {/* Navigation Buttons */}
        <div className="flex justify-between mt-8">
          {step > 1 ? (
            <button onClick={handleBack} disabled={isSubmitting} className="px-6 py-3 rounded-xl font-medium text-slate-600 hover:bg-slate-100 disabled:opacity-50">Back</button>
          ) : <div></div>}

          <button 
            onClick={step === 3 ? handleSubmit : handleNext}
            disabled={(step === 1 && !formData.service) || isSubmitting}
            className={`flex items-center gap-2 px-8 py-3 rounded-xl font-bold text-white transition-all shadow-lg ${
              (step === 1 && !formData.service) || isSubmitting ? "bg-slate-300 cursor-not-allowed" : "bg-indigo-600 hover:bg-indigo-700"
            }`}
          >
            {isSubmitting ? "Saving..." : step === 3 ? "Submit Request" : "Next Step"}
            {!isSubmitting && step < 3 && <ChevronRight size={18} />}
          </button>
        </div>

      </div>
    </div>
  );
}