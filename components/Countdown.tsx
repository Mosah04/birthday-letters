"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Clock } from "lucide-react";

export default function Countdown({
  to,
  size = "normal",
}: {
  to: string;
  size?: "normal" | "compact";
}) {
  const router = useRouter();
  const [left, setLeft] = useState<number | null>(null);

  useEffect(() => {
    const t = new Date(to).getTime();
    const tick = () => {
      const ms = t - Date.now();
      setLeft(Math.max(0, ms));
      if (ms <= 0) router.refresh();
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [to, router]);

  if (left === null) {
    return (
      <div className="flex justify-center items-center gap-3 py-4 animate-pulse">
        <div className="h-12 w-16 rounded-xl bg-card border border-line" />
        <div className="h-12 w-16 rounded-xl bg-card border border-line" />
        <div className="h-12 w-16 rounded-xl bg-card border border-line" />
        <div className="h-12 w-16 rounded-xl bg-card border border-line" />
      </div>
    );
  }

  const s = Math.floor(left / 1000);
  const days = Math.floor(s / 86400);
  const hours = Math.floor(s / 3600) % 24;
  const minutes = Math.floor(s / 60) % 60;
  const seconds = s % 60;

  const parts = [
    { label: "Jours", value: days },
    { label: "Heures", value: hours },
    { label: "Minutes", value: minutes },
    { label: "Secondes", value: seconds },
  ];

  if (size === "compact") {
    return (
      <div
        className="inline-flex items-center gap-2 rounded-full border border-line bg-card/80 px-4 py-1.5 text-xs font-mono backdrop-blur-md shadow-sm"
        role="timer"
      >
        <Clock size={13} className="text-accent animate-pulse" />
        <span>
          {days}j {String(hours).padStart(2, "0")}h {String(minutes).padStart(2, "0")}m {String(seconds).padStart(2, "0")}s
        </span>
      </div>
    );
  }

  return (
    <div
      className="flex flex-wrap justify-center items-center gap-2 sm:gap-4 font-sans select-none"
      role="timer"
      aria-label="Temps restant avant l'ouverture de la capsule"
    >
      {parts.map((item, idx) => (
        <div key={item.label} className="flex items-center">
          <div className="group relative flex min-w-[4.25rem] sm:min-w-[5.25rem] flex-col items-center justify-center rounded-2xl border border-line bg-card/90 px-3 py-3 shadow-[0_8px_20px_-6px_rgba(0,0,0,0.06)] backdrop-blur-sm transition-transform hover:-translate-y-0.5">
            {/* Top gold indicator line */}
            <div className="absolute top-0 inset-x-4 h-[2px] rounded-full bg-gradient-to-r from-transparent via-gold/40 to-transparent" />
            
            <span className="font-serif text-3xl sm:text-4xl font-semibold tracking-tight tabular-nums text-ink">
              {String(item.value).padStart(2, "0")}
            </span>
            <span className="mt-1 text-[10px] sm:text-xs font-medium uppercase tracking-wider text-muted">
              {item.label}
            </span>
          </div>

          {/* Separator dots */}
          {idx < parts.length - 1 && (
            <span className="mx-1 sm:mx-1.5 text-lg font-serif font-light text-muted/50 hidden xs:inline-block">
              :
            </span>
          )}
        </div>
      ))}
    </div>
  );
}
