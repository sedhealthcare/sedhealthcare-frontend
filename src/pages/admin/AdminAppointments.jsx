import { useEffect, useState } from "react";
import { Search } from "lucide-react";
import api from "../../api/axios";
import { useNotify } from "../../context/NotificationContext";
import { motion } from "framer-motion";

const TABS = ["All", "Pending", "Confirmed", "Completed", "Rejected", "Cancelled"];
const statusColor = {
  Pending: "bg-amber-500/20 text-amber-300 border border-amber-400/30",
  Confirmed: "bg-blue-500/20 text-blue-300 border border-blue-400/30",
  Cancelled: "bg-rose-500/20 text-rose-300 border border-rose-400/30",
  Completed: "bg-emerald-500/20 text-emerald-300 border border-emerald-400/30",
  Rejected: "bg-slate-500/20 text-slate-300 border border-slate-400/30",
};

export default function AdminAppointments() {
  const [appts, setAppts] = useState([]);
  const [search, setSearch] = useState("");
  const [tab, setTab] = useState("All");
  const { notify } = useNotify();

  const load = () => api.get(`/appointments/all?search=${search}&status=${tab}`).then(r => setAppts(r.data));
  useEffect(() => { load(); }, [search, tab]);

  const update = async (id, status, msg) => {
    await api.put(`/appointments/${id}`, { status });
    notify(msg); load();
  };

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
      <h1 className="text-3xl font-bold text-white">Appointment Requests</h1>
      <p className="text-slate-400 text-sm mt-1">Manage all patient bookings</p>

      <div className="flex flex-col sm:flex-row gap-3 mt-5">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
          <input value={search} onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by Patient ID, name or doctor..."
            className="w-full pl-10 pr-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-slate-500 focus:border-emerald-400 outline-none transition" />
        </div>
        <div className="flex gap-2 overflow-x-auto">
          {TABS.map(t => (
            <button key={t} onClick={() => setTab(t)}
              className={`px-4 py-2 rounded-full text-sm whitespace-nowrap font-medium transition-all ${
                tab === t
                  ? "bg-gradient-to-r from-emerald-500 to-cyan-500 text-white shadow-lg shadow-emerald-500/30"
                  : "bg-white/5 border border-white/10 text-slate-300 hover:bg-white/10"
              }`}>
              {t}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-5 rounded-2xl overflow-x-auto border border-white/10"
        style={{ background: "rgba(15,23,42,0.6)", backdropFilter: "blur(20px)" }}>
        <table className="w-full text-sm">
          <thead className="border-b border-white/10">
            <tr className="text-left text-xs text-slate-400 uppercase tracking-wider">
              <th className="p-4">Patient ID</th>
              <th className="p-4">Patient</th>
              <th className="p-4">Doctor</th>
              <th className="p-4">Date & Time</th>
              <th className="p-4">Fee</th>
              <th className="p-4">Status</th>
              <th className="p-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {appts.length === 0 ? (
              <tr><td colSpan={7} className="p-12 text-center text-slate-500">No appointments found</td></tr>
            ) : appts.map(a => (
              <tr key={a._id} className="border-t border-white/5 hover:bg-white/[0.02] transition">
                <td className="p-4 font-mono text-xs text-emerald-300 font-semibold">{a.patientId}</td>
                <td className="p-4 text-white">{a.patientName}</td>
                <td className="p-4 text-slate-200">{a.doctorName}</td>
                <td className="p-4 text-xs text-slate-300">{a.date}<br />{a.time}</td>
                <td className="p-4 text-white font-bold">₹{a.fee || 0}</td>
                <td className="p-4"><span className={`text-xs px-2.5 py-1 rounded-full font-semibold ${statusColor[a.status]}`}>{a.status}</span></td>
                <td className="p-4 space-x-1">
                  {a.status === "Pending" && (
                    <>
                      <button onClick={() => update(a._id, "Confirmed", "Appointment confirmed")} className="text-xs bg-blue-500/20 text-blue-300 px-3 py-1.5 rounded-lg border border-blue-400/30 hover:bg-blue-500/30 transition">Proceed</button>
                      <button onClick={() => update(a._id, "Rejected", "Appointment rejected")} className="text-xs bg-rose-500/20 text-rose-300 px-3 py-1.5 rounded-lg border border-rose-400/30 hover:bg-rose-500/30 transition">Reject</button>
                    </>
                  )}
                  {a.status === "Confirmed" && (
                    <button onClick={() => update(a._id, "Completed", "Marked completed")} className="text-xs bg-emerald-500/20 text-emerald-300 px-3 py-1.5 rounded-lg border border-emerald-400/30 hover:bg-emerald-500/30 transition">Complete</button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </motion.div>
  );
}
