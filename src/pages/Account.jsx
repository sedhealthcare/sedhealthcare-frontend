import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { User, Mail, Phone, MapPin, Droplet, Calendar, Edit3, Save, Heart, Activity, TestTube, Pill, ShieldCheck } from "lucide-react";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";
import { useNotify } from "../context/NotificationContext";
import PageWrapper from "../components/PageWrapper";
import EmptyState from "../components/EmptyState";
import PremiumBg from "../components/PremiumBg";

const TABS = [
  { key: "Profile", icon: User },
  { key: "Edit Profile", icon: Edit3 },
  { key: "Booked", icon: Calendar },
  { key: "Cancelled", icon: Calendar },
  { key: "History", icon: Activity },
  { key: "Lab Bookings", icon: TestTube },
];

export default function Account() {
  const { user, updateUser } = useAuth();
  const { notify } = useNotify();
  const [tab, setTab] = useState("Profile");
  const [form, setForm] = useState(user || {});
  const [appts, setAppts] = useState([]);
  const [labs, setLabs] = useState([]);

  useEffect(() => { setForm(user || {}); }, [user]);
  useEffect(() => {
    api.get("/appointments").then(r => setAppts(r.data));
    api.get("/labs/my-bookings").then(r => setLabs(r.data));
  }, []);

  const save = async () => {
    const { data } = await api.put("/user/me", form);
    updateUser(data);
    notify("Profile updated successfully");
  };

  const Section = ({ list, key1, key2, empty }) => list.length === 0
    ? <EmptyState title={empty} />
    : <div className="space-y-3">{list.map(x => (
        <motion.div key={x._id} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
          className="card p-4 flex justify-between items-center hover:shadow-md transition">
          <div>
            <p className="font-semibold text-slate-800">{x[key1]}</p>
            <p className="text-xs text-slate-500 mt-1">{x[key2]} • {x.date}</p>
            {x.patientId && <p className="text-xs text-primary-600 font-mono mt-1">{x.patientId}</p>}
          </div>
          <span className="text-xs bg-slate-100 px-3 py-1.5 rounded-full font-semibold">{x.status}</span>
        </motion.div>))}</div>;

  return (
    <div className="relative min-h-screen overflow-hidden">
      <PremiumBg variant="light" />
      <PageWrapper>
        {/* PROFILE HERO */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          className="card-glass p-8 rounded-3xl relative overflow-hidden mb-6"
          style={{ background: "rgba(255,255,255,0.7)" }}>
          <div className="absolute -right-10 -top-10 w-40 h-40 rounded-full opacity-30 blur-3xl"
            style={{ background: "radial-gradient(circle, #3b82f6, transparent)" }} />

          <div className="relative flex flex-col sm:flex-row items-start sm:items-center gap-5">
            <div className="relative">
              <div className="absolute inset-0 rounded-3xl blur-lg opacity-50"
                style={{ background: "linear-gradient(135deg, #2563eb, #06b6d4)" }} />
              <div className="relative w-24 h-24 rounded-3xl flex items-center justify-center text-4xl font-bold text-white shadow-xl"
                style={{ background: "linear-gradient(135deg, #1d4ed8 0%, #0891b2 100%)" }}>
                {(user?.name || "U")[0].toUpperCase()}
              </div>
            </div>
            <div className="flex-1">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-100 border border-emerald-200 text-emerald-700 text-[10px] font-bold uppercase mb-2">
                <ShieldCheck size={10} /> Verified Patient
              </div>
              <h1 className="text-3xl font-bold text-slate-900">{user?.name || "User"}</h1>
              <p className="text-slate-500 mt-1 flex items-center gap-1.5"><Phone size={14} /> +91 {user?.mobile}</p>
            </div>
            <div className="grid grid-cols-3 gap-2 sm:gap-3 w-full sm:w-auto">
              <Stat icon={Calendar} value={appts.length} label="Visits" />
              <Stat icon={TestTube} value={labs.length} label="Tests" />
              <Stat icon={Activity} value={appts.filter(a => a.status === "Completed").length} label="Done" />
            </div>
          </div>
        </motion.div>

        {/* TABS + CONTENT */}
        <div className="grid md:grid-cols-4 gap-5">
          <div className="card p-3 h-fit md:sticky md:top-20">
            {TABS.map(t => (
              <button key={t.key} onClick={() => setTab(t.key)}
                className={`w-full text-left px-4 py-3 rounded-xl text-sm mb-1 flex items-center gap-3 transition-all ${
                  tab === t.key ? "bg-gradient-to-r from-primary-500 to-cyan-500 text-white shadow-lg shadow-primary-200 font-semibold" : "hover:bg-slate-50 text-slate-600"
                }`}>
                <t.icon size={16} />
                {t.key}
              </button>
            ))}
          </div>

          <div className="md:col-span-3 pb-8">
            {tab === "Profile" && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="card p-6 space-y-1">
                <h2 className="font-bold text-lg mb-3">Personal Information</h2>
                {[
                  { icon: Mail, label: "Email", value: user?.email },
                  { icon: User, label: "Age", value: user?.age },
                  { icon: Heart, label: "Gender", value: user?.gender },
                  { icon: Droplet, label: "Blood Group", value: user?.bloodGroup },
                  { icon: MapPin, label: "Address", value: user?.address },
                ].map((f, i) => (
                  <div key={i} className="flex items-center gap-4 py-3 border-b border-slate-100 last:border-0">
                    <div className="w-10 h-10 rounded-xl bg-primary-50 flex items-center justify-center text-primary-600">
                      <f.icon size={18} />
                    </div>
                    <div className="flex-1">
                      <p className="text-xs text-slate-500 uppercase tracking-wide font-semibold">{f.label}</p>
                      <p className="text-sm font-medium text-slate-800 mt-0.5">{f.value || "—"}</p>
                    </div>
                  </div>
                ))}
              </motion.div>
            )}

            {tab === "Edit Profile" && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="card p-6">
                <h2 className="font-bold text-lg mb-4">Update Your Profile</h2>
                <div className="grid sm:grid-cols-2 gap-4">
                  {[["name", "Full Name"], ["email", "Email Address"], ["age", "Age"], ["gender", "Gender"], ["bloodGroup", "Blood Group"], ["address", "Address"]].map(([k, l]) => (
                    <div key={k} className={k === "address" ? "sm:col-span-2" : ""}>
                      <label className="text-xs font-bold text-slate-700 uppercase tracking-wide">{l}</label>
                      <input className="input mt-1" placeholder={l}
                        value={form[k] || ""} onChange={(e) => setForm({ ...form, [k]: e.target.value })} />
                    </div>
                  ))}
                </div>
                <button onClick={save} className="btn-primary w-full sm:w-auto mt-5">
                  <Save size={16} /> Save Changes
                </button>
              </motion.div>
            )}

            {tab === "Booked" && <Section list={appts.filter(a => ["Pending", "Confirmed"].includes(a.status))} key1="doctorName" key2="time" empty="No booked appointments" />}
            {tab === "Cancelled" && <Section list={appts.filter(a => a.status === "Cancelled")} key1="doctorName" key2="time" empty="No cancelled appointments" />}
            {tab === "History" && <Section list={appts.filter(a => a.status === "Completed")} key1="doctorName" key2="time" empty="No consultation history" />}
            {tab === "Lab Bookings" && <Section list={labs} key1="testName" key2="price" empty="No lab bookings" />}
          </div>
        </div>
      </PageWrapper>
    </div>
  );
}

function Stat({ icon: Icon, value, label }) {
  return (
    <div className="card p-3 text-center">
      <Icon size={18} className="mx-auto text-primary-600" />
      <p className="font-bold text-xl mt-1 text-slate-900">{value}</p>
      <p className="text-[10px] text-slate-500 uppercase tracking-wider">{label}</p>
    </div>
  );
}
