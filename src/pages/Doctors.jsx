import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Search, Filter } from "lucide-react";
import api from "../api/axios";
import DoctorCard from "../components/DoctorCard";
import Skeleton from "../components/Skeleton";
import EmptyState from "../components/EmptyState";
import PageWrapper from "../components/PageWrapper";
import PremiumBg from "../components/PremiumBg";

const SPECS = ["All", "Cardiologist", "Dermatologist", "Pediatrician", "Neurologist", "Orthopedic", "Gynecologist", "Dentist", "ENT", "General Physician"];
const PAGE_SIZE = 9;

export default function Doctors() {
  const [searchParams] = useSearchParams();
  const initialSpec = searchParams.get("specialization") || "All";

  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [spec, setSpec] = useState(initialSpec);
  const [available, setAvailable] = useState(false);
  const [sort, setSort] = useState("");
  const [page, setPage] = useState(1);

  useEffect(() => { setSpec(searchParams.get("specialization") || "All"); }, [searchParams]);

  useEffect(() => {
    setLoading(true);
    api.get("/doctors", { params: { search, specialization: spec, available, sort } })
      .then(r => { setDoctors(r.data); setPage(1); })
      .catch(() => setDoctors([]))
      .finally(() => setLoading(false));
  }, [search, spec, available, sort]);

  const paged = doctors.slice(0, page * PAGE_SIZE);

  return (
    <div className="relative min-h-screen overflow-hidden">
      <PremiumBg variant="light" />
      <PageWrapper>
        <h1 className="text-3xl font-bold text-slate-900">Find Doctors</h1>
        <p className="text-sm text-slate-500 mt-1">
          {spec !== "All" ? `Showing ${spec} specialists` : "Consult with verified specialists"}
        </p>

        <div className="card-glass p-4 mt-5 grid md:grid-cols-4 gap-3" style={{ background: "rgba(255,255,255,0.7)" }}>
          <div className="relative md:col-span-2">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search by name..." className="input pl-10" />
          </div>
          <select value={spec} onChange={(e) => setSpec(e.target.value)} className="input">
            {SPECS.map(s => <option key={s}>{s}</option>)}
          </select>
          <select value={sort} onChange={(e) => setSort(e.target.value)} className="input">
            <option value="">Sort by</option>
            <option value="fee">Fee: Low to High</option>
            <option value="experience">Experience</option>
            <option value="rating">Rating</option>
          </select>
          <label className="flex items-center gap-2 text-sm md:col-span-4 cursor-pointer">
            <input type="checkbox" checked={available} onChange={(e) => setAvailable(e.target.checked)} className="w-4 h-4 rounded text-primary-600" />
            <Filter size={14} className="text-slate-400" />
            <span className="font-medium">Show only available doctors</span>
          </label>
        </div>

        <div className="mt-6 pb-8">
          {loading ? <Skeleton />
            : doctors.length === 0 ? <EmptyState type="doctor" title="No doctors found" desc="Try changing your filters." />
            : <>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {paged.map(d => <DoctorCard key={d._id} doctor={d} />)}
              </div>
              {paged.length < doctors.length && (
                <button onClick={() => setPage(p => p + 1)} className="btn-outline mt-6 mx-auto block">Load More Doctors</button>
              )}
            </>}
        </div>
      </PageWrapper>
    </div>
  );
}
