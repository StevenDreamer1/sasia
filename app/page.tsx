import Navbar from "@/components/Navbar";
import Link from "next/link";
import { 
  Zap, 
  MessageSquare, 
  MonitorPlay, 
  ArrowRight,
  Youtube,
  Instagram,
  Facebook,
  Video,
  Image as ImageIcon,
  Smartphone,
  Mic,
  Check,
  X
} from "lucide-react";

export default function LandingPage() {
  const services = [
    { title: "Video Editing", icon: Video, color: "from-orange-400 to-pink-500" },
    { title: "Thumbnail Design", icon: ImageIcon, color: "from-blue-400 to-cyan-500" },
    { title: "Shorts/Reels", icon: Smartphone, color: "from-purple-400 to-indigo-500" },
    { title: "Audio Mixing", icon: Mic, color: "from-green-400 to-emerald-500" }
  ];

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      {/* --- HERO SECTION --- */}
      <section className="pt-52 pb-20 px-6">
        <div className="max-w-7xl mx-auto text-center">
          
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-indigo-50 border border-indigo-100 text-indigo-700 px-4 py-2 rounded-full text-sm font-bold mb-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-600"></span>
            </span>
            Accepting New Clients for 2026
          </div>
          
          {/* Headline */}
          <h1 className="text-5xl md:text-7xl font-bold text-slate-900 tracking-tight mb-8 max-w-4xl mx-auto leading-tight animate-in fade-in slide-in-from-bottom-8 duration-700">
            Your Creative Team, <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">On Autopilot.</span>
          </h1>
          
          {/* Subheadline */}
          <p className="text-xl text-slate-500 max-w-2xl mx-auto mb-6 leading-relaxed animate-in fade-in slide-in-from-bottom-10 duration-1000">
            Get high-end video editing, graphic design, and audio engineering without the freelance chaos. A dedicated studio dashboard just for creators.
          </p>

          {/* ✨ NEW SLOGAN ADDED HERE ✨ */}
          <p className="text-lg font-bold text-indigo-600 mb-10 animate-in fade-in slide-in-from-bottom-11 duration-1000">
             ✨ Start your work today with just ₹499/week!
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-in fade-in slide-in-from-bottom-12 duration-1000">
            <Link href="/login" className="w-full sm:w-auto px-8 py-4 bg-indigo-600 text-white rounded-xl font-bold text-lg hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-200 flex items-center justify-center gap-2">
               Get Started Now <ArrowRight size={20}/>
            </Link>
            <Link href="#pricing" className="w-full sm:w-auto px-8 py-4 bg-white border border-slate-200 text-slate-700 rounded-xl font-bold text-lg hover:bg-slate-50 transition-all flex items-center justify-center">
               View Pricing
            </Link>
          </div>
          
          {/* Social Proof */}
          <div className="mt-16 flex flex-wrap items-center justify-center gap-8 md:gap-12 opacity-60 grayscale hover:grayscale-0 transition-all duration-500">
             <div className="flex items-center gap-2 group cursor-default">
                <Youtube size={32} className="text-slate-600 group-hover:text-[#FF0000] transition-colors" />
                <span className="font-bold text-xl text-slate-500 group-hover:text-slate-800 transition-colors">YouTube</span>
             </div>
             <div className="flex items-center gap-2 group cursor-default">
                <Instagram size={28} className="text-slate-600 group-hover:text-[#E1306C] transition-colors" />
                <span className="font-bold text-xl text-slate-500 group-hover:text-slate-800 transition-colors">Instagram</span>
             </div>
             <div className="flex items-center gap-2 group cursor-default">
                <Facebook size={28} className="text-slate-600 group-hover:text-[#1877F2] transition-colors" />
                <span className="font-bold text-xl text-slate-500 group-hover:text-slate-800 transition-colors">Facebook</span>
             </div>
             <div className="flex items-center gap-2 group cursor-default">
                <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 text-slate-600 group-hover:text-slate-900 transition-colors">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
                <span className="font-bold text-xl text-slate-500 group-hover:text-slate-800 transition-colors">X</span>
             </div>
          </div>
        </div>
      </section>

      {/* --- HOW IT WORKS --- */}
      <section className="py-24 bg-slate-50" id="features">
        <div className="max-w-7xl mx-auto px-6">
           <div className="text-center mb-16">
             <h2 className="text-3xl font-bold text-slate-900">How Sasia Works</h2>
             <p className="text-slate-500 mt-4">Stop emailing zip files. Start managing projects like a pro.</p>
           </div>
           <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 relative overflow-hidden group hover:border-indigo-200 transition-all">
                 <div className="h-14 w-14 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                   <Zap size={28} />
                 </div>
                 <h3 className="text-xl font-bold text-slate-900 mb-3">1. Submit Request</h3>
                 <p className="text-slate-500 leading-relaxed">Fill out a simple brief, choose your service, and upload your raw files directly to our secure vault.</p>
              </div>
              <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 relative overflow-hidden group hover:border-indigo-200 transition-all">
                 <div className="h-14 w-14 bg-purple-50 text-purple-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                   <MessageSquare size={28} />
                 </div>
                 <h3 className="text-xl font-bold text-slate-900 mb-3">2. Chat with Editors</h3>
                 <p className="text-slate-500 leading-relaxed">Discuss your vision in real-time with your dedicated editor via our built-in studio chat.</p>
              </div>
              <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 relative overflow-hidden group hover:border-indigo-200 transition-all">
                 <div className="h-14 w-14 bg-green-50 text-green-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                   <MonitorPlay size={28} />
                 </div>
                 <h3 className="text-xl font-bold text-slate-900 mb-3">3. Review & Download</h3>
                 <p className="text-slate-500 leading-relaxed">Get notified instantly when your project is ready. Review, approve, and download the final asset.</p>
              </div>
           </div>
        </div>
      </section>

      {/* --- SERVICES GRID --- */}
      <section className="py-24 px-6" id="services">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
            <div>
               <h2 className="text-3xl font-bold text-slate-900">Services We Offer</h2>
               <p className="text-slate-500 mt-2">Everything you need to grow your channel.</p>
            </div>
            <Link href="/login" className="text-indigo-600 font-bold hover:underline flex items-center gap-2">
              See full pricing <ArrowRight size={16}/>
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
             {services.map((service, i) => (
               <div key={i} className="group relative h-64 rounded-2xl overflow-hidden cursor-pointer">
                  <div className="absolute inset-0 bg-slate-900/40 group-hover:bg-slate-900/30 transition-all z-10"></div>
                  <div className={`absolute inset-0 bg-gradient-to-br ${service.color} transition-transform duration-700 group-hover:scale-110`}></div>
                  <div className="absolute bottom-0 left-0 p-6 z-20 w-full">
                     <div className="mb-3 h-12 w-12 bg-white/20 backdrop-blur-md rounded-lg flex items-center justify-center text-white border border-white/10 group-hover:bg-white group-hover:text-slate-900 transition-all duration-300">
                       <service.icon size={24} />
                     </div>
                     <h3 className="text-white font-bold text-xl">{service.title}</h3>
                     <div className="flex items-center gap-2 text-white/80 text-sm mt-2 group-hover:text-white transition-colors">
                       <span>Start Project</span> 
                       <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform"/>
                     </div>
                  </div>
               </div>
             ))}
          </div>
        </div>
      </section>

      {/* --- PRICING SECTION --- */}
      <section className="py-24 bg-slate-50" id="pricing">
        <div className="max-w-7xl mx-auto px-6">
           <div className="text-center mb-16">
             <h2 className="text-3xl font-bold text-slate-900">Simple, Transparent Pricing</h2>
             <p className="text-indigo-600 font-medium mt-4 text-lg">
               "Just start work at ₹499/week and you will access all services."
             </p>
           </div>

           <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
              
              {/* Plan 1: Weekly */}
              <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-200 hover:border-indigo-300 transition-all flex flex-col">
                 <div className="mb-4">
                   <span className="bg-indigo-50 text-indigo-700 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">Starter</span>
                 </div>
                 <h3 className="text-slate-900 font-bold text-lg mb-2">Weekly Pass</h3>
                 <div className="flex items-end gap-1 mb-6">
                   <span className="text-4xl font-bold text-slate-900">₹499</span>
                   <span className="text-slate-500 mb-1">/week</span>
                 </div>
                 <p className="text-slate-500 text-sm mb-6">Perfect for quick projects and testing the waters.</p>
                 
                 <ul className="space-y-3 mb-8 flex-1">
                   {/* Positive Features */}
                   <li className="flex items-center gap-3 text-sm text-slate-700 font-bold">
                     <Check size={16} className="text-indigo-500 shrink-0"/> 1 Video Request / day
                   </li>
                   <li className="flex items-center gap-3 text-sm text-slate-700 font-bold">
                     <Check size={16} className="text-indigo-500 shrink-0"/> 1 Thumbnail Request / day
                   </li>
                   <li className="flex items-center gap-3 text-sm text-slate-600">
                     <Check size={16} className="text-indigo-500 shrink-0"/> 2-3 day turnaround
                   </li>
                   <li className="flex items-center gap-3 text-sm text-slate-600">
                     <Check size={16} className="text-indigo-500 shrink-0"/> Source files included
                   </li>
                   {/* Excluded Features */}
                   <li className="flex items-center gap-3 text-sm text-red-500 font-medium mt-4 pt-4 border-t border-slate-100">
                     <X size={16} className="text-red-500 shrink-0"/> Photography NOT included
                   </li>
                 </ul>
                 
                 <Link href="/login" className="w-full py-3 bg-white border border-slate-200 text-slate-700 font-bold rounded-xl hover:bg-slate-50 transition-colors text-center">
                   Choose Weekly
                 </Link>
              </div>

              {/* Plan 2: Monthly */}
              <div className="bg-slate-900 p-8 rounded-3xl shadow-xl border border-slate-800 relative flex flex-col transform md:-translate-y-4">
                 <div className="absolute top-0 right-0 bg-gradient-to-r from-indigo-500 to-purple-500 text-white text-xs font-bold px-3 py-1 rounded-bl-xl rounded-tr-2xl">
                   MOST POPULAR
                 </div>
                 <div className="mb-4">
                   <span className="bg-slate-800 text-indigo-400 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">Pro</span>
                 </div>
                 <h3 className="text-white font-bold text-lg mb-2">Monthly Pro</h3>
                 <div className="flex items-end gap-1 mb-6">
                   <span className="text-4xl font-bold text-white">₹1,699</span>
                   <span className="text-slate-400 mb-1">/month</span>
                 </div>
                 <p className="text-slate-400 text-sm mb-6">For steady content creators who need consistent output.</p>
                 
                 <ul className="space-y-3 mb-8 flex-1">
                   <li className="flex items-center gap-3 text-sm text-white font-bold">
                     <Check size={16} className="text-indigo-400 shrink-0"/> 2 Video Requests / day
                   </li>
                   <li className="flex items-center gap-3 text-sm text-white font-bold">
                     <Check size={16} className="text-indigo-400 shrink-0"/> 2 Thumbnail Requests / day
                   </li>
                   <li className="flex items-center gap-3 text-sm text-slate-300">
                     <Check size={16} className="text-indigo-400 shrink-0"/> Priority support
                   </li>
                   <li className="flex items-center gap-3 text-sm text-slate-300">
                     <Check size={16} className="text-indigo-400 shrink-0"/> Advanced editing styles
                   </li>
                   {/* Add-on Note */}
                   <li className="flex items-center gap-3 text-sm text-amber-300 font-medium mt-4 pt-4 border-t border-slate-700">
                     <Zap size={16} className="text-amber-300 shrink-0"/> Video Shooting (Extra Cost)
                   </li>
                 </ul>

                 <Link href="/login" className="w-full py-3 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 transition-colors text-center shadow-lg shadow-indigo-900">
                   Get Monthly Access
                 </Link>
              </div>

              {/* Plan 3: Yearly */}
              <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-200 hover:border-indigo-300 transition-all flex flex-col">
                 <div className="mb-4">
                   <span className="bg-green-50 text-green-700 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">Best Value</span>
                 </div>
                 <h3 className="text-slate-900 font-bold text-lg mb-2">Yearly Elite</h3>
                 <div className="flex items-end gap-1 mb-6">
                   <span className="text-4xl font-bold text-slate-900">₹9,999</span>
                   <span className="text-slate-500 mb-1">/year</span>
                 </div>
                 <p className="text-slate-500 text-sm mb-6">Dedicated team for agencies and serious brands.</p>
                 
                 <ul className="space-y-3 mb-8 flex-1">
                   <li className="flex items-center gap-3 text-sm text-slate-700 font-bold">
                     <Check size={16} className="text-indigo-500 shrink-0"/> 2 Video Requests / day
                   </li>
                   <li className="flex items-center gap-3 text-sm text-slate-700 font-bold">
                     <Check size={16} className="text-indigo-500 shrink-0"/> 2 Thumbnail Requests / day
                   </li>
                   <li className="flex items-center gap-3 text-sm text-slate-600">
                     <Check size={16} className="text-indigo-500 shrink-0"/> Dedicated Account Manager
                   </li>
                   <li className="flex items-center gap-3 text-sm text-slate-600">
                     <Check size={16} className="text-indigo-500 shrink-0"/> Same-day rush delivery
                   </li>
                   {/* Add-on Note */}
                   <li className="flex items-center gap-3 text-sm text-amber-600 font-medium mt-4 pt-4 border-t border-slate-100">
                     <Zap size={16} className="text-amber-500 shrink-0"/> Video Shooting (Extra Cost)
                   </li>
                 </ul>

                 <Link href="/login" className="w-full py-3 bg-white border border-slate-200 text-slate-700 font-bold rounded-xl hover:bg-slate-50 transition-colors text-center">
                   Contact Sales
                 </Link>
              </div>
           </div>
        </div>
      </section>

      {/* --- FINAL CTA --- */}
      <section className="py-24 px-6">
        <div className="max-w-5xl mx-auto bg-slate-900 rounded-[2.5rem] p-12 md:p-24 text-center relative overflow-hidden">
           <div className="absolute top-0 left-0 w-full h-full bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20"></div>
           <div className="absolute -top-24 -right-24 w-96 h-96 bg-indigo-500 rounded-full blur-[100px] opacity-50"></div>
           
           <div className="relative z-10">
             <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">Ready to upgrade your content?</h2>
             <p className="text-slate-400 text-lg max-w-2xl mx-auto mb-10">Join 500+ creators who trust Sasia with their post-production. Fast turnaround, secure uploads, and human editors.</p>
             <Link href="/login" className="inline-flex px-10 py-5 bg-white text-slate-900 rounded-2xl font-bold text-lg hover:bg-indigo-50 transition-colors">
               Create Free Account
             </Link>
           </div>
        </div>
      </section>

      {/* --- FOOTER --- */}
      <footer className="py-12 border-t border-slate-100 text-center text-slate-400 text-sm">
         <p>© 2026 Sasia Studio. Built for Creators.</p>
      </footer>

    </div>
  );
}