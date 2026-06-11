import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import LabTestCard from "../components/LabTestCard";
import Skeleton from "../components/Skeleton";
import EmptyState from "../components/EmptyState";
import PageWrapper from "../components/PageWrapper";
import { useNotify } from "../context/NotificationContext";
import { useAuth } from "../context/AuthContext";
import PremiumBg from "../components/PremiumBg";

export default function LabTests() {
  const [tests, setTests] = useState([]);
  const [loading, setLoading] = useState(true);
  const { notify } = useNotify();
  const { user } = useAuth();
  const nav = useNavigate();

  useEffect(() => {
    api.get("/labs").then(r => setTests(r.data)).finally(() => setLoading(false));
  }, []);

  const book = async (test) => {
    try {
      const { data } = await api.post("/labs/book", {
        testName: test.name, price: test.price, patientName: user?.name || "User",
        date: new Date().toISOString().split("T")[0], homeCollection: true
      });
      notify(`${test.name} booked! ID: ${data.bookingId}`);
      nav("/payment", { state: { amount: test.price, type: "Lab Test", name: test.name, patientId: data.bookingId } });
    } catch { notify("Booking failed", "error"); }
  };

  return (
    <div className="relative min-h-screen overflow-hidden">
      <PremiumBg variant="light" />
      <PageWrapper>
        <h1 className="text-3xl font-bold text-slate-900">Lab Tests</h1>
        <p className="text-sm text-slate-500 mt-1">Trusted labs with home sample collection</p>
        <div className="mt-6 pb-8">
          {loading ? <Skeleton /> :
            tests.length === 0 ? <EmptyState type="lab" title="No lab tests available" /> :
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {tests.map(t => <LabTestCard key={t._id} test={t} onBook={book} />)}
            </div>}
        </div>
      </PageWrapper>
    </div>
  );
}
