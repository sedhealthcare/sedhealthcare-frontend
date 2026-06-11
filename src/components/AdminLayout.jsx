import { NavLink, useNavigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { LayoutDashboard, Stethoscope, Calendar, TestTube, Pill, LogOut, ShieldCheck, Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";

const links = [
  { to: "/admin", label: "Dashboard", icon: LayoutDashboard, end: true },
  { to: "/admin/doctors", label: "Doctors", icon: Stethoscope },
  { to: "/admin/appointments", label: "Appointments", icon: Calendar },
  { to: "/admin/lab-tests", label: "Lab Tests", icon: TestTube },
  { to: "/admin/pharmacy", label: "Pharmacy", icon: Pill },
];

export default function AdminLayout() {
  const { logout } = useAuth();
  const nav = useNavigate();
  const [open, setOpen] = useState(false);

  const SidebarContent = ({ onClose }) => (
    <div className="w-64 p-4 flex flex-col h-full"
      style={{ background: "rgba(2, 6, 23, 0.95)", backdropFilter: "blur(24px)" }}>

      {/* Header with close button on mobile */}
      <div className="flex items-center justify-between mb-6 px-2 py-3 border-b border-white/10">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="absolute inset-0 rounded-xl blur-md opacity-60"
              style={{ background: "linear-gradient(135deg, #10b981, #06b6d4)" }} />
            <div className="relative p-2 rounded-xl border border-emerald-400/30"
              style={{ background: "linear-gradient(135deg, #064e3b 0%, #0c4a6e 100%)" }}>
              <ShieldCheck size={18} className="text-emerald-300" />
            </div>
          </div>
          <div>
            <p className="font-bold text-white text-sm">Admin Panel</p>
            <p className="text-[10px] text-emerald-400 uppercase tracking-wider font-semibold">SedHealthcare</p>
          </div>
        </div>
        {onClose && (
          <button onClick={onClose} className="lg:hidden p-1.5 text-slate-400 hover:bg-white/10 rounded-lg">
            <X size={18} />
          </button>
        )}
      </div>

      {/* Navigation */}
      <nav className="space-y-1 flex-1">
        {links.map(l => (
          <NavLink key={l.to} to={l.to} end={l.end} onClick={onClose}
            className={({ isActive }) => `flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-medium transition-all relative ${
              isActive ? "text-white" : "text-slate-400 hover:text-white hover:bg-white/5"
            }`}>
            {({ isActive }) => (
              <>
                {isActive && (
                  <motion.div layoutId="admin-nav-bg" className="absolute inset-0 rounded-xl"
                    style={{
                      background: "linear-gradient(135deg, #059669 0%, #0891b2 100%)",
                      boxShadow: "0 8px 25px -5px rgba(16,185,129,0.5)",
                    }} />
                )}
                <l.icon size={18} className="relative z-10" />
                <span className="relative z-10">{l.label}</span>
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* Logout button — pinned to bottom */}
      <button onClick={() => { logout(); nav("/admin/login"); if (onClose) onClose(); }}
        className="flex items-center gap-2 px-3 py-3 mt-4 text-rose-400 hover:bg-rose-500/10 rounded-xl text-sm font-medium border border-transparent hover:border-rose-500/30 transition-all">
        <LogOut size={16} /> Logout
      </button>
    </div>
  );

  return (
    <div className="min-h-screen flex relative overflow-hidden"
      style={{ background: "linear-gradient(135deg, #020617 0%, #0c1e3e 30%, #1e1b4b 65%, #0f172a 100%)" }}>

      {/* Background glows */}
      <div className="absolute -top-40 -right-40 w-[700px] h-[700px] rounded-full opacity-50 pointer-events-none orb-pulse"
        style={{ background: "radial-gradient(circle, #10b981 0%, #06b6d4 40%, transparent 70%)", filter: "blur(120px)" }} />
      <div className="absolute -bottom-32 -left-32 w-[600px] h-[600px] rounded-full opacity-55 pointer-events-none"
        style={{ background: "radial-gradient(circle, #6366f1 0%, #4338ca 50%, transparent 70%)", filter: "blur(110px)" }} />
      <div className="absolute inset-0 opacity-[0.08] pointer-events-none"
        style={{ backgroundImage: "radial-gradient(circle, #fff 1.2px, transparent 1.2px)", backgroundSize: "32px 32px" }} />

      {/* Desktop sidebar — always visible on lg+ */}
      <div className="hidden lg:block z-20 border-r border-white/10">
        <SidebarContent />
      </div>

      {/* Mobile sidebar — slides in over content */}
      <AnimatePresence>
        {open && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setOpen(false)}
              className="fixed inset-0 bg-black/70 backdrop-blur-sm z-40 lg:hidden" />
            <motion.div initial={{ x: -280 }} animate={{ x: 0 }} exit={{ x: -280 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="fixed top-0 left-0 bottom-0 z-50 lg:hidden">
              <SidebarContent onClose={() => setOpen(false)} />
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Main content area */}
      <main className="flex-1 overflow-auto relative z-10 min-w-0">
        {/* Mobile header bar — only on small screens */}
        <header className="lg:hidden flex items-center justify-between px-4 py-3 border-b border-white/10 sticky top-0 z-30"
          style={{ background: "rgba(2, 6, 23, 0.85)", backdropFilter: "blur(24px)" }}>
          <button onClick={() => setOpen(true)} className="p-2 text-white hover:bg-white/10 rounded-lg active:scale-95 transition">
            <Menu size={22} />
          </button>
          <div className="flex items-center gap-2">
            <ShieldCheck size={18} className="text-emerald-400" />
            <span className="font-bold text-white text-sm">Admin Panel</span>
          </div>
          <button onClick={() => { logout(); nav("/admin/login"); }} className="p-2 text-rose-400 hover:bg-rose-500/10 rounded-lg active:scale-95 transition">
            <LogOut size={18} />
          </button>
        </header>

        {/* Page content */}
        <div className="p-4 sm:p-6">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
