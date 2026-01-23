"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Header from "@/components/Header";
import { Video, PenTool, Camera, MonitorPlay, ChevronRight, Check, Link as LinkIcon } from "lucide-react";
import FileUpload from "@/components/FileUpload"; 
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

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      // ✅ The API now uses cookies to identify 'userId', so we don't need to send it in the body
      const response = await fetch("/api/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        if (!socket.connected) socket.connect();
        
        // ✅ Standardized socket event for Admin Notification
        socket.emit("new_request_created", { 
          projectName: formData.title,
          client: "Stephen Palepu" // Fallback display name for the notification toast
        });

        router.push("/dashboard");
      } else {
        const err = await response.json();
        alert(err.error || "Failed to submit request.");
      }
    } catch (error) {
      console.error("Submission error:", error);
      alert("A network error occurred.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-slate-50">
      <Header title="Service Request" />
      <div className="flex-1 p-8 max-w-5xl mx-auto w-full">
        {/* Stepper UI */}
        <div className="flex items-center justify-center mb-12">
          {[1, 2, 3].map((s) => (
            <div key={s} className="flex items-center">
              <div className={`h-10 w-10 rounded-full flex items-center justify-center font-bold text-sm transition-all ${step >= s ? "bg-indigo-600 text-white shadow-lg" : "bg-white text-slate-400 border border-slate-200"}`}>
                {step > s ? <Check size={18}/> : s}
              </div>
              {s < 3 && <div className={`w-20 h-1 mx-2 rounded-full ${step > s ? "bg-indigo-600" : "bg-slate-200"}`} />}
            </div>
          ))}
        </div>

        {step === 1 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-in fade-in duration-500">
            {services.map((srv) => (
              <div key={srv.id} onClick={() => setFormData({...formData, service: srv.name})} className={`p-6 rounded-2xl cursor-pointer border-2 transition-all ${formData.service === srv.name ? "border-indigo-600 bg-indigo-50 shadow-md" : "border-white bg-white hover:border-indigo-200 shadow-sm"}`}>
                <div className={`h-12 w-12 rounded-xl flex items-center justify-center mb-4 ${formData.service === srv.name ? "bg-indigo-600 text-white" : "bg-indigo-50 text-indigo-600"}`}><srv.icon size={24} /></div>
                <h3 className="font-bold text-lg text-slate-800">{srv.name}</h3>
                <p className="text-slate-500 text-sm mt-1">{srv.desc}</p>
              </div>
            ))}
          </div>
        )}

        {step === 2 && (
          <div className="bg-white p-8 rounded-2xl border border-slate-100 animate-in slide-in-from-right-8 duration-500">
            <h2 className="text-xl font-bold mb-6">Project Details</h2>
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium mb-2">Project Title</label>
                <input type="text" value={formData.title} onChange={(e) => setFormData({...formData, title: e.target.value})} className="w-full p-3 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-600" placeholder="e.g. Summer Fashion Reel" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Instructions</label>
                <textarea rows={5} value={formData.instructions} onChange={(e) => setFormData({...formData, instructions: e.target.value})} className="w-full p-3 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-600 resize-none" placeholder="Describe your vision..." />
              </div>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="bg-white p-8 rounded-2xl border border-slate-100 animate-in slide-in-from-right-8 duration-500">
            <h2 className="text-xl font-bold mb-2">Upload Raw Files</h2>
            <FileUpload onUploadComplete={(fileName: string) => setFormData(prev => ({...prev, files: [...prev.files, fileName]}))} />
            <div className="relative my-8">
              <div className="absolute inset-0 flex items-center"><span className="w-full border-t border-slate-200"></span></div>
              <div className="relative flex justify-center text-xs uppercase"><span className="bg-white px-2 text-slate-400">Or share a link</span></div>
            </div>
            <div className="flex items-center gap-2 p-3 bg-slate-50 border border-slate-200 rounded-xl">
               <LinkIcon size={18} className="text-slate-400" />
               <input type="text" value={formData.driveLink} onChange={(e) => setFormData({...formData, driveLink: e.target.value})} className="bg-transparent w-full outline-none" placeholder="Google Drive or Dropbox Link..." />
            </div>
          </div>
        )}

        <div className="flex justify-between mt-8">
          {step > 1 && <button onClick={() => setStep(s => s - 1)} disabled={isSubmitting} className="px-6 py-3 text-slate-600 font-medium hover:bg-slate-100 rounded-xl transition-colors">Back</button>}
          <button onClick={step === 3 ? handleSubmit : () => setStep(s => s + 1)} disabled={(step === 1 && !formData.service) || isSubmitting} className={`ml-auto px-8 py-3 rounded-xl font-bold text-white transition-all shadow-lg ${ (step === 1 && !formData.service) || isSubmitting ? "bg-slate-300 cursor-not-allowed" : "bg-indigo-600 hover:bg-indigo-700 active:scale-95" }`}>
            {isSubmitting ? "Processing..." : step === 3 ? "Submit Request" : "Next Step"}
          </button>
        </div>
      </div>
    </div>
  );
}