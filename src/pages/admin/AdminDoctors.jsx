import { useEffect, useState } from "react";
import { Plus, Edit, Trash2, X } from "lucide-react";
import api from "../../api/axios";
import { useNotify } from "../../context/NotificationContext";
import { motion } from "framer-motion";

const SPECS = ["Cardiologist", "Dermatologist", "Pediatrician", "Neurologist", "Orthopedic", "Gynecologist", "Dentist", "ENT", "General Physician"];

export default function AdminDoctors() {
  const [doctors, setDoctors] = useState([]);
  const [modal, setModal] = useState(null);
  const { notify } = useNotify();

  const load = () => api.get("/doctors").then(r => setDoctors(r.data));
  useEffect(() => { load(); }, []);

  const save = async (data) => {
    try {
      if (data._id) await api.put(`/doctors/${data._id}`, data);
      else await api.post("/doctors", data);
      notify(data._id ? "Doctor updated" : "Doctor added");
      setModal(null); load();
    } catch (e) { notify(e.response?.data?.message || "Save failed", "error"); }
  };

  const del = async (id) => {
    if (!confirm("Delete this doctor?")) return;
    await api.delete(`/doctors/${id}`);
    notify("Doctor deleted"); load();
  };

  const toggle = async (id) => {
    await api.patch(`/doctors/${id}/toggle`);
    notify("Availability updated"); load();
  };

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-white">Doctors</h1>
          <p className="text-slate-400 text-sm mt-1">Manage doctor profiles</p>
        </div>
        <button onClick={() => setModal({})}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-white text-sm shadow-lg shadow-emerald-500/30 hover:-translate-y-0.5 transition-all"
          style={{ background: "linear-gradient(135deg, #059669, #0891b2)" }}>
          <Plus size={16} /> Add Doctor
        </button>
      </div>

      <div className="mt-5 rounded-2xl overflow-x-auto border border-white/10"
        style={{ background: "rgba(15,23,42,0.6)", backdropFilter: "blur(20px)" }}>
        <table className="w-full text-sm">
          <thead className="border-b border-white/10">
            <tr className="text-left text-xs text-slate-400 uppercase tracking-wider">
              <th className="p-4">Doctor</th>
              <th className="p-4">Specialization</th>
              <th className="p-4">Experience</th>
              <th className="p-4">Fee</th>
              <th className="p-4">Available</th>
              <th className="p-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {doctors.map(d => (
              <tr key={d._id} className="border-t border-white/5 hover:bg-white/[0.02] transition">
                <td className="p-4 flex items-center gap-3">
                  <img src={d.image} className="w-10 h-10 rounded-full ring-2 ring-white/20" />
                  <span className="font-medium text-white">{d.name}</span>
                </td>
                <td className="p-4 text-slate-200">{d.specialization}</td>
                <td className="p-4 text-slate-200">{d.experience} yrs</td>
                <td className="p-4 text-white font-bold">₹{d.fee}</td>
                <td className="p-4">
                  <button onClick={() => toggle(d._id)} className={`text-xs px-2.5 py-1 rounded-full font-semibold transition ${
                    d.available ? "bg-emerald-500/20 text-emerald-300 border border-emerald-400/30" : "bg-slate-500/20 text-slate-400 border border-slate-400/30"
                  }`}>
                    {d.available ? "Available" : "Unavailable"}
                  </button>
                </td>
                <td className="p-4 space-x-1">
                  <button onClick={() => setModal(d)} className="text-xs bg-blue-500/20 text-blue-300 p-2 rounded-lg border border-blue-400/30 hover:bg-blue-500/30 transition"><Edit size={14} /></button>
                  <button onClick={() => del(d._id)} className="text-xs bg-rose-500/20 text-rose-300 p-2 rounded-lg border border-rose-400/30 hover:bg-rose-500/30 transition"><Trash2 size={14} /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {modal && <DoctorModal doctor={modal} onSave={save} onClose={() => setModal(null)} />}
    </motion.div>
  );
}

function DoctorModal({ doctor, onSave, onClose }) {
  const [form, setForm] = useState({
    _id: doctor._id,
    name: doctor.name || "",
    specialization: doctor.specialization || SPECS[0],
    experience: doctor.experience ?? 1,
    fee: doctor.fee ?? 300,
    available: doctor.available ?? true,
    image: doctor.image || "https://randomuser.me/api/portraits/men/1.jpg",
    gender: doctor.gender || "Male",
    rating: doctor.rating || 4.5,
    timings: Array.isArray(doctor.timings) ? doctor.timings.join(", ") : "09:00 AM, 10:00 AM, 11:00 AM",
  });

  const submit = () => {
    const payload = {
      ...form,
      timings: typeof form.timings === "string"
        ? form.timings.split(",").map(s => s.trim()).filter(Boolean)
        : form.timings,
    };
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
          <h2 className="font-bold text-white text-lg">{doctor._id ? "Edit" : "Add"} Doctor</h2>
          <button onClick={onClose} className="p-1 hover:bg-white/10 rounded-lg text-slate-400"><X /></button>
        </div>
        <div className="space-y-3 max-h-[70vh] overflow-y-auto pr-2">
          <input className={inputCls} placeholder="Doctor Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          <select className={inputCls} value={form.specialization} onChange={(e) => setForm({ ...form, specialization: e.target.value })}>
            {SPECS.map(s => <option key={s} className="bg-slate-900">{s}</option>)}
          </select>
          <div className="grid grid-cols-2 gap-3">
            <input className={inputCls} type="number" placeholder="Experience" value={form.experience} onChange={(e) => setForm({ ...form, experience: +e.target.value })} />
            <input className={inputCls} type="number" placeholder="Fee" value={form.fee} onChange={(e) => setForm({ ...form, fee: +e.target.value })} />
          </div>
          <select className={inputCls} value={form.gender} onChange={(e) => setForm({ ...form, gender: e.target.value })}>
            <option className="bg-slate-900">Male</option>
            <option className="bg-slate-900">Female</option>
          </select>
          <input className={inputCls} placeholder="Image URL" value={form.image} onChange={(e) => setForm({ ...form, image: e.target.value })} />
          <textarea className={inputCls} placeholder="Timings (comma separated)" rows={2}
            value={form.timings} onChange={(e) => setForm({ ...form, timings: e.target.value })} />
          <label className="flex items-center gap-2 text-sm text-slate-300">
            <input type="checkbox" checked={form.available} onChange={(e) => setForm({ ...form, available: e.target.checked })} />
            Available
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
