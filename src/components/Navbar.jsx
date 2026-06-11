import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Heart, LogOut, Menu, X, ChevronRight } from "lucide-react";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const links = [
  { to: "/dashboard", label: "Dashboard" },
  { to: "/doctors", label: "Doctors" },
  { to: "/appointments", label: "Appointments" },
  { to: "/lab-tests", label: "Lab Tests" },
  { to: "/pharmacy", label: "Pharmacy" },
  { to: "/account", label: "Account" },
];

export default function Navbar() {
  const { user, logout } = useAuth();
  const { pathname } = useLocation();
  const nav = useNavigate();
  const [open, setOpen] = useState(false);

  if (!user) return null;

  return (
    <>
      <nav className="border-b border-white/40 sticky top-0 z-40"
        style={{ background: "rgba(255,255,255,0.7)", backdropFilter: "blur(20px)" }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between h-16">
          <Link to="/dashboard" className="flex items-center gap-2.5">
            <motion.div whileHover={{ rotate: 15, scale: 1.05 }} className="relative">
              <div className="absolute inset-0 rounded-xl blur-md opacity-50"
                style={{ background: "linear-gradient(135deg, #2563eb, #06b6d4)" }} />
              <div className="relative p-2 rounded-xl"
                style={{ background: "linear-gradient(135deg, #1d4ed8 0%, #0891b2 100%)" }}>
                <Heart size={18} fill="white" className="text-white" />
              </div>
            </motion.div>
            <span className="font-bold text-lg tracking-tight">Sed<span className="text-primary-600">Healthcare</span></span>
          </Link>

          <div className="hidden lg:flex items-center gap-1">
            {links.map((l) => (
              <Link key={l.to} to={l.to}
                className={`relative px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                  pathname === l.to ? "text-primary-700" : "text-slate-600 hover:text-slate-900"
                }`}>
                {l.label}
                {pathname === l.to && (
                  <motion.div layoutId="user-nav-bg" className="absolute inset-0 rounded-xl bg-primary-100 -z-10" />
                )}
              </Link>
            ))}
            <button onClick={() => { logout(); nav("/login"); }} className="ml-2 flex items-center gap-2 text-rose-600 hover:bg-rose-50 px-3 py-2 rounded-xl text-sm font-medium transition">
              <LogOut size={16} /> Logout
            </button>
          </div>

          <button className="lg:hidden p-2 hover:bg-slate-100 rounded-lg" onClick={() => setOpen(true)}>
            <Menu />
          </button>
        </div>
      </nav>

      <AnimatePresence>
        {open && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setOpen(false)}
              className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50" />
            <motion.div initial={{ x: "-100%" }} animate={{ x: 0 }} exit={{ x: "-100%" }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="fixed top-0 left-0 bottom-0 w-80 z-50 p-6 overflow-y-auto"
              style={{ background: "rgba(255,255,255,0.85)", backdropFilter: "blur(30px)" }}>

              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                  <div className="p-2 rounded-xl"
                    style={{ background: "linear-gradient(135deg, #1d4ed8 0%, #0891b2 100%)" }}>
                    <Heart size={18} fill="white" className="text-white" />
                  </div>
                  <span className="font-bold">SedHealthcare</span>
                </div>
                <button onClick={() => setOpen(false)} className="p-2 hover:bg-slate-100 rounded-lg">
                  <X size={20} />
                </button>
              </div>

              <div className="card p-4 mb-5 bg-gradient-to-br from-primary-500 to-cyan-500 text-white border-0">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-white/20 backdrop-blur rounded-2xl flex items-center justify-center font-bold">
                    {(user?.name || "U")[0].toUpperCase()}
                  </div>
                  <div>
                    <p className="font-semibold">{user?.name}</p>
                    <p className="text-xs opacity-80">+91 {user?.mobile}</p>
                  </div>
                </div>
              </div>

              <div className="space-y-1">
                {links.map((l) => (
                  <Link key={l.to} to={l.to} onClick={() => setOpen(false)}
                    className={`flex items-center justify-between px-4 py-3 rounded-xl text-sm font-medium ${
                      pathname === l.to ? "bg-primary-100 text-primary-700" : "text-slate-700 hover:bg-slate-100"
                    }`}>
                    {l.label}
                    <ChevronRight size={14} className="opacity-50" />
                  </Link>
                ))}
              </div>

              <button onClick={() => { logout(); nav("/login"); setOpen(false); }}
                className="w-full text-left flex items-center gap-2 px-4 py-3 mt-5 text-rose-600 bg-rose-50 hover:bg-rose-100 rounded-xl text-sm font-medium">
                <LogOut size={16} /> Logout
              </button>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
