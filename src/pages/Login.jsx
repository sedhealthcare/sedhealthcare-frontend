import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useAuth } from "../context/AuthContext";
import { useNotify } from "../context/NotificationContext";
import { Heart, Phone, ShieldCheck, Sparkles } from "lucide-react";

export default function Login() {
  const [step, setStep] = useState(1);
  const [mobile, setMobile] = useState("");
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [focused, setFocused] = useState(false);
  const { sendOtp, verifyOtp, user, role } = useAuth();
  const { notify } = useNotify();
  const nav = useNavigate();

  // Redirect if already logged in
  useEffect(() => {
    if (user && role === "admin") nav("/admin", { replace: true });
    else if (user && role === "user") nav("/dashboard", { replace: true });
  }, [user, role, nav]);

  const handleSend = async () => {
    if (mobile.length < 10) return notify("Enter valid 10-digit mobile", "error");
    setLoading(true);
    try {
      await sendOtp(mobile);
      notify("OTP sent! Use 123456");
      setStep(2);
    } catch (e) { notify(e.response?.data?.message || "Failed", "error"); }
    setLoading(false);
  };

  const handleVerify = async () => {
    setLoading(true);
    try {
      await verifyOtp(mobile, otp);
      notify("Welcome to SedHealthcare");
      nav("/dashboard");
    } catch (e) { notify(e.response?.data?.message || "Invalid OTP", "error"); }
    setLoading(false);
  };

  return (
    <div className="min-h-screen relative overflow-hidden flex items-center justify-center p-4"
      style={{ background: "linear-gradient(135deg, #dbeafe 0%, #bae6fd 30%, #c7d2fe 65%, #e0e7ff 100%)" }}>

      <div className="absolute -top-40 -right-40 w-[600px] h-[600px] rounded-full opacity-60 pointer-events-none"
        style={{ background: "radial-gradient(circle, #3b82f6 0%, #06b6d4 40%, transparent 70%)", filter: "blur(90px)" }} />
      <div className="absolute -bottom-32 -left-32 w-[480px] h-[480px] rounded-full opacity-55 pointer-events-none"
        style={{ background: "radial-gradient(circle, #6366f1 0%, #8b5cf6 50%, transparent 70%)", filter: "blur(80px)" }} />
      <div className="absolute top-1/4 left-1/3 w-72 h-72 rounded-full opacity-40 pointer-events-none animate-pulse"
        style={{ background: "radial-gradient(circle, #0ea5e9 0%, transparent 70%)", filter: "blur(60px)", animationDuration: "5s" }} />
      <div className="absolute inset-0 opacity-[0.06] pointer-events-none"
        style={{ backgroundImage: "radial-gradient(circle, #1e3a8a 1.5px, transparent 1.5px)", backgroundSize: "32px 32px" }} />

      <motion.div initial={{ opacity: 0, y: 30, scale: 0.96 }} animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }} whileHover={{ y: -4 }}
        className="relative w-full max-w-md group" style={{ transition: "all 0.3s ease" }}>
        <div className="relative p-8 sm:p-10 rounded-3xl backdrop-blur-2xl border-2 border-white/80 group-hover:shadow-2xl"
          style={{
            background: "rgba(255, 255, 255, 0.85)",
            boxShadow: "0 30px 80px -15px rgba(30, 64, 175, 0.3), 0 10px 30px -8px rgba(99, 102, 241, 0.2)",
            transition: "all 0.3s ease",
          }}>
          <div className="flex justify-center mb-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 border border-emerald-200 text-emerald-800 text-[10px] font-bold uppercase tracking-wider">
              <Sparkles size={10} /> Trusted Healthcare Platform
            </div>
          </div>

          <div className="flex justify-center mb-5 mt-3">
            <motion.div whileHover={{ rotate: 8, scale: 1.05 }} transition={{ type: "spring", stiffness: 300 }} className="relative">
              <div className="absolute inset-0 rounded-2xl blur-lg opacity-70"
                style={{ background: "linear-gradient(135deg, #2563eb, #06b6d4)" }} />
              <div className="relative p-4 rounded-2xl shadow-xl"
                style={{ background: "linear-gradient(135deg, #1d4ed8 0%, #0891b2 100%)" }}>
                <Heart size={30} fill="white" className="text-white" strokeWidth={2.5} />
              </div>
            </motion.div>
          </div>

          <h1 className="text-3xl font-bold text-center text-slate-900 tracking-tight">
            Sed<span className="text-primary-600">Healthcare</span>
          </h1>
          <p className="text-center text-sm text-slate-600 mt-1.5 mb-7">
            {step === 1 ? "Sign in to access your health dashboard" : "We've sent a code to your mobile"}
          </p>

          {step === 1 ? (
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.4 }}>
              <label className="text-xs font-bold text-slate-700 flex items-center gap-2 mb-2 uppercase tracking-wide">
                <Phone size={12} className="text-primary-600" /> Mobile Number
              </label>
              <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600 font-semibold text-sm border-r border-slate-300 pr-3">+91</div>
                <input type="tel" maxLength={10} value={mobile}
                  onChange={(e) => setMobile(e.target.value.replace(/\D/g, ""))}
                  onFocus={() => setFocused(true)} onBlur={() => setFocused(false)}
                  placeholder="9876543210"
                  className={`w-full bg-white border-2 rounded-xl pl-16 pr-4 py-3.5 outline-none text-slate-900 font-medium ${
                    focused ? "border-primary-500 shadow-lg shadow-primary-200 scale-[1.01]" : "border-slate-200"
                  }`} style={{ transition: "all 0.3s ease" }} />
              </div>

              <motion.button whileTap={{ scale: 0.97 }} whileHover={{ y: -2 }}
                disabled={loading} onClick={handleSend}
                className="w-full mt-5 py-3.5 rounded-xl font-bold text-white text-sm disabled:opacity-60"
                style={{
                  background: "linear-gradient(135deg, #1d4ed8 0%, #0891b2 100%)",
                  boxShadow: "0 10px 25px -5px rgba(29, 78, 216, 0.5)",
                  transition: "all 0.3s ease",
                }}>
                {loading ? "Sending OTP..." : "Send OTP"}
              </motion.button>

              <div className="flex items-center gap-3 my-5">
                <div className="flex-1 h-px bg-slate-300" />
                <span className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold">Secured by</span>
                <div className="flex-1 h-px bg-slate-300" />
              </div>
              <div className="flex items-center justify-center gap-4 text-[10px] text-slate-600 font-medium">
                <span className="flex items-center gap-1"><ShieldCheck size={11} /> 256-bit SSL</span>
                <span>•</span><span>HIPAA Compliant</span><span>•</span><span>OTP Verified</span>
              </div>
              <p className="text-center text-xs text-slate-600 mt-5">
                Are you an administrator?{" "}
                <a href="/admin/login" className="text-primary-700 font-bold hover:underline">Admin Login →</a>
              </p>
            </motion.div>
          ) : (
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.4 }}>
              <label className="text-xs font-bold text-slate-700 flex items-center gap-2 mb-2 uppercase tracking-wide">
                <ShieldCheck size={12} className="text-emerald-600" /> Enter 6-Digit OTP
              </label>
              <input type="text" maxLength={6} value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
                onFocus={() => setFocused(true)} onBlur={() => setFocused(false)}
                placeholder="• • • • • •"
                className={`w-full bg-white border-2 rounded-xl px-4 py-4 outline-none text-center text-2xl font-bold tracking-[0.6em] text-slate-900 ${
                  focused ? "border-primary-500 shadow-lg shadow-primary-200 scale-[1.01]" : "border-slate-200"
                }`} style={{ transition: "all 0.3s ease" }} />

              <div className="flex items-center justify-between mt-3 text-xs">
                <span className="text-slate-600">Sent to <b className="text-slate-900">+91 {mobile}</b></span>
                <span className="text-primary-700 font-bold">Demo: 123456</span>
              </div>

              <motion.button whileTap={{ scale: 0.97 }} whileHover={{ y: -2 }}
                disabled={loading} onClick={handleVerify}
                className="w-full mt-5 py-3.5 rounded-xl font-bold text-white text-sm disabled:opacity-60"
                style={{
                  background: "linear-gradient(135deg, #1d4ed8 0%, #0891b2 100%)",
                  boxShadow: "0 10px 25px -5px rgba(29, 78, 216, 0.5)",
                  transition: "all 0.3s ease",
                }}>
                {loading ? "Verifying..." : "Verify & Continue"}
              </motion.button>

              <button onClick={() => { setStep(1); setOtp(""); }}
                className="w-full mt-3 py-2 text-sm text-slate-600 hover:text-slate-900 font-medium"
                style={{ transition: "all 0.3s ease" }}>
                ← Change mobile number
              </button>
            </motion.div>
          )}
        </div>

        <p className="text-center text-xs text-slate-700 mt-5 font-medium">
          By signing in, you agree to our <span className="underline cursor-pointer">Terms</span> & <span className="underline cursor-pointer">Privacy Policy</span>
        </p>
      </motion.div>
    </div>
  );
}
