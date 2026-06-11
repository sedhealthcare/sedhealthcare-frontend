import { motion } from "framer-motion";
import { Star, Briefcase, BadgeCheck, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function DoctorCard({ doctor }) {
  const nav = useNavigate();
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -8 }}
      className="card p-5 relative overflow-hidden group cursor-pointer hover:shadow-2xl transition-all"
    >
      {/* Ring glow on hover */}
      <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"
        style={{ boxShadow: "0 0 0 2px rgba(59, 130, 246, 0.2), 0 20px 40px -10px rgba(59, 130, 246, 0.3)" }} />

      {/* Background accent */}
      <div className="absolute -right-8 -top-8 w-32 h-32 rounded-full opacity-0 group-hover:opacity-20 transition-opacity blur-2xl"
        style={{ background: "radial-gradient(circle, #3b82f6, transparent)" }} />

      <div className="relative flex gap-4">
        <div className="relative">
          <img src={doctor.image} alt={doctor.name} className="w-20 h-20 rounded-2xl object-cover ring-2 ring-white shadow-md" />
          <div className="absolute -bottom-1 -right-1 bg-white rounded-full p-0.5 shadow-md">
            <BadgeCheck size={18} className="text-emerald-500" fill="currentColor" />
          </div>
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div>
              <h3 className="font-bold text-slate-900 truncate">{doctor.name}</h3>
              <p className="text-sm text-primary-700 font-semibold">{doctor.specialization}</p>
            </div>
            <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase whitespace-nowrap ${doctor.available ? "bg-emerald-100 text-emerald-700" : "bg-slate-100 text-slate-500"}`}>
              {doctor.available ? "● Online" : "Busy"}
            </span>
          </div>

          <div className="flex items-center gap-3 mt-2 text-xs text-slate-600">
            <span className="flex items-center gap-1 bg-amber-50 text-amber-700 px-2 py-0.5 rounded-full font-semibold">
              <Star size={11} fill="currentColor" />{doctor.rating}
            </span>
            <span className="flex items-center gap-1"><Briefcase size={11} />{doctor.experience} yrs</span>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between mt-4 pt-4 border-t border-slate-100 relative">
        <div>
          <p className="text-[10px] text-slate-500 uppercase font-semibold tracking-wide">Starting at</p>
          <p className="text-2xl font-bold gradient-text">₹{doctor.fee}</p>
        </div>
        <button
          disabled={!doctor.available}
          onClick={() => nav(`/book/${doctor._id}`)}
          className="btn-primary text-sm disabled:opacity-40 disabled:cursor-not-allowed !py-2.5"
        >
          Book <ArrowRight size={14} />
        </button>
      </div>
    </motion.div>
  );
}
