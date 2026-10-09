import { Heart } from "lucide-react";

export default function Envelope({ className = "" }: { className?: string }) {
  return (
    <div className={`relative aspect-[3/2] w-64 ${className}`} aria-hidden>
      <div className="absolute inset-0 rounded-xl bg-card ring-1 ring-line shadow-[0_30px_60px_-25px_rgba(0,0,0,.4)]" />
      <div className="absolute inset-x-0 top-0 h-[64%] rounded-t-xl bg-line [clip-path:polygon(0_0,100%_0,50%_100%)]" />
      <div className="absolute left-1/2 top-[56%] grid size-12 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-accent text-paper shadow-lg">
        <Heart size={20} fill="currentColor" />
      </div>
    </div>
  );
}
