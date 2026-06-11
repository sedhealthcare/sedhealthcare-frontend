import { motion } from "framer-motion";
import { Home, IndianRupee } from "lucide-react";

export default function LabTestCard({ test, onBook }) {
  return (
    <motion.div whileHover={{ y: -4 }} className="card p-5">
      <div className="text-5xl mb-3">{test.image}</div>
      <h3 className="font-semibold">{test.name}</h3>
      <p className="text-sm text-slate-500 mt-1">{test.desc}</p>
      {test.homeCollection && (
        <span className="inline-flex items-center gap-1 text-xs mt-3 bg-emerald-50 text-emerald-700 px-2 py-1 rounded-full">
          <Home size={12} /> Home Collection
        </span>
      )}
      <div className="flex items-center justify-between mt-4">
        <span className="text-xl font-bold flex items-center"><IndianRupee size={16} />{test.price}</span>
        <button onClick={() => onBook(test)} className="btn-primary text-sm">Book Test</button>
      </div>
    </motion.div>
  );
}