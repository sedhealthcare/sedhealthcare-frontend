import { motion } from "framer-motion";
import { Calendar, Clock, User, IdCard } from "lucide-react";

const statusColor = {
  Pending: "bg-amber-100 text-amber-700",
  Confirmed: "bg-blue-100 text-blue-700",
  Cancelled: "bg-rose-100 text-rose-700",
  Completed: "bg-emerald-100 text-emerald-700",
  Rejected: "bg-slate-200 text-slate-700",
};

export default function AppointmentCard({ appt, onCancel }) {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="card p-5">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-semibold">{appt.doctorName}</h3>
        <span className={`text-xs px-3 py-1 rounded-full ${statusColor[appt.status]}`}>{appt.status}</span>
      </div>
      {appt.patientId && (
        <p className="text-xs text-primary-600 mb-2 flex items-center gap-1"><IdCard size={12} /> {appt.patientId}</p>
      )}
      <div className="space-y-1.5 text-sm text-slate-600">
        <p className="flex items-center gap-2"><User size={14} />{appt.patientName}</p>
        <p className="flex items-center gap-2"><Calendar size={14} />{appt.date}</p>
        <p className="flex items-center gap-2"><Clock size={14} />{appt.time}</p>
        {appt.symptoms && <p className="text-xs text-slate-500 mt-2">📝 {appt.symptoms}</p>}
      </div>
      {["Pending", "Confirmed"].includes(appt.status) && onCancel && (
        <button onClick={() => onCancel(appt._id)} className="text-xs bg-rose-50 text-rose-700 px-3 py-1.5 rounded-lg hover:bg-rose-100 mt-4">Cancel Appointment</button>
      )}
    </motion.div>
  );
}
