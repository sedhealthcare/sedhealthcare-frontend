import { useEffect, useState } from "react";

export default function Counter({ to = 100, duration = 1200 }) {
  const [n, setN] = useState(0);
  useEffect(() => {
    let s = 0;
    const step = Math.max(1, Math.floor(to / (duration / 16)));
    const id = setInterval(() => {
      s += step;
      if (s >= to) { setN(to); clearInterval(id); } else setN(s);
    }, 16);
    return () => clearInterval(id);
  }, [to, duration]);
  return <span>{n.toLocaleString()}</span>;
}
