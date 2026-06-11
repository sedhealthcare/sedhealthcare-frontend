export default function PremiumBg({ variant = "light" }) {
  if (variant === "dark") {
    return (
      <>
        <div className="absolute inset-0 -z-10"
          style={{ background: "linear-gradient(135deg, #020617 0%, #0c1e3e 30%, #1e1b4b 65%, #0f172a 100%)" }} />
        <div className="absolute -top-40 -right-40 w-[600px] h-[600px] rounded-full opacity-50 pointer-events-none -z-10 orb-pulse"
          style={{ background: "radial-gradient(circle, #10b981 0%, #06b6d4 40%, transparent 70%)", filter: "blur(100px)" }} />
        <div className="absolute -bottom-32 -left-32 w-[480px] h-[480px] rounded-full opacity-55 pointer-events-none -z-10"
          style={{ background: "radial-gradient(circle, #6366f1 0%, #4338ca 50%, transparent 70%)", filter: "blur(90px)" }} />
        <div className="absolute inset-0 opacity-[0.06] pointer-events-none -z-10"
          style={{ backgroundImage: "radial-gradient(circle, #fff 1.2px, transparent 1.2px)", backgroundSize: "32px 32px" }} />
      </>
    );
  }
  return (
    <>
      <div className="absolute inset-0 -z-10"
        style={{ background: "linear-gradient(135deg, #dbeafe 0%, #bae6fd 30%, #c7d2fe 65%, #e0e7ff 100%)" }} />
      <div className="absolute -top-40 -right-40 w-[600px] h-[600px] rounded-full opacity-50 pointer-events-none -z-10 orb-pulse"
        style={{ background: "radial-gradient(circle, #3b82f6 0%, #06b6d4 40%, transparent 70%)", filter: "blur(90px)" }} />
      <div className="absolute -bottom-32 -left-32 w-[480px] h-[480px] rounded-full opacity-45 pointer-events-none -z-10"
        style={{ background: "radial-gradient(circle, #6366f1 0%, #8b5cf6 50%, transparent 70%)", filter: "blur(80px)" }} />
      <div className="absolute inset-0 opacity-[0.04] pointer-events-none -z-10"
        style={{ backgroundImage: "radial-gradient(circle, #1e3a8a 1.5px, transparent 1.5px)", backgroundSize: "32px 32px" }} />
    </>
  );
}
