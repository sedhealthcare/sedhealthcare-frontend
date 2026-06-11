import { useEffect, useState } from "react";
import { Plus, Edit, Trash2, X } from "lucide-react";
import api from "../../api/axios";
import { useNotify } from "../../context/NotificationContext";
import { motion } from "framer-motion";

const CATS = ["Tablets", "Syrup", "Cosmetics", "Medicines"];
const STATUS_TABS = ["All", "Pending", "Confirmed", "Completed", "Cancelled"];

export default function AdminPharmacy() {
  const [items, setItems] = useState([]);
  const [orders, setOrders] = useState([]);
  const [modal, setModal] = useState(null);
  const [view, setView] = useState("catalog");
  const [statusTab, setStatusTab] = useState("All");
  const { notify } = useNotify();

  const load = () => {
    api.get("/pharmacy/all").then(r => setItems(r.data));
    api.get(`/pharmacy/orders/all?status=${statusTab}`).then(r => setOrders(r.data));
  };
  useEffect(() => { load(); }, [statusTab]);

  const save = async (data) => {
    try {
      if (data._id) await api.put(`/pharmacy/${data._id}`, data);
      else await api.post("/pharmacy", data);
      notify("Saved"); setModal(null); load();
    } catch { notify("Save failed", "error"); }
  };

  const del = async (id) => {
    if (!confirm("Delete?")) return;
    await api.delete(`/pharmacy/${id}`); notify("Deleted"); load();
  };

  const updateOrder = async (id, status) => {
    await api.put(`/pharmacy/orders/${id}`, { status });
    notify(`Marked as ${status}`); load();
  };

  const pendingCount = orders.filter(o => o.status === "Pending").length;

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-white">Pharmacy</h1>
          <p className="text-slate-400 text-sm mt-1">Manage products & user orders</p>
        </div>
        {view === "catalog" && (
          <button onClick={() => setModal({})}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-white text-sm shadow-lg shadow-emerald-500/30 hover:-translate-y-0.5 transition-all"
            style={{ background: "linear-gradient(135deg, #059669, #0891b2)" }}>
            <Plus size={16} /> Add Item
          </button>
        )}
      </div>

      <div className="flex gap-2 mt-5">
        <button onClick={() => setView("catalog")}
          className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
            view === "catalog" ? "bg-gradient-to-r from-emerald-500 to-cyan-500 text-white shadow-lg shadow-emerald-500/30" : "bg-white/5 border border-white/10 text-slate-300 hover:bg-white/10"
          }`}>Product Catalog</button>
        <button onClick={() => setView("orders")}
          className={`px-4 py-2 rounded-xl text-sm font-medium transition-all relative ${
            view === "orders" ? "bg-gradient-to-r from-emerald-500 to-cyan-500 text-white shadow-lg shadow-emerald-500/30" : "bg-white/5 border border-white/10 text-slate-300 hover:bg-white/10"
          }`}>
          Orders {pendingCount > 0 && <span className="ml-1 bg-rose-500 text-white text-xs px-1.5 rounded-full">{pendingCount}</span>}
        </button>
      </div>

      {view === "catalog" ? (
        <div className="mt-5 rounded-2xl overflow-x-auto border border-white/10"
          style={{ background: "rgba(15,23,42,0.6)", backdropFilter: "blur(20px)" }}>
          <table className="w-full text-sm">
            <thead className="border-b border-white/10">
              <tr className="text-left text-xs text-slate-400 uppercase tracking-wider">
                <th className="p-4">Name</th><th className="p-4">Category</th><th className="p-4">Price</th><th className="p-4">Qty</th><th className="p-4">Available</th><th className="p-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {items.map(p => (
                <tr key={p._id} className="border-t border-white/5 hover:bg-white/[0.02] transition">
                  <td className="p-4 flex items-center gap-2 text-white"><span className="text-2xl">{p.image}</span>{p.name}</td>
                  <td className="p-4"><span className="text-xs bg-emerald-500/20 text-emerald-300 px-2.5 py-1 rounded-full border border-emerald-400/30 font-semibold">{p.category}</span></td>
                  <td className="p-4 text-white font-bold">₹{p.price}</td>
                  <td className="p-4 text-slate-200">{p.quantity}</td>
                  <td className="p-4"><span className={`text-xs px-2.5 py-1 rounded-full font-semibold ${p.available ? "bg-emerald-500/20 text-emerald-300 border border-emerald-400/30" : "bg-slate-500/20 text-slate-400 border border-slate-400/30"}`}>{p.available ? "Yes" : "No"}</span></td>
                  <td className="p-4 space-x-1">
                    <button onClick={() => setModal(p)} className="text-xs bg-blue-500/20 text-blue-300 p-2 rounded-lg border border-blue-400/30 hover:bg-blue-500/30 transition"><Edit size={14} /></button>
                    <button onClick={() => del(p._id)} className="text-xs bg-rose-500/20 text-rose-300 p-2 rounded-lg border border-rose-400/30 hover:bg-rose-500/30 transition"><Trash2 size={14} /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <>
          <div className="flex gap-2 mt-4 overflow-x-auto">
            {STATUS_TABS.map(t => (
              <button key={t} onClick={() => setStatusTab(t)}
                className={`px-4 py-2 rounded-full text-sm whitespace-nowrap font-medium transition-all ${
                  statusTab === t ? "bg-gradient-to-r from-emerald-500 to-cyan-500 text-white shadow-lg shadow-emerald-500/30" : "bg-white/5 border border-white/10 text-slate-300 hover:bg-white/10"
                }`}>
                {t}
              </button>
            ))}
          </div>
          <div className="mt-4 rounded-2xl overflow-x-auto border border-white/10"
            style={{ background: "rgba(15,23,42,0.6)", backdropFilter: "blur(20px)" }}>
            <table className="w-full text-sm">
              <thead className="border-b border-white/10">
                <tr className="text-left text-xs text-slate-400 uppercase tracking-wider">
                  <th className="p-4">Order ID</th>
                  <th className="p-4">Patient</th>
                  <th className="p-4">Item</th>
                  <th className="p-4">Category</th>
                  <th className="p-4">Qty</th>
                  <th className="p-4">Amount</th>
                  <th className="p-4">Status</th>
                  <th className="p-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {orders.length === 0 ? <tr><td colSpan={8} className="p-12 text-center text-slate-500">No orders</td></tr>
                  : orders.map(o => (
                  <tr key={o._id} className="border-t border-white/5 hover:bg-white/[0.02] transition">
                    <td className="p-4 font-mono text-xs text-emerald-300">{o.orderId}</td>
                    <td className="p-4 text-white">{o.patientName}</td>
                    <td className="p-4 text-slate-200 font-medium">{o.itemName}</td>
                    <td className="p-4"><span className="text-xs bg-emerald-500/20 text-emerald-300 px-2.5 py-1 rounded-full border border-emerald-400/30">{o.category}</span></td>
                    <td className="p-4 text-slate-200">× {o.quantity}</td>
                    <td className="p-4 text-white font-bold">₹{o.price}</td>
                    <td className="p-4"><span className="text-xs bg-slate-500/20 text-slate-300 px-2.5 py-1 rounded-full border border-slate-400/30">{o.status}</span></td>
                    <td className="p-4 space-x-1">
                      {o.status === "Pending" && (
                        <>
                          <button onClick={() => updateOrder(o._id, "Confirmed")} className="text-xs bg-blue-500/20 text-blue-300 px-3 py-1.5 rounded-lg border border-blue-400/30 hover:bg-blue-500/30 transition">Proceed</button>
                          <button onClick={() => updateOrder(o._id, "Cancelled")} className="text-xs bg-rose-500/20 text-rose-300 px-3 py-1.5 rounded-lg border border-rose-400/30 hover:bg-rose-500/30 transition">Reject</button>
                        </>
                      )}
                      {o.status === "Confirmed" && (
                        <button onClick={() => updateOrder(o._id, "Completed")} className="text-xs bg-emerald-500/20 text-emerald-300 px-3 py-1.5 rounded-lg border border-emerald-400/30 hover:bg-emerald-500/30 transition">Complete</button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}

      {modal && <PharmaModal item={modal} onSave={save} onClose={() => setModal(null)} />}
    </motion.div>
  );
}

function PharmaModal({ item, onSave, onClose }) {
  const [form, setForm] = useState({
    _id: item._id,
    name: item.name || "",
    category: item.category || "Tablets",
    price: item.price ?? 0,
    quantity: item.quantity ?? 0,
    description: item.description || "",
    image: item.image || "💊",
    available: item.available ?? true,
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
          <h2 className="font-bold text-white text-lg">{item._id ? "Edit" : "Add"} Pharmacy Item</h2>
          <button onClick={onClose} className="p-1 hover:bg-white/10 rounded-lg text-slate-400"><X /></button>
        </div>
        <div className="space-y-3">
          <input className={inputCls} placeholder="Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          <select className={inputCls} value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}>
            {CATS.map(c => <option key={c} className="bg-slate-900">{c}</option>)}
          </select>
          <div className="grid grid-cols-2 gap-3">
            <input className={inputCls} type="number" placeholder="Price" value={form.price} onChange={(e) => setForm({ ...form, price: +e.target.value })} />
            <input className={inputCls} type="number" placeholder="Quantity" value={form.quantity} onChange={(e) => setForm({ ...form, quantity: +e.target.value })} />
          </div>
          <textarea className={inputCls} placeholder="Description" rows={2} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
          <input className={inputCls} placeholder="Emoji (e.g. 💊)" value={form.image} onChange={(e) => setForm({ ...form, image: e.target.value })} />
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
