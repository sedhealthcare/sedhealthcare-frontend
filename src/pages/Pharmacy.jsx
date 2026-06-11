import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ShoppingCart, IndianRupee, Search, X } from "lucide-react";
import api from "../api/axios";
import PageWrapper from "../components/PageWrapper";
import Skeleton from "../components/Skeleton";
import EmptyState from "../components/EmptyState";
import { useNotify } from "../context/NotificationContext";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import PremiumBg from "../components/PremiumBg";

const CATS = ["All", "Tablets", "Syrup", "Cosmetics", "Medicines"];

export default function Pharmacy() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cat, setCat] = useState("All");
  const [search, setSearch] = useState("");
  const [confirmItem, setConfirmItem] = useState(null);
  const [qty, setQty] = useState(1);
  const { notify } = useNotify();
  const { user } = useAuth();
  const nav = useNavigate();

  useEffect(() => {
    setLoading(true);
    api.get(`/pharmacy?category=${cat}&search=${search}`).then(r => setItems(r.data)).finally(() => setLoading(false));
  }, [cat, search]);

  const proceed = async () => {
    try {
      const total = confirmItem.price * qty;
      const { data } = await api.post("/pharmacy/order", {
        itemName: confirmItem.name, category: confirmItem.category,
        price: total, quantity: qty, patientName: user?.name || "User",
      });
      notify(`Order placed! ID: ${data.orderId}`);
      setConfirmItem(null);
      nav("/payment", { state: { amount: total, type: "Pharmacy", name: confirmItem.name, patientId: data.orderId } });
    } catch { notify("Order failed", "error"); }
  };

  return (
    <div className="relative min-h-screen overflow-hidden">
      <PremiumBg variant="light" />
      <PageWrapper>
        <h1 className="text-3xl font-bold text-slate-900">Pharmacy</h1>
        <p className="text-sm text-slate-500 mt-1">Order medicines, syrups & cosmetics with home delivery</p>

        <div className="card-glass p-4 mt-5 flex flex-col sm:flex-row gap-3" style={{ background: "rgba(255,255,255,0.7)" }}>
          <div className="relative flex-1">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search items..." className="input pl-10" />
          </div>
          <div className="flex gap-2 overflow-x-auto">
            {CATS.map(c => (
              <button key={c} onClick={() => setCat(c)}
                className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
                  cat === c ? "bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-lg shadow-emerald-200" : "bg-white border border-slate-200 hover:bg-slate-50"
                }`}>
                {c}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-6 pb-8">
          {loading ? <Skeleton />
            : items.length === 0 ? <EmptyState type="pharmacy" title="No items found" />
            : <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {items.map(p => (
                  <motion.div key={p._id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                    whileHover={{ y: -6 }} className="card p-5 relative overflow-hidden group">
                    <div className="absolute -right-6 -top-6 w-24 h-24 rounded-full bg-emerald-100 opacity-0 group-hover:opacity-60 transition-opacity blur-2xl" />
                    <div className="relative">
                      <div className="text-5xl mb-3">{p.image}</div>
                      <span className="text-[10px] font-bold uppercase bg-emerald-100 text-emerald-700 px-2 py-1 rounded-full">{p.category}</span>
                      <h3 className="font-bold mt-2 text-slate-800">{p.name}</h3>
                      <p className="text-xs text-slate-500 mt-1 line-clamp-2">{p.description}</p>
                      <p className="text-xs text-slate-400 mt-1">Stock: {p.quantity}</p>
                      <div className="flex items-center justify-between mt-4 pt-4 border-t border-slate-100">
                        <div>
                          <p className="text-[10px] text-slate-500 uppercase font-semibold">Price</p>
                          <span className="text-2xl font-bold flex items-center gradient-text"><IndianRupee size={18} />{p.price}</span>
                        </div>
                        <button onClick={() => { setConfirmItem(p); setQty(1); }} className="btn-primary text-sm">
                          <ShoppingCart size={14} /> Buy
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>}
        </div>

        {confirmItem && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
              className="card-glass p-6 w-full max-w-md" style={{ background: "rgba(255,255,255,0.95)" }}>
              <div className="flex justify-between items-center mb-4">
                <h2 className="font-bold text-lg">Order Summary</h2>
                <button onClick={() => setConfirmItem(null)} className="p-1 hover:bg-slate-100 rounded-lg"><X /></button>
              </div>

              <div className="flex gap-4 items-center pb-4 border-b border-slate-100">
                <div className="text-5xl">{confirmItem.image}</div>
                <div>
                  <h3 className="font-bold">{confirmItem.name}</h3>
                  <p className="text-xs text-slate-500">{confirmItem.category}</p>
                  <p className="text-xs text-emerald-600 font-semibold mt-1">In stock: {confirmItem.quantity}</p>
                </div>
              </div>

              <div className="space-y-3 mt-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Quantity</span>
                  <div className="flex items-center gap-2">
                    <button onClick={() => setQty(Math.max(1, qty - 1))} className="w-9 h-9 bg-slate-100 hover:bg-slate-200 rounded-lg font-bold transition">−</button>
                    <span className="font-bold w-10 text-center text-lg">{qty}</span>
                    <button onClick={() => setQty(Math.min(confirmItem.quantity, qty + 1))} className="w-9 h-9 bg-slate-100 hover:bg-slate-200 rounded-lg font-bold transition">+</button>
                  </div>
                </div>
                <div className="flex justify-between text-sm text-slate-600">
                  <span>Unit Price</span><span>₹{confirmItem.price}</span>
                </div>
                <div className="flex justify-between text-sm text-slate-600">
                  <span>Quantity</span><span>× {qty}</span>
                </div>
                <div className="flex justify-between font-bold text-lg pt-3 border-t border-slate-100">
                  <span>Total</span><span className="gradient-text">₹{confirmItem.price * qty}</span>
                </div>
              </div>

              <div className="flex gap-2 mt-5">
                <button onClick={() => setConfirmItem(null)} className="btn-outline flex-1">Cancel</button>
                <button onClick={proceed} className="btn-primary flex-1">Proceed to Pay</button>
              </div>
            </motion.div>
          </div>
        )}
      </PageWrapper>
    </div>
  );
}
