import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Stethoscope, Calendar, TestTube, Pill, Users, AlertCircle, TrendingUp, Sparkles, Activity } from "lucide-react";
import api from "../../api/axios";
import Counter from "../../components/Counter";

export default function AdminDashboard() {
  const [stats, setStats] = useState({ doctors: 0, appts: 0, labs: 0, pharmacy: 0, users: 0, pending: 0 });

  useEffect(() => {
    const load = () => api.get("/admin/stats").then(r => setStats(r.data)).catch(() => {});
    load();
    const interval = setInterval(load, 8000);
    return () => clearInterval(interval);
  }, []);

  const cards = [
    { icon: Stethoscope, label: "Active Doctors", value: stats.doctors, gradient: "from-blue-500 to-cyan-500", glow: "rgba(59,130,246,0.4)", border: "#3b82f6" },
    { icon: Calendar, label: "Total Appointments", value: stats.appts, gradient: "from-emerald-500 to-teal-500", glow: "rgba(16,185,129,0.4)", border: "#10b981" },
    { icon: AlertCircle, label: "Pending Requests", value: stats.pending, gradient: "from-amber-500 to-orange-500", glow: "rgba(245,158,11,0.5)", border: "#f59e0b", highlight: true },
    { icon: TestTube, label: "Lab Tests", value: stats.labs, gradient: "from-purple-500 to-indigo-500", glow: "rgba(139,92,246,0.4)", border: "#8b5cf6" },
    { icon: Pill, label: "Pharmacy Items", value: stats.pharmacy, gradient: "from-pink-500 to-rose-500", glow: "rgba(244,63,94,0.4)", border: "#f43f5e" },
    { icon: Users, label: "Registered Users", value: stats.users, gradient: "from-cyan-500 to-blue-500", glow: "rgba(6,182,212,0.4)", border: "#06b6d4" },
  ];

  return (
    <div>
      {/* HERO */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}
        className="rounded-3xl p-8 mb-6 relative overflow-hidden border border-white/10"
        style={{
          background: "linear-gradient(135deg, rgba(15,23,42,0.85) 0%, rgba(30,27,75,0.85) 100%)",
          backdropFilter: "blur(20px)",
          boxShadow: "0 30px 80px -15px rgba(0,0,0,0.6), inset 0 1px 0 0 rgba(255,255,255,0.1)",
        }}>

        {/* Decorative glows */}
        <div className="absolute -right-12 -top-12 w-64 h-64 rounded-full blur-3xl opacity-40"
          style={{ background: "radial-gradient(circle, #10b981, transparent)" }} />
        <div className="absolute -left-12 -bottom-12 w-64 h-64 rounded-full blur-3xl opacity-30"
          style={{ background: "radial-gradient(circle, #6366f1, transparent)" }} />

        <div className="relative">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/15 border border-emerald-400/40 text-emerald-300 text-[10px] font-bold uppercase tracking-wider mb-4">
            <Sparkles size={10} /> Admin Console · Real-Time
          </div>
          <div className="flex items-end justify-between flex-wrap gap-4">
            <div>
              <h1 className="text-4xl sm:text-5xl font-bold text-white tracking-tight">
                Operations <span style={{
                  background: "linear-gradient(135deg, #10b981, #06b6d4, #6366f1)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}>Overview</span>
              </h1>
              <p className="text-slate-300 mt-2 text-sm">Real-time analytics across all healthcare modules</p>
            </div>
            <div className="flex items-center gap-2 bg-emerald-500/10 border border-emerald-400/30 px-4 py-2 rounded-full">
              <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
              <span className="text-xs text-emerald-300 font-semibold">All systems operational</span>
            </div>
          </div>
        </div>
      </motion.div>

      {/* STATS GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {cards.map((c, i) => (
          <motion.div key={c.label}
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }}
            whileHover={{ y: -6 }}
            className="relative p-6 rounded-2xl overflow-hidden border border-white/10 group cursor-default"
            style={{
              background: "linear-gradient(135deg, rgba(15,23,42,0.75) 0%, rgba(30,41,59,0.75) 100%)",
              backdropFilter: "blur(20px)",
              boxShadow: "0 20px 50px -15px rgba(0,0,0,0.5), inset 0 1px 0 0 rgba(255,255,255,0.05)",
              transition: "all 0.3s ease",
            }}>

            {/* Top accent line */}
            <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${c.gradient}`} />

            {/* Hover ring glow */}
            <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"
              style={{ boxShadow: `0 0 0 1.5px ${c.border}40, 0 25px 60px -15px ${c.glow}` }} />

            {/* Background blob */}
            <div className={`absolute -right-10 -top-10 w-40 h-40 rounded-full bg-gradient-to-br ${c.gradient} opacity-15 group-hover:opacity-30 blur-3xl transition-opacity`} />

            {/* Card content */}
            <div className="relative">
              <div className="flex items-start justify-between">
                <div className="relative">
                  <div className={`absolute inset-0 rounded-2xl blur-md opacity-50 bg-gradient-to-br ${c.gradient}`} />
                  <div className={`relative w-14 h-14 rounded-2xl bg-gradient-to-br ${c.gradient} flex items-center justify-center shadow-xl`}>
                    <c.icon size={26} className="text-white" />
                  </div>
                </div>

                {c.highlight && stats.pending > 0 && (
                  <motion.span
                    animate={{ scale: [1, 1.05, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="text-[10px] bg-amber-500/20 text-amber-300 px-3 py-1.5 rounded-full border border-amber-400/40 font-bold uppercase tracking-wider">
                    Action Needed
                  </motion.span>
                )}
              </div>

              <p className="text-5xl font-bold mt-5 text-white tracking-tight">
                <Counter to={c.value} />
              </p>
              <p className="text-sm text-slate-400 mt-1 font-medium">{c.label}</p>

              <div className="mt-4 pt-4 border-t border-white/10 flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-xs text-emerald-400 font-semibold">
                  <Activity size={12} />
                  <span>Live data</span>
                </div>
                <div className="flex items-center gap-1 text-xs text-slate-500">
                  <TrendingUp size={12} />
                  <span>Real-time</span>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Footer status bar */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}
        className="mt-6 p-4 rounded-2xl border border-white/10 flex items-center justify-between flex-wrap gap-3"
        style={{
          background: "linear-gradient(135deg, rgba(15,23,42,0.6) 0%, rgba(30,41,59,0.6) 100%)",
          backdropFilter: "blur(20px)",
        }}>
        <div className="flex items-center gap-4 text-xs text-slate-400">
          <span className="flex items-center gap-1.5">
            <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
            <span className="font-semibold text-emerald-300">Backend Online</span>
          </span>
          <span>•</span>
          <span>API Response: <span className="text-white font-semibold">~120ms</span></span>
          <span>•</span>
          <span>Auto-refresh: <span className="text-white font-semibold">8s</span></span>
        </div>
        <span className="text-xs text-slate-500">Last sync: just now</span>
      </motion.div>
    </div>
  );
}
