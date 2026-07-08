import { useEffect, useState } from "react";
import { Clock } from "lucide-react";

function msUntilTunisMidnight(): number {
  // Compute current time in Africa/Tunis and next midnight there
  const now = new Date();
  const fmt = new Intl.DateTimeFormat("en-GB", {
    timeZone: "Africa/Tunis",
    hour12: false,
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
  const parts = fmt.formatToParts(now);
  const get = (t: string) => Number(parts.find((p) => p.type === t)?.value ?? 0);
  const h = get("hour");
  const m = get("minute");
  const s = get("second");
  const elapsed = ((h * 60 + m) * 60 + s) * 1000;
  const dayMs = 24 * 60 * 60 * 1000;
  return dayMs - elapsed;
}

function fmt(ms: number) {
  const total = Math.max(0, Math.floor(ms / 1000));
  const h = Math.floor(total / 3600);
  const m = Math.floor((total % 3600) / 60);
  const s = total % 60;
  const pad = (n: number) => n.toString().padStart(2, "0");
  return { h: pad(h), m: pad(m), s: pad(s) };
}

export function PromoCountdown() {
  const [ms, setMs] = useState<number>(() => msUntilTunisMidnight());

  useEffect(() => {
    const id = window.setInterval(() => {
      setMs((prev) => (prev <= 1000 ? msUntilTunisMidnight() : prev - 1000));
    }, 1000);
    return () => window.clearInterval(id);
  }, []);

  const { h, m, s } = fmt(ms);

  return (
    <div className="inline-flex items-center gap-2 rounded-full bg-black/25 px-3 py-1.5 text-white backdrop-blur">
      <Clock className="h-4 w-4" />
      <span className="text-[11px] font-semibold uppercase tracking-wider opacity-90">
        Fin dans
      </span>
      <span className="flex items-center gap-1 font-mono text-sm font-bold tabular-nums">
        <TimeCell>{h}</TimeCell>
        <span className="opacity-60">:</span>
        <TimeCell>{m}</TimeCell>
        <span className="opacity-60">:</span>
        <TimeCell>{s}</TimeCell>
      </span>
    </div>
  );
}

function TimeCell({ children }: { children: React.ReactNode }) {
  return (
    <span className="rounded-md bg-white/15 px-1.5 py-0.5 text-white shadow-inner">
      {children}
    </span>
  );
}
