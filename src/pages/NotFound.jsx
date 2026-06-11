import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Home, Search, ArrowLeft, Heart } from "lucide-react";
import PremiumBg from "../components/PremiumBg";

export default function NotFound() {
  return (
    <div className="min-h-screen relative overflow-hidden flex items-center justify-center p-4">
      <PremiumBg variant="light" />

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}
        className="relative max-w-md w-full text-center">

        {/* Animated 404 */}
        <div className="relative mb-6">
          <motion.div animate={{ y: [0, -10, 0] }} transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}>
            <div className="text-[140px] sm:text-[180px] font-black leading-none tracking-tight gradient-text">
              404
            </div>
          </motion.div>
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <Heart size={60} className="text-primary-300 opacity-40" fill="currentColor" />
          </div>
        </div>

        <div className="card-glass p-8 rounded-3xl" style={{ background: "rgba(255,255,255,0.7)" }}>
          <h1 className="text-2xl font-bold text-slate-900">Page Not Found</h1>
          <p className="text-slate-600 mt-2 text-sm">
            The page you're looking for has been moved or doesn't exist. Let's get you back on track.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 mt-6 justify-center">
            <Link to="/dashboard" className="btn-primary">
              <Home size={16} /> Go to Dashboard
            </Link>
            <button onClick={() => window.history.back()} className="btn-outline">
              <ArrowLeft size={16} /> Go Back
            </button>
          </div>

          <div className="mt-6 pt-6 border-t border-slate-200">
            <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold mb-3">Quick links</p>
            <div className="flex flex-wrap justify-center gap-2">
              {[
                { to: "/doctors", label: "Find Doctors" },
                { to: "/lab-tests", label: "Lab Tests" },
                { to: "/pharmacy", label: "Pharmacy" },
                { to: "/appointments", label: "Appointments" },
              ].map(l => (
                <Link key={l.to} to={l.to} className="text-xs px-3 py-1.5 bg-white border border-slate-200 rounded-full text-slate-700 hover:bg-primary-50 hover:text-primary-700 hover:border-primary-200 transition">
                  {l.label}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
