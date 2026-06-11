import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";
import { useNotify } from "../context/NotificationContext";
import PageWrapper from "../components/PageWrapper";

export default function BookAppointment() {
  const { id } = useParams();
  const nav = useNavigate();
  const { user } = useAuth();
  const { notify } = useNotify();
  const [doctor, setDoctor] = useState(null);
  const [form, setForm] = useState({ patientName: user?.name || "", date: "", time: "", symptoms: "" });
  const [loading, setLoading] = useState(false);

  useEffect(() => { api.get(`/doctors/${id}`).then(r => setDoctor(r.data)); }, [id]);

  const submit = async () => {
    if (!form.date || !form.time || !form.patientName) return notify("Fill all required fields", "error");
    setLoading(true);
    try {
      const { data } = await api.post("/appointments", {
        ...form, doctorId: doctor._id, doctorName: doctor.name, fee: doctor.fee
      });
      notify(`Appointment booked! Patient ID: ${data.patientId}`);
      nav("/payment", { state: { amount: doctor.fee, type: "Consultation", name: doctor.name, patientId: data.patientId } });
    } catch { notify("Booking failed", "error"); }
    setLoading(false);
  };

  if (!doctor) return <PageWrapper><div className="card p-8 animate-pulse h-64" /></PageWrapper>;

  return (
    <PageWrapper>
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="max-w-3xl mx-auto">
        <h1 className="text-2xl font-bold mb-1">Book Appointment</h1>
        <p className="text-slate-500 text-sm mb-5">Fill the details to confirm your consultation</p>

        <div className="card p-5 flex gap-4 items-center mb-5">
          <img src={doctor.image} className="w-16 h-16 rounded-xl" />
          <div className="flex-1">
            <h3 className="font-semibold">{doctor.name}</h3>
            <p className="text-sm text-primary-600">{doctor.specialization}</p>
            <p className="text-xs text-slate-500">{doctor.experience} yrs • ₹{doctor.fee} fee</p>
          </div>
        </div>

        <div className="card p-6 space-y-4">
          <div>
            <label className="text-sm font-medium">Patient Name *</label>
            <input className="input mt-1" value={form.patientName} onChange={(e) => setForm({ ...form, patientName: e.target.value })} />
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium">Date *</label>
              <input type="date" min={new Date().toISOString().split("T")[0]} className="input mt-1" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} />
            </div>
            <div>
              <label className="text-sm font-medium">Time Slot *</label>
              <select className="input mt-1" value={form.time} onChange={(e) => setForm({ ...form, time: e.target.value })}>
                <option value="">Select time</option>
                {(doctor.timings || []).map(t => <option key={t}>{t}</option>)}
              </select>
            </div>
          </div>
          <div>
            <label className="text-sm font-medium">Symptoms / Notes</label>
            <textarea rows={3} className="input mt-1" value={form.symptoms} onChange={(e) => setForm({ ...form, symptoms: e.target.value })} placeholder="Describe your concern..." />
          </div>
          <button onClick={submit} disabled={loading} className="btn-primary w-full">{loading ? "Booking..." : `Proceed to Pay ₹${doctor.fee}`}</button>
        </div>
      </motion.div>
    </PageWrapper>
  );
}
