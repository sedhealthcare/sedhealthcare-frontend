import { useEffect, useState } from "react";
import api from "../api/axios";
import AppointmentCard from "../components/AppointmentCard";
import Skeleton from "../components/Skeleton";
import EmptyState from "../components/EmptyState";
import PageWrapper from "../components/PageWrapper";
import { useNotify } from "../context/NotificationContext";
import { Link } from "react-router-dom";
import PremiumBg from "../components/PremiumBg";

const TABS = ["All", "Pending", "Confirmed", "Completed", "Cancelled", "Rejected"];

export default function Appointments() {
  const [appts, setAppts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState("All");
  const { notify } = useNotify();

  const load = () => api.get("/appointments").then(r => setAppts(r.data)).finally(() => setLoading(false));

  useEffect(() => {
    load();
    const interval = setInterval(load, 5000);
    return () => clearInterval(interval);
  }, []);

  const cancel = async (id) => {
    await api.put(`/appointments/${id}`, { status: "Cancelled" });
    notify("Appointment cancelled");
    load();
  };

  const filtered = tab === "All" ? appts : appts.filter(a => a.status === tab);

  return (
    <div className="relative min-h-screen overflow-hidden">
      <PremiumBg variant="light" />
      <PageWrapper>
        <h1 className="text-3xl font-bold text-slate-900">My Appointments</h1>
        <p className="text-sm text-slate-500 mt-1">Auto-syncs with admin updates in real-time</p>

        <div className="flex gap-2 mt-5 overflow-x-auto pb-2">
          {TABS.map(t => (
            <button key={t} onClick={() => setTab(t)}
              className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
                tab === t ? "bg-gradient-to-r from-primary-600 to-cyan-500 text-white shadow-lg shadow-primary-200" : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-50"
              }`}>
              {t}
            </button>
          ))}
        </div>

        <div className="mt-5 pb-8">
          {loading ? <Skeleton count={3} />
            : filtered.length === 0 ? <EmptyState type="appointment" title="No appointments yet" desc="Book a consultation with our verified specialists."
                action={<Link to="/doctors" className="btn-primary">Browse Doctors</Link>} />
            : <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
                {filtered.map(a => <AppointmentCard key={a._id} appt={a} onCancel={cancel} />)}
              </div>}
        </div>
      </PageWrapper>
    </div>
  );
}
