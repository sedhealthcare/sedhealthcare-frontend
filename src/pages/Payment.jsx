import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { CreditCard, Smartphone, Wallet, CheckCircle, Tag } from "lucide-react";
import PageWrapper from "../components/PageWrapper";
import { useNotify } from "../context/NotificationContext";

const COUPONS = {
  HEALTH10: { discount: 10, label: "10% off" },
  LAB20: { discount: 20, label: "20% off" },
  WELCOME50: { discount: 50, label: "50% off (max ₹500)" },
};

export default function Payment() {
  const { state } = useLocation();
  const nav = useNavigate();
  const { notify } = useNotify();
  const [method, setMethod] = useState("card");
  const [processing, setProcessing] = useState(false);
  const [done, setDone] = useState(false);
  const [coupon, setCoupon] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [card, setCard] = useState({ number: "", name: "", expiry: "", cvv: "" });
  const [upi, setUpi] = useState("");
  const [wallet, setWallet] = useState("");

  if (!state) { nav("/dashboard"); return null; }

  const baseAmount = state.amount;
  const discount = appliedCoupon
    ? appliedCoupon.label.includes("max ₹500")
      ? Math.min(baseAmount * (appliedCoupon.discount / 100), 500)
      : baseAmount * (appliedCoupon.discount / 100)
    : 0;
  const finalAmount = Math.max(0, baseAmount - discount);

  const applyCoupon = () => {
    const code = coupon.trim().toUpperCase();
    if (COUPONS[code]) {
      setAppliedCoupon({ code, ...COUPONS[code] });
      notify(`Coupon ${code} applied!`);
    } else { notify("Invalid coupon code", "error"); }
  };

  const validate = () => {
    if (method === "card") {
      if (!card.number || card.number.length < 12) return "Enter valid card number";
      if (!card.name) return "Enter cardholder name";
      if (!card.expiry) return "Enter expiry";
      if (!card.cvv || card.cvv.length < 3) return "Enter valid CVV";
    }
    if (method === "upi" && !upi.includes("@")) return "Enter valid UPI ID";
    if (method === "wallet" && wallet.length < 10) return "Enter valid wallet number";
    return null;
  };

  const pay = () => {
    const err = validate();
    if (err) return notify(err, "error");
    setProcessing(true);
    setTimeout(() => {
      setProcessing(false);
      setDone(true);
      notify("Payment successful!");
      setTimeout(() => nav("/dashboard"), 1800);
    }, 1500);
  };

  if (done) return (
    <PageWrapper>
      <motion.div initial={{ scale: 0.5 }} animate={{ scale: 1 }} className="card p-10 max-w-md mx-auto text-center">
        <CheckCircle size={70} className="mx-auto text-emerald-500" />
        <h2 className="text-xl font-bold mt-4">Payment Successful</h2>
        <p className="text-sm text-slate-500 mt-1">Your {state.type} for {state.name} is confirmed.</p>
        {state.patientId && <p className="text-xs text-primary-600 mt-1">ID: {state.patientId}</p>}
        <p className="text-3xl font-bold mt-4">₹{finalAmount.toFixed(2)}</p>
      </motion.div>
    </PageWrapper>
  );

  return (
    <PageWrapper>
      <div className="max-w-md mx-auto">
        <h1 className="text-2xl font-bold mb-4">Payment</h1>

        <div className="card p-5 mb-4">
          <div className="flex justify-between text-sm">
            <span className="text-slate-500">{state.type}</span>
            <span className="font-medium">{state.name}</span>
          </div>
          {state.patientId && (
            <div className="flex justify-between text-xs mt-1 text-primary-600">
              <span>ID</span><span>{state.patientId}</span>
            </div>
          )}
          <div className="flex justify-between text-sm mt-3 pt-3 border-t">
            <span>Subtotal</span><span>₹{baseAmount}</span>
          </div>
          {appliedCoupon && (
            <div className="flex justify-between text-sm text-emerald-600">
              <span>Discount ({appliedCoupon.code})</span><span>- ₹{discount.toFixed(2)}</span>
            </div>
          )}
          <div className="flex justify-between text-lg font-bold mt-2 pt-2 border-t">
            <span>Total</span><span>₹{finalAmount.toFixed(2)}</span>
          </div>
        </div>

        <div className="card p-5 mb-4">
          <label className="text-sm font-medium flex items-center gap-2"><Tag size={14} />Apply Coupon</label>
          <div className="flex gap-2 mt-2">
            <input value={coupon} onChange={(e) => setCoupon(e.target.value.toUpperCase())} placeholder="HEALTH10 / LAB20 / WELCOME50" className="input flex-1" />
            <button onClick={applyCoupon} className="btn-outline text-sm">Apply</button>
          </div>
          <p className="text-xs text-slate-400 mt-2">Try: HEALTH10, LAB20, WELCOME50</p>
        </div>

        <div className="card p-5 space-y-3">
          {[["card", CreditCard, "Card"], ["upi", Smartphone, "UPI"], ["wallet", Wallet, "Wallet"]].map(([k, Icon, l]) => (
            <label key={k} className={`flex items-center gap-3 p-3 rounded-xl border-2 cursor-pointer ${method === k ? "border-primary-500 bg-primary-50" : "border-slate-200"}`}>
              <input type="radio" checked={method === k} onChange={() => setMethod(k)} className="hidden" />
              <Icon size={20} />
              <span className="font-medium text-sm">{l}</span>
            </label>
          ))}

          {method === "card" && (
            <div className="space-y-3 pt-3 border-t">
              <input className="input" placeholder="Card Number (4111 1111 1111 1111)" maxLength={19}
                value={card.number} onChange={(e) => setCard({ ...card, number: e.target.value.replace(/\D/g, "") })} />
              <input className="input" placeholder="Cardholder Name" value={card.name} onChange={(e) => setCard({ ...card, name: e.target.value })} />
              <div className="grid grid-cols-2 gap-3">
                <input className="input" placeholder="MM/YY" maxLength={5} value={card.expiry} onChange={(e) => setCard({ ...card, expiry: e.target.value })} />
                <input className="input" placeholder="CVV" maxLength={4} type="password" value={card.cvv} onChange={(e) => setCard({ ...card, cvv: e.target.value.replace(/\D/g, "") })} />
              </div>
            </div>
          )}

          {method === "upi" && (
            <div className="pt-3 border-t">
              <input className="input" placeholder="yourname@upi" value={upi} onChange={(e) => setUpi(e.target.value)} />
            </div>
          )}

          {method === "wallet" && (
            <div className="pt-3 border-t">
              <input className="input" placeholder="Wallet Mobile Number" maxLength={10}
                value={wallet} onChange={(e) => setWallet(e.target.value.replace(/\D/g, ""))} />
            </div>
          )}

          <button onClick={pay} disabled={processing} className="btn-primary w-full mt-3">
            {processing ? "Processing..." : `Pay ₹${finalAmount.toFixed(2)}`}
          </button>
          <p className="text-xs text-center text-slate-400">🔒 Demo payment - no real transaction</p>
        </div>
      </div>
    </PageWrapper>
  );
}
