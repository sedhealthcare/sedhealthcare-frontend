import { motion } from "framer-motion";

const illustrations = {
  default: (
    <svg viewBox="0 0 200 160" className="w-40 h-32 mx-auto">
      <ellipse cx="100" cy="140" rx="60" ry="6" fill="#e2e8f0" />
      <rect x="60" y="50" width="80" height="80" rx="12" fill="#dbeafe" />
      <rect x="70" y="65" width="60" height="6" rx="3" fill="#93c5fd" />
      <rect x="70" y="78" width="40" height="6" rx="3" fill="#bfdbfe" />
      <rect x="70" y="91" width="50" height="6" rx="3" fill="#bfdbfe" />
      <circle cx="100" cy="40" r="14" fill="#3b82f6" />
      <path d="M95 40 l4 4 l8 -8" stroke="white" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  appointment: (
    <svg viewBox="0 0 200 160" className="w-40 h-32 mx-auto">
      <ellipse cx="100" cy="140" rx="60" ry="6" fill="#e2e8f0" />
      <rect x="55" y="40" width="90" height="90" rx="10" fill="#e0e7ff" />
      <rect x="55" y="40" width="90" height="20" rx="10" fill="#6366f1" />
      <circle cx="70" cy="35" r="5" fill="#6366f1" />
      <circle cx="130" cy="35" r="5" fill="#6366f1" />
      <rect x="65" y="70" width="20" height="12" rx="2" fill="#c7d2fe" />
      <rect x="90" y="70" width="20" height="12" rx="2" fill="#c7d2fe" />
      <rect x="115" y="70" width="20" height="12" rx="2" fill="#a5b4fc" />
      <rect x="65" y="87" width="20" height="12" rx="2" fill="#c7d2fe" />
      <rect x="90" y="87" width="20" height="12" rx="2" fill="#818cf8" />
      <rect x="115" y="87" width="20" height="12" rx="2" fill="#c7d2fe" />
    </svg>
  ),
  doctor: (
    <svg viewBox="0 0 200 160" className="w-40 h-32 mx-auto">
      <ellipse cx="100" cy="140" rx="60" ry="6" fill="#e2e8f0" />
      <circle cx="100" cy="65" r="22" fill="#dbeafe" />
      <rect x="78" y="85" width="44" height="42" rx="6" fill="#bfdbfe" />
      <circle cx="100" cy="60" r="6" fill="white" />
      <path d="M88 100 L88 115 M112 100 L112 115" stroke="#3b82f6" strokeWidth="2" />
      <circle cx="88" cy="118" r="3" fill="#3b82f6" />
      <circle cx="112" cy="118" r="3" fill="#3b82f6" />
    </svg>
  ),
  lab: (
    <svg viewBox="0 0 200 160" className="w-40 h-32 mx-auto">
      <ellipse cx="100" cy="140" rx="60" ry="6" fill="#e2e8f0" />
      <path d="M80 50 L80 100 Q80 120 100 120 Q120 120 120 100 L120 50 Z" fill="#ddd6fe" stroke="#a78bfa" strokeWidth="2" />
      <path d="M80 95 Q100 88 120 95 L120 100 Q120 120 100 120 Q80 120 80 100 Z" fill="#a78bfa" />
      <rect x="75" y="45" width="50" height="6" rx="2" fill="#7c3aed" />
      <circle cx="90" cy="105" r="2" fill="white" />
      <circle cx="108" cy="110" r="2" fill="white" />
    </svg>
  ),
  pharmacy: (
    <svg viewBox="0 0 200 160" className="w-40 h-32 mx-auto">
      <ellipse cx="100" cy="140" rx="60" ry="6" fill="#e2e8f0" />
      <rect x="65" y="55" width="70" height="75" rx="8" fill="#d1fae5" />
      <rect x="80" y="75" width="40" height="40" rx="20" fill="#10b981" />
      <rect x="90" y="85" width="20" height="6" rx="2" fill="white" />
      <rect x="97" y="78" width="6" height="20" rx="2" fill="white" />
      <rect x="65" y="55" width="70" height="14" rx="8" fill="#10b981" />
    </svg>
  ),
};

export default function EmptyState({ title = "Nothing here yet", desc = "Try adjusting your filters or come back later.", type = "default", action }) {
  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
      className="card p-12 text-center">
      <div className="float-anim">{illustrations[type] || illustrations.default}</div>
      <h3 className="font-bold text-slate-800 text-lg mt-2">{title}</h3>
      <p className="text-sm text-slate-500 mt-1 max-w-sm mx-auto">{desc}</p>
      {action && <div className="mt-5">{action}</div>}
    </motion.div>
  );
}
