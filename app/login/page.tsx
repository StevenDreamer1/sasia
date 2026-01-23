"use client";

import { useState } from "react";
import { signIn, getSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Loader2, ArrowRight, Sparkles, Mail, Lock, KeyRound } from "lucide-react";
import { toast, Toaster } from "react-hot-toast";

// Google Icon Component
const GoogleIcon = () => (
  <svg className="h-5 w-5" viewBox="0 0 24 24">
    <path
      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
      fill="#4285F4"
    />
    <path
      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
      fill="#34A853"
    />
    <path
      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
      fill="#FBBC05"
    />
    <path
      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
      fill="#EA4335"
    />
  </svg>
);

export default function LoginPage() {
  const router = useRouter();
  const [authMethod, setAuthMethod] = useState<"password" | "otp">("password");
  const [otpStep, setOtpStep] = useState<"email" | "verify">("email");
  const [loading, setLoading] = useState(false);
  
  // Form Data
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");

  // 1. Handle Google Login
  const handleGoogleLogin = async () => {
    setLoading(true);
    await signIn("google", { callbackUrl: "/dashboard" });
  };

  // 2. Send OTP Code
  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("/api/auth/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      if (res.ok) {
        toast.success(`Code sent to ${email}`);
        setOtpStep("verify");
      } else {
        toast.error("Failed to send code. Try again.");
      }
    } catch (err) {
      toast.error("Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  // 3. Verify OTP & Login
  const handleOtpLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const res = await signIn("credentials", {
      email,
      otp,
      redirect: false,
    });

    if (res?.error) {
      toast.error("Invalid Code. Please try again.");
      setLoading(false);
    } else {
      toast.success("Login Successful!");
      router.push("/dashboard");
    }
  };

  // 4. Standard Password Login
  const handlePasswordLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const res = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    if (res?.error) {
      toast.error("Invalid Email or Password");
      setLoading(false);
    } else {
      // Check role to redirect correctly
      const session = await getSession();
      if (session?.user?.role === "admin") {
        router.push("/admin/dashboard");
      } else {
        router.push("/dashboard");
      }
      toast.success("Welcome back!");
    }
  };

  return (
    <div className="flex min-h-screen bg-white font-sans">
      <Toaster position="top-center" />
      
      {/* LEFT SIDE: Visuals */}
      <div className="hidden lg:flex w-1/2 bg-[#0F172A] relative overflow-hidden items-center justify-center p-12">
         <div className="absolute top-0 left-0 w-full h-full opacity-10">
            <div className="absolute top-10 left-10 w-64 h-64 bg-indigo-500 rounded-full blur-[100px]"></div>
            <div className="absolute bottom-10 right-10 w-96 h-96 bg-purple-500 rounded-full blur-[120px]"></div>
         </div>
         
         <div className="relative z-10 text-white max-w-lg">
            <div className="h-16 w-16 bg-indigo-600 rounded-2xl flex items-center justify-center mb-8 shadow-2xl shadow-indigo-900/50">
               <Sparkles size={32} />
            </div>
            <h1 className="text-5xl font-black tracking-tight mb-6 leading-tight">
               Your creative journey starts here.
            </h1>
            <p className="text-slate-400 text-lg leading-relaxed">
               Access your dashboard, manage projects, and chat with support securely.
            </p>
         </div>
      </div>

      {/* RIGHT SIDE: Form */}
      <div className="flex-1 flex items-center justify-center p-8 bg-slate-50 lg:bg-white">
        <div className="w-full max-w-md space-y-8">
          
          <div className="text-center lg:text-left">
            <h2 className="text-3xl font-black text-slate-900 tracking-tight">Welcome Back</h2>
            <p className="text-slate-500 mt-2">Login to manage your SaSia account.</p>
          </div>

          {/* GOOGLE LOGIN BUTTON */}
          <button 
            onClick={handleGoogleLogin}
            disabled={loading}
            className="w-full flex items-center justify-center gap-3 bg-white border border-slate-200 p-4 rounded-xl text-slate-700 font-bold hover:bg-slate-50 hover:border-slate-300 transition-all shadow-sm active:scale-95"
          >
            {loading ? <Loader2 className="animate-spin" size={20} /> : <GoogleIcon />}
            <span>Sign in with Google</span>
          </button>

          <div className="relative flex items-center py-2">
            <div className="flex-grow border-t border-slate-200"></div>
            <span className="flex-shrink-0 mx-4 text-slate-400 text-xs font-bold uppercase tracking-wider">Or continue with</span>
            <div className="flex-grow border-t border-slate-200"></div>
          </div>

          {/* TABS: Password vs OTP */}
          <div className="flex bg-slate-100 p-1 rounded-xl">
             <button 
               onClick={() => setAuthMethod("password")}
               className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all ${authMethod === "password" ? "bg-white text-slate-800 shadow-sm" : "text-slate-500 hover:text-slate-700"}`}
             >
               Password
             </button>
             <button 
               onClick={() => setAuthMethod("otp")}
               className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all ${authMethod === "otp" ? "bg-white text-slate-800 shadow-sm" : "text-slate-500 hover:text-slate-700"}`}
             >
               Magic Code (OTP)
             </button>
          </div>

          {/* --- PASSWORD FORM --- */}
          {authMethod === "password" && (
            <form onSubmit={handlePasswordLogin} className="space-y-5 animate-in fade-in slide-in-from-bottom-4 duration-300">
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 uppercase">Email Address</label>
                <div className="relative">
                  <Mail size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="email"
                    required
                    placeholder="name@company.com"
                    className="w-full pl-11 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-600 focus:bg-white outline-none font-medium transition-all"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                   <label className="text-xs font-bold text-slate-500 uppercase">Password</label>
                   <a href="#" className="text-xs font-bold text-indigo-600 hover:underline">Forgot?</a>
                </div>
                <div className="relative">
                  <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="password"
                    required
                    placeholder="••••••••"
                    className="w-full pl-11 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-600 focus:bg-white outline-none font-medium transition-all"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
              </div>

              <button
                disabled={loading}
                className="w-full py-4 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-200 flex items-center justify-center gap-2 active:scale-95 text-sm"
              >
                {loading ? <Loader2 className="animate-spin" /> : "Sign In with Password"} 
              </button>
            </form>
          )}

          {/* --- OTP FORM --- */}
          {authMethod === "otp" && (
            <div className="space-y-5 animate-in fade-in slide-in-from-bottom-4 duration-300">
              {otpStep === "email" ? (
                <form onSubmit={handleSendOtp} className="space-y-5">
                   <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-500 uppercase">Email Address</label>
                    <div className="relative">
                      <Mail size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                      <input
                        type="email"
                        required
                        placeholder="name@company.com"
                        className="w-full pl-11 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-600 focus:bg-white outline-none font-medium transition-all"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                      />
                    </div>
                  </div>
                  <button
                    disabled={loading}
                    className="w-full py-4 bg-slate-900 text-white font-bold rounded-xl hover:bg-slate-800 transition-all shadow-lg shadow-slate-200 flex items-center justify-center gap-2 active:scale-95 text-sm"
                  >
                    {loading ? <Loader2 className="animate-spin" /> : "Send Login Code"} 
                  </button>
                </form>
              ) : (
                <form onSubmit={handleOtpLogin} className="space-y-5">
                   <div className="p-4 bg-indigo-50 rounded-xl border border-indigo-100 mb-4">
                      <p className="text-sm text-indigo-900 text-center font-medium">
                        We sent a code to <span className="font-bold">{email}</span>
                      </p>
                      <button 
                        type="button" 
                        onClick={() => setOtpStep("email")} 
                        className="block w-full text-center text-xs text-indigo-600 font-bold mt-2 hover:underline"
                      >
                        Change Email
                      </button>
                   </div>

                   <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-500 uppercase">Verification Code</label>
                    <div className="relative">
                      <KeyRound size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                      <input
                        type="text"
                        required
                        placeholder="123456"
                        maxLength={6}
                        className="w-full pl-11 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-600 focus:bg-white outline-none font-bold tracking-widest text-lg transition-all"
                        value={otp}
                        onChange={(e) => setOtp(e.target.value)}
                      />
                    </div>
                  </div>
                  <button
                    disabled={loading}
                    className="w-full py-4 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-200 flex items-center justify-center gap-2 active:scale-95 text-sm"
                  >
                    {loading ? <Loader2 className="animate-spin" /> : "Verify & Login"} 
                  </button>
                </form>
              )}
            </div>
          )}

          <div className="pt-6 border-t border-slate-100 text-center">
            <p className="text-slate-500 text-sm">
              Don't have an account? 
              <Link href="/register" className="ml-2 text-indigo-600 font-black hover:underline">
                 Create one
              </Link>
            </p>
          </div>

        </div>
      </div>
    </div>
  );
}