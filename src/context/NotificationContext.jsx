import { createContext, useContext, useState, useCallback } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { CheckCircle2, XCircle, Info, X, AlertTriangle } from "lucide-react";

const NotificationContext = createContext();

const config = {
  success: { Icon: CheckCircle2, gradient: "from-emerald-500 to-teal-500", glow: "rgba(16,185,129,0.4)" },
  error: { Icon: XCircle, gradient: "from-rose-500 to-red-500", glow: "rgba(244,63,94,0.4)" },
  info: { Icon: Info, gradient: "from-blue-500 to-cyan-500", glow: "rgba(59,130,246,0.4)" },
  warning: { Icon: AlertTriangle, gradient: "from-amber-500 to-orange-500", glow: "rgba(245,158,11,0.4)" },
};

export const NotificationProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const notify = useCallback((message, type = "success") => {
    const id = Date.now() + Math.random();
    setToasts((t) => [...t, { id, message, type }]);
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 3500);
  }, []);

  return (
    <NotificationContext.Provider value={{ notify }}>
      {children}
      <div className="fixed bottom-5 right-5 z-[100] space-y-3 max-w-sm w-full pointer-events-none">
        <AnimatePresence>
          {toasts.map((t) => {
            const { Icon, gradient, glow } = config[t.type] || config.success;
            return (
              <motion.div key={t.id}
                initial={{ opacity: 0, x: 100, scale: 0.9 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                exit={{ opacity: 0, x: 100, scale: 0.9 }}
                transition={{ type: "spring", stiffness: 200, damping: 20 }}
                className="relative pointer-events-auto rounded-2xl overflow-hidden"
                style={{ boxShadow: `0 20px 50px -10px ${glow}` }}>
                <div className="absolute inset-0 opacity-95" style={{ background: `linear-gradient(135deg, var(--tw-gradient-stops))` }} />
                <div className={`relative flex items-center gap-3 px-4 py-3.5 bg-gradient-to-r ${gradient} text-white`}>
                  <div className="bg-white/20 backdrop-blur p-2 rounded-xl flex-shrink-0">
                    <Icon size={20} />
                  </div>
                  <span className="flex-1 text-sm font-semibold">{t.message}</span>
                  <button onClick={() => setToasts((p) => p.filter((x) => x.id !== t.id))}
                    className="hover:bg-white/20 p-1 rounded-lg transition">
                    <X size={16} />
                  </button>
                </div>
                <motion.div initial={{ width: "100%" }} animate={{ width: "0%" }} transition={{ duration: 3.5, ease: "linear" }}
                  className="h-1 bg-white/40" />
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </NotificationContext.Provider>
  );
};

export const useNotify = () => useContext(NotificationContext);
