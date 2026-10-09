"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function Countdown({ to }: { to: string }) {
  const router = useRouter();
  const [left, setLeft] = useState<number | null>(null);
  useEffect(() => {
    const t = new Date(to).getTime();
    const tick = () => {
      const ms = t - Date.now();
      setLeft(Math.max(0, ms));
      if (ms <= 0) router.refresh(); // le serveur re-vérifie la date
    };
    tick(); const id = setInterval(tick, 1000); return () => clearInterval(id);
  }, [to, router]);
  if (left === null) return <div className="h-16" aria-hidden />;
  const s = Math.floor(left / 1000);
  const parts = [["jours", Math.floor(s / 86400)], ["h", Math.floor(s / 3600) % 24], ["min", Math.floor(s / 60) % 60], ["s", s % 60]] as const;
  return (
    <div className="flex justify-center gap-5 font-serif" role="timer" aria-label="Temps restant avant l'ouverture">
      {parts.map(([u, v]) => (
        <div key={u} className="min-w-12"><div className="text-4xl tabular-nums">{String(v).padStart(2, "0")}</div><div className="text-xs text-[#6B6257]">{u}</div></div>
      ))}
    </div>
  );
}
