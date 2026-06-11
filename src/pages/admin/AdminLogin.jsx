import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useAuth } from "../../context/AuthContext";
import { useNotify } from "../../context/NotificationContext";
import { ShieldCheck, Phone, Lock, Sparkles, KeyRound } from "lucide-react";

export default function AdminLogin() {
  const [step, setStep] = useState(1);
  const [mobile, setMobile] = useState("");
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [focused, setFocused] = useState(false);
  const { sendOtp, verifyOtp, user, role } = useAuth();
  const { notify } = useNotify();
  const nav = useNavigate();

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
      await verifyOtp(mobile, otp, true);
      notify("Welcome Admin");
      nav("/admin");
    } catch (e) { notify(e.response?.data?.message || "Invalid OTP", "error"); }
    setLoading(false);
  };

  return (
    <div className="min-h-screen relative overflow-hidden flex items-center justify-center p-4"
      style={{ background: "linear-gradient(135deg, #020617 0%, #0c1e3e 30%, #1e1b4b 65%, #0f172a 100%)" }}>

      <div className="absolute -top-40 -right-40 w-[600px] h-[600px] rounded-full opacity-50 pointer-events-none"
        style={{ background: "radial-gradient(circle, #10b981 0%, #06b6d4 40%, transparent 70%)", filter: "blur(100px)" }} />
      <div className="absolute -bottom-32 -left-32 w-[480px] h-[480px] rounded-full opacity-55 pointer-events-none"
        style={{ background: "radial-gradient(circle, #6366f1 0%, #4338ca 50%, transparent 70%)", filter: "blur(90px)" }} />
      <div className="absolute top-1/3 left-1/4 w-72 h-72 rounded-full opacity-35 pointer-events-none animate-pulse"
        style={{ background: "radial-gradient(circle, #06b6d4 0%, transparent 70%)", filter: "blur(70px)", animationDuration: "5s" }} />
      <div className="absolute inset-0 opacity-[0.08] pointer-events-none"
        style={{ backgroundImage: "radial-gradient(circle, #ffffff 1.2px, transparent 1.2px)", backgroundSize: "32px 32px" }} />

      <motion.div initial={{ opacity: 0, y: 30, scale: 0.96 }} animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }} whileHover={{ y: -4 }}
        className="relative w-full max-w-md group" style={{ transition: "all 0.3s ease" }}>

        <div className="relative p-8 sm:p-10 rounded-3xl backdrop-blur-2xl border-2 border-white/15 group-hover:shadow-2xl"
          style={{
            background: "rgba(15, 23, 42, 0.75)",
            boxShadow: "0 35px 90px -15px rgba(0, 0, 0, 0.7), 0 10px 30px -8px rgba(16, 185, 129, 0.3)",
            transition: "all 0.3s ease",
          }}>

          <div className="flex justify-center mb-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/15 border border-emerald-400/40 text-emerald-300 text-[10px] font-bold uppercase tracking-wider">
              <Sparkles size={10} /> Restricted Access · Authorized Only
            </div>
          </div>

          <div className="flex justify-center mb-5 mt-3">
            <motion.div whileHover={{ rotate: 8, scale: 1.05 }} transition={{ type: "spring", stiffness: 300 }} className="relative">
              <div className="absolute inset-0 rounded-2xl blur-lg opacity-70"
                style={{ background: "linear-gradient(135deg, #10b981, #06b6d4)" }} />
              <div className="relative p-4 rounded-2xl shadow-xl border-2 border-emerald-400/30"
                style={{ background: "linear-gradient(135deg, #064e3b 0%, #0c4a6e 100%)" }}>
                <ShieldCheck size={30} className="text-emerald-300" strokeWidth={2.5} />
              </div>
            </motion.div>
          </div>

          <h1 className="text-3xl font-bold text-center text-white tracking-tight">Admin Portal</h1>
          <p className="text-center text-sm text-slate-300 mt-1.5 mb-7">
            {step === 1 ? "Secure access to the management console" : "Verify your identity to continue"}
          </p>

          {step === 1 ? (
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.4 }}>
              <label className="text-xs font-bold text-slate-200 flex items-center gap-2 mb-2 uppercase tracking-wide">
                <Phone size={12} className="text-emerald-400" /> Administrator Mobile
              </label>
              <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 font-semibold text-sm border-r border-white/20 pr-3">+91</div>
                <input type="tel" maxLength={10} value={mobile}
                  onChange={(e) => setMobile(e.target.value.replace(/\D/g, ""))}
                  onFocus={() => setFocused(true)} onBlur={() => setFocused(false)}
                  placeholder="9876543210"
                  className={`w-full bg-slate-900/60 border-2 rounded-xl pl-16 pr-4 py-3.5 outline-none text-white font-medium placeholder-slate-500 ${
                    focused ? "border-emerald-400 shadow-lg shadow-emerald-500/30 scale-[1.01]" : "border-white/15"
                  }`} style={{ transition: "all 0.3s ease" }} />
              </div>

              <motion.button whileTap={{ scale: 0.97 }} whileHover={{ y: -2 }}
                disabled={loading} onClick={handleSend}
                className="w-full mt-5 py-3.5 rounded-xl font-bold text-white text-sm disabled:opacity-60"
                style={{
                  background: "linear-gradient(135deg, #059669 0%, #0891b2 100%)",
                  boxShadow: "0 10px 30px -5px rgba(16, 185, 129, 0.5)",
                  transition: "all 0.3s ease",
                }}>
                {loading ? "Sending OTP..." : "Send Verification Code"}
              </motion.button>

              <div className="flex items-center gap-3 my-5">
                <div className="flex-1 h-px bg-white/15" />
                <span className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">Enterprise Security</span>
                <div className="flex-1 h-px bg-white/15" />
              </div>
              <div className="flex items-center justify-center gap-4 text-[10px] text-slate-400 font-medium">
                <span className="flex items-center gap-1"><KeyRound size={11} /> JWT Auth</span>
                <span>•</span><span>Role-Based Access</span><span>•</span><span>Audit Logging</span>
              </div>

              <p className="text-center text-xs text-slate-400 mt-5">
                Not an administrator?{" "}
                <a href="/login" className="text-emerald-300 font-bold hover:underline">Patient Login →</a>
              </p>
            </motion.div>
          ) : (
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.4 }}>
              <label className="text-xs font-bold text-slate-200 flex items-center gap-2 mb-2 uppercase tracking-wide">
                <Lock size={12} className="text-emerald-400" /> Enter 6-Digit OTP
              </label>
              <input type="text" maxLength={6} value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
                onFocus={() => setFocused(true)} onBlur={() => setFocused(false)}
                placeholder="• • • • • •"
                className={`w-full bg-slate-900/60 border-2 rounded-xl px-4 py-4 outline-none text-center text-2xl font-bold tracking-[0.6em] text-white placeholder-slate-600 ${
                  focused ? "border-emerald-400 shadow-lg shadow-emerald-500/30 scale-[1.01]" : "border-white/15"
                }`} style={{ transition: "all 0.3s ease" }} />

              <div className="flex items-center justify-between mt-3 text-xs">
                <span className="text-slate-400">Sent to <b className="text-white">+91 {mobile}</b></span>
                <span className="text-emerald-300 font-bold">Demo: 123456</span>
              </div>

              <motion.button whileTap={{ scale: 0.97 }} whileHover={{ y: -2 }}
                disabled={loading} onClick={handleVerify}
                className="w-full mt-5 py-3.5 rounded-xl font-bold text-white text-sm disabled:opacity-60"
                style={{
                  background: "linear-gradient(135deg, #059669 0%, #0891b2 100%)",
                  boxShadow: "0 10px 30px -5px rgba(16, 185, 129, 0.5)",
                  transition: "all 0.3s ease",
                }}>
                {loading ? "Authenticating..." : "Login to Admin Panel"}
              </motion.button>

              <button onClick={() => { setStep(1); setOtp(""); }}
                className="w-full mt-3 py-2 text-sm text-slate-400 hover:text-slate-200 font-medium"
                style={{ transition: "all 0.3s ease" }}>
                ← Change mobile number
              </button>
            </motion.div>
          )}
        </div>

        <p className="text-center text-xs text-slate-400 mt-5 font-medium">
          Unauthorized access is prohibited and monitored.
        </p>
      </motion.div>
    </div>
  );
}
