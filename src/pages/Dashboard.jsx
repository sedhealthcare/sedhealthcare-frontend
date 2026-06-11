import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Calendar, Stethoscope, TestTube, Search, Heart, Pill, Brain, AlertCircle, User, Sparkles, ArrowRight, ShieldCheck } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import api from "../api/axios";
import PageWrapper from "../components/PageWrapper";
import Counter from "../components/Counter";
import PremiumBg from "../components/PremiumBg";

// Custom tooth icon (lucide doesn't ship one)
const Tooth = ({ size = 24, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M12 2c-3.5 0-6 2.5-6 6 0 2 .8 3.5 1.5 5 .7 1.5 1 3 1 5 0 2 .5 4 1.5 4s1.5-2 2-4c0 0 .2-1 .5-1s.5 1 .5 1c.5 2 1 4 2 4s1.5-2 1.5-4c0-2 .3-3.5 1-5 .7-1.5 1.5-3 1.5-5 0-3.5-2.5-6-6-6z" />
  </svg>
);

const categories = [
  { icon: Heart, name: "Cardiology", color: "from-rose-500 to-pink-500", path: "/doctors?specialization=Cardiologist" },
  { icon: Brain, name: "Neurology", color: "from-purple-500 to-indigo-500", path: "/doctors?specialization=Neurologist" },
  { icon: Tooth, name: "Dentist", color: "from-blue-500 to-cyan-500", path: "/doctors?specialization=Dentist" },
  { icon: Pill, name: "Pharmacy", color: "from-emerald-500 to-teal-500", path: "/pharmacy" },
  { icon: Stethoscope, name: "Doctors", color: "from-amber-500 to-orange-500", path: "/doctors" },
  { icon: TestTube, name: "Lab Tests", color: "from-cyan-500 to-blue-500", path: "/lab-tests" },
  { icon: Calendar, name: "Appointments", color: "from-indigo-500 to-blue-500", path: "/appointments" },
  { icon: User, name: "Profile", color: "from-pink-500 to-rose-500", path: "/account" },
];

export default function Dashboard() {
  const { user } = useAuth();
  const nav = useNavigate();
  const [counts, setCounts] = useState({ doctors: 0, appts: 0, labs: 0, pharmacy: 0 });
  const [appts, setAppts] = useState([]);
  const [search, setSearch] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [showError, setShowError] = useState(false);

  useEffect(() => {
    api.get("/admin/dashboard-counts").then(r => setCounts(r.data)).catch(() => {});
    api.get("/appointments").then(r => setAppts(r.data)).catch(() => {});
  }, []);

  useEffect(() => {
    if (search.trim().length < 2) { setSuggestions([]); return; }
    const t = setTimeout(async () => {
      try {
        const [docs, labs] = await Promise.all([api.get(`/doctors?search=${search}`), api.get(`/labs`)]);
        const matchedLabs = labs.data.filter(l => l.name.toLowerCase().includes(search.toLowerCase()));
        setSuggestions([
          ...docs.data.slice(0, 4).map(d => ({ type: "Doctor", name: d.name, path: "/doctors" })),
          ...matchedLabs.slice(0, 4).map(l => ({ type: "Lab Test", name: l.name, path: "/lab-tests" })),
        ]);
      } catch { setSuggestions([]); }
    }, 300);
    return () => clearTimeout(t);
  }, [search]);

  const handleSearch = () => {
    if (!search.trim() || suggestions.length === 0) {
      setShowError(true);
      setTimeout(() => setShowError(false), 2500);
      return;
    }
    nav(suggestions[0].path);
  };

  const upcoming = appts.filter(a => ["Pending", "Confirmed"].includes(a.status)).slice(0, 3);

  return (
    <div className="relative min-h-screen overflow-hidden">
      <PremiumBg variant="light" />
      <PageWrapper>
        {/* HERO */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}
          className="relative rounded-3xl p-8 sm:p-10 overflow-hidden card-glass" style={{ background: "rgba(255,255,255,0.6)" }}>
          <div className="relative z-10 max-w-2xl">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 border border-emerald-200 text-emerald-800 text-[10px] font-bold uppercase tracking-wider mb-4">
              <Sparkles size={10} /> Welcome back
            </div>
            <h1 className="text-4xl sm:text-5xl font-bold text-slate-900 tracking-tight">
              Hello, <span className="gradient-text">{user?.name || "User"}</span> 👋
            </h1>
            <p className="text-slate-600 mt-3 text-base max-w-lg">
              Your trusted partner in modern healthcare. Find doctors, book lab tests and manage your health all in one place.
            </p>

            <div className="mt-6 relative max-w-lg">
              <div className="flex items-center bg-white rounded-2xl shadow-xl p-2 border border-slate-100">
                <Search size={20} className="ml-3 text-slate-400" />
                <input value={search} onChange={(e) => setSearch(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                  placeholder="Search doctors, lab tests..."
                  className="flex-1 bg-transparent px-3 py-2 outline-none text-slate-700 text-sm" />
                <button onClick={handleSearch} className="btn-primary !rounded-xl !py-2 !px-4 text-sm">
                  Search <ArrowRight size={14} />
                </button>
              </div>

              <AnimatePresence>
                {showError && (
                  <motion.div initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                    className="absolute top-full left-0 right-0 mt-2 bg-rose-50 border border-rose-200 text-rose-700 px-4 py-2 rounded-xl text-sm flex items-center gap-2 shadow-lg">
                    <AlertCircle size={16} /> Please enter doctor name or lab test
                  </motion.div>
                )}
                {suggestions.length > 0 && search && !showError && (
                  <motion.div initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }}
                    className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden max-h-64 overflow-y-auto z-50">
                    {suggestions.map((s, i) => (
                      <button key={i} onClick={() => { setSearch(""); nav(s.path); }}
                        className="w-full text-left px-4 py-3 hover:bg-primary-50 flex justify-between items-center text-slate-800 text-sm border-b border-slate-50">
                        <span className="font-medium">{s.name}</span>
                        <span className="text-xs text-primary-600 font-semibold bg-primary-50 px-2 py-1 rounded-full">{s.type}</span>
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <div className="flex flex-wrap items-center gap-4 mt-6 text-xs text-slate-500 font-medium">
              {["Verified Doctors", "Home Sample Collection", "Instant Reports"].map(t => (
                <span key={t} className="flex items-center gap-1.5"><ShieldCheck size={14} className="text-emerald-500" />{t}</span>
              ))}
            </div>
          </div>
          <Heart size={280} className="absolute -right-12 -bottom-12 text-primary-200 opacity-30" />
        </motion.div>

        {/* STATS */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
          {[
            { icon: Stethoscope, label: "Available Doctors", value: counts.doctors, color: "from-blue-500 to-cyan-500" },
            { icon: Calendar, label: "My Appointments", value: counts.appts, color: "from-emerald-500 to-teal-500" },
            { icon: TestTube, label: "Lab Tests", value: counts.labs, color: "from-purple-500 to-indigo-500" },
            { icon: Pill, label: "Pharmacy Items", value: counts.pharmacy, color: "from-orange-500 to-rose-500" },
          ].map((s, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}
              className="card p-5 cursor-default relative overflow-hidden group">
              <div className={`absolute -right-4 -top-4 w-20 h-20 rounded-full bg-gradient-to-br ${s.color} opacity-10 group-hover:opacity-20 transition-opacity`} />
              <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${s.color} flex items-center justify-center shadow-lg`}>
                <s.icon size={22} className="text-white" />
              </div>
              <p className="text-3xl font-bold mt-3 text-slate-900"><Counter to={s.value} /></p>
              <p className="text-sm text-slate-500 mt-1">{s.label}</p>
            </motion.div>
          ))}
        </div>

        {/* CATEGORIES */}
        <div className="flex items-end justify-between mt-10 mb-5">
          <div>
            <p className="text-xs text-primary-700 font-bold uppercase tracking-wider">Specialties</p>
            <h2 className="text-2xl font-bold text-slate-900 mt-1">Browse by category</h2>
          </div>
        </div>
        <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-8 gap-3">
          {categories.map((c, i) => (
            <motion.button key={c.name} onClick={() => nav(c.path)} whileHover={{ y: -6 }}
              initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
              className="card p-4 text-center cursor-pointer group">
              <div className={`w-14 h-14 bg-gradient-to-br ${c.color} text-white rounded-2xl flex items-center justify-center mx-auto shadow-md group-hover:scale-110 transition-transform`}>
                <c.icon size={24} />
              </div>
              <p className="text-xs font-semibold mt-3 text-slate-700">{c.name}</p>
            </motion.button>
          ))}
        </div>

        {/* UPCOMING + PROFILE */}
        <div className="grid lg:grid-cols-3 gap-5 mt-8 pb-8">
          <div className="lg:col-span-2 card p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-bold text-lg">Upcoming Appointments</h2>
              <Link to="/appointments" className="text-sm text-primary-700 font-semibold inline-flex items-center gap-1 hover:gap-2 transition-all">
                View all <ArrowRight size={14} />
              </Link>
            </div>
            {upcoming.length === 0 ? (
              <div className="text-center py-8">
                <Calendar size={48} className="mx-auto text-slate-200" />
                <p className="text-sm text-slate-500 mt-3">No upcoming appointments</p>
                <Link to="/doctors" className="btn-primary mt-4 text-sm inline-flex">Book Now</Link>
              </div>
            ) : (
              <div className="space-y-3">
                {upcoming.map(a => (
                  <div key={a._id} className="flex items-center justify-between p-3 bg-slate-50 rounded-xl hover:bg-primary-50 transition">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-cyan-500 text-white rounded-xl flex items-center justify-center font-bold">
                        {a.doctorName?.[3] || "D"}
                      </div>
                      <div>
                        <p className="font-semibold text-sm">{a.doctorName}</p>
                        <p className="text-xs text-slate-500">{a.patientId} • {a.date} • {a.time}</p>
                      </div>
                    </div>
                    <span className="text-xs bg-blue-100 text-blue-700 px-3 py-1 rounded-full font-medium">{a.status}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="card p-6 relative overflow-hidden text-white border-0"
            style={{ background: "linear-gradient(135deg, #1d4ed8 0%, #0891b2 100%)" }}>
            <div className="absolute -right-8 -top-8 w-32 h-32 rounded-full bg-white/10 blur-2xl" />
            <div className="w-16 h-16 bg-white/20 backdrop-blur rounded-2xl flex items-center justify-center text-2xl font-bold">
              {(user?.name || "U")[0].toUpperCase()}
            </div>
            <h3 className="font-bold text-xl mt-4">{user?.name}</h3>
            <p className="text-sm opacity-80">+91 {user?.mobile}</p>
            <div className="grid grid-cols-2 gap-3 mt-5 text-sm">
              <div className="bg-white/10 backdrop-blur rounded-xl p-3">
                <p className="opacity-70 text-xs">Visits</p>
                <p className="font-bold text-lg mt-1">{appts.length}</p>
              </div>
              <div className="bg-white/10 backdrop-blur rounded-xl p-3">
                <p className="opacity-70 text-xs">Active</p>
                <p className="font-bold text-lg mt-1">{upcoming.length}</p>
              </div>
            </div>
            <Link to="/account" className="block text-center bg-white text-primary-700 font-semibold py-2.5 rounded-xl mt-5 hover:bg-slate-100 transition">
              Manage Account
            </Link>
          </div>
        </div>
      </PageWrapper>
    </div>
  );
}
