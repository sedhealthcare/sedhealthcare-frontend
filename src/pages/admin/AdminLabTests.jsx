import { useEffect, useState } from "react";
import { Plus, Edit, Trash2, X } from "lucide-react";
import api from "../../api/axios";
import { useNotify } from "../../context/NotificationContext";
import { motion } from "framer-motion";

export default function AdminLabTests() {
  const [tests, setTests] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [modal, setModal] = useState(null);
  const [view, setView] = useState("tests");
  const { notify } = useNotify();

  const load = () => {
    api.get("/labs/all").then(r => setTests(r.data));
    api.get("/labs/bookings/all").then(r => setBookings(r.data));
  };
  useEffect(() => { load(); }, []);

  const save = async (data) => {
    try {
      if (data._id) await api.put(`/labs/${data._id}`, data);
      else await api.post("/labs", data);
      notify("Saved"); setModal(null); load();
    } catch { notify("Save failed", "error"); }
  };

  const del = async (id) => {
    if (!confirm("Delete?")) return;
    await api.delete(`/labs/${id}`); notify("Deleted"); load();
  };

  const updateBooking = async (id, status) => {
    await api.put(`/labs/bookings/${id}`, { status });
    notify(`Marked as ${status}`); load();
  };

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-white">Lab Management</h1>
          <p className="text-slate-400 text-sm mt-1">Manage tests & user bookings</p>
        </div>
        {view === "tests" && (
          <button onClick={() => setModal({})}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-white text-sm shadow-lg shadow-emerald-500/30 hover:-translate-y-0.5 transition-all"
            style={{ background: "linear-gradient(135deg, #059669, #0891b2)" }}>
            <Plus size={16} /> Add Test
          </button>
        )}
      </div>

      <div className="flex gap-2 mt-5">
        <button onClick={() => setView("tests")}
          className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
            view === "tests" ? "bg-gradient-to-r from-emerald-500 to-cyan-500 text-white shadow-lg shadow-emerald-500/30" : "bg-white/5 border border-white/10 text-slate-300 hover:bg-white/10"
          }`}>Tests Catalog</button>
        <button onClick={() => setView("bookings")}
          className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
            view === "bookings" ? "bg-gradient-to-r from-emerald-500 to-cyan-500 text-white shadow-lg shadow-emerald-500/30" : "bg-white/5 border border-white/10 text-slate-300 hover:bg-white/10"
          }`}>Bookings</button>
      </div>

      <div className="mt-5 rounded-2xl overflow-x-auto border border-white/10"
        style={{ background: "rgba(15,23,42,0.6)", backdropFilter: "blur(20px)" }}>
        {view === "tests" ? (
          <table className="w-full text-sm">
            <thead className="border-b border-white/10">
              <tr className="text-left text-xs text-slate-400 uppercase tracking-wider">
                <th className="p-4">Name</th><th className="p-4">Price</th><th className="p-4">Description</th><th className="p-4">Available</th><th className="p-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {tests.map(t => (
                <tr key={t._id} className="border-t border-white/5 hover:bg-white/[0.02] transition">
                  <td className="p-4 flex items-center gap-2 text-white"><span className="text-2xl">{t.image}</span>{t.name}</td>
                  <td className="p-4 text-white font-bold">₹{t.price}</td>
                  <td className="p-4 text-xs text-slate-300">{t.description}</td>
                  <td className="p-4"><span className={`text-xs px-2.5 py-1 rounded-full font-semibold ${t.available ? "bg-emerald-500/20 text-emerald-300 border border-emerald-400/30" : "bg-slate-500/20 text-slate-400 border border-slate-400/30"}`}>{t.available ? "Yes" : "No"}</span></td>
                  <td className="p-4 space-x-1">
                    <button onClick={() => setModal(t)} className="text-xs bg-blue-500/20 text-blue-300 p-2 rounded-lg border border-blue-400/30 hover:bg-blue-500/30 transition"><Edit size={14} /></button>
                    <button onClick={() => del(t._id)} className="text-xs bg-rose-500/20 text-rose-300 p-2 rounded-lg border border-rose-400/30 hover:bg-rose-500/30 transition"><Trash2 size={14} /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <table className="w-full text-sm">
            <thead className="border-b border-white/10">
              <tr className="text-left text-xs text-slate-400 uppercase tracking-wider">
                <th className="p-4">Booking ID</th><th className="p-4">Patient</th><th className="p-4">Test</th><th className="p-4">Date</th><th className="p-4">Price</th><th className="p-4">Status</th><th className="p-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {bookings.length === 0 ? <tr><td colSpan={7} className="p-12 text-center text-slate-500">No bookings</td></tr>
                : bookings.map(b => (
                <tr key={b._id} className="border-t border-white/5 hover:bg-white/[0.02] transition">
                  <td className="p-4 font-mono text-xs text-emerald-300">{b.bookingId}</td>
                  <td className="p-4 text-white">{b.patientName}</td>
                  <td className="p-4 text-slate-200">{b.testName}</td>
                  <td className="p-4 text-xs text-slate-300">{b.date}</td>
                  <td className="p-4 text-white font-bold">₹{b.price}</td>
                  <td className="p-4"><span className="text-xs bg-slate-500/20 text-slate-300 px-2.5 py-1 rounded-full border border-slate-400/30">{b.status}</span></td>
                  <td className="p-4 space-x-1">
                    {b.status === "Pending" && <button onClick={() => updateBooking(b._id, "Confirmed")} className="text-xs bg-blue-500/20 text-blue-300 px-3 py-1.5 rounded-lg border border-blue-400/30 hover:bg-blue-500/30 transition">Proceed</button>}
                    {b.status === "Confirmed" && <button onClick={() => updateBooking(b._id, "Completed")} className="text-xs bg-emerald-500/20 text-emerald-300 px-3 py-1.5 rounded-lg border border-emerald-400/30 hover:bg-emerald-500/30 transition">Complete</button>}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {modal && <TestModal test={modal} onSave={save} onClose={() => setModal(null)} />}
    </motion.div>
  );
}

function TestModal({ test, onSave, onClose }) {
  const [form, setForm] = useState({
    _id: test._id,
    name: test.name || "",
    price: test.price ?? 0,
    description: test.description || "",
    image: test.image || "🧪",
    homeCollection: test.homeCollection ?? true,
    available: test.available ?? true,
  });

  const submit = () => {
    const payload = { ...form };
    if (!payload._id) delete payload._id;
    onSave(payload);
  };

  const inputCls = "w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 outline-none text-white placeholder-slate-500 focus:border-emerald-400 transition";

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-md z-50 flex items-center justify-center p-4">
      <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
        className="p-6 w-full max-w-lg rounded-2xl border border-white/10"
        style={{ background: "linear-gradient(135deg, rgba(15,23,42,0.95) 0%, rgba(30,27,75,0.95) 100%)", backdropFilter: "blur(20px)" }}>
        <div className="flex justify-between items-center mb-4">
          <h2 className="font-bold text-white text-lg">{test._id ? "Edit" : "Add"} Lab Test</h2>
          <button onClick={onClose} className="p-1 hover:bg-white/10 rounded-lg text-slate-400"><X /></button>
        </div>
        <div className="space-y-3">
          <input className={inputCls} placeholder="Test Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          <input className={inputCls} type="number" placeholder="Price" value={form.price} onChange={(e) => setForm({ ...form, price: +e.target.value })} />
          <textarea className={inputCls} placeholder="Description" rows={2} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
          <input className={inputCls} placeholder="Emoji (e.g. 🩸)" value={form.image} onChange={(e) => setForm({ ...form, image: e.target.value })} />
          <label className="flex items-center gap-2 text-sm text-slate-300">
            <input type="checkbox" checked={form.homeCollection} onChange={(e) => setForm({ ...form, homeCollection: e.target.checked })} /> Home Collection
          </label>
          <label className="flex items-center gap-2 text-sm text-slate-300">
            <input type="checkbox" checked={form.available} onChange={(e) => setForm({ ...form, available: e.target.checked })} /> Available
          </label>
        </div>
        <div className="flex gap-2 mt-5">
          <button onClick={onClose} className="flex-1 py-2.5 rounded-xl border border-white/10 text-slate-300 hover:bg-white/5 transition">Cancel</button>
          <button onClick={submit} className="flex-1 py-2.5 rounded-xl font-semibold text-white shadow-lg shadow-emerald-500/30 transition"
            style={{ background: "linear-gradient(135deg, #059669, #0891b2)" }}>Save</button>
        </div>
      </motion.div>
    </div>
  );
}
