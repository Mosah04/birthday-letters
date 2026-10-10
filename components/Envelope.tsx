"use client";
import { useState } from "react";
import { Heart, Sparkles, Lock, Star, Feather } from "lucide-react";

interface EnvelopeProps {
  className?: string;
  recipientName?: string;
  sealColor?: "wax" | "gold" | "emerald" | "navy";
  sealIcon?: "heart" | "star" | "lock" | "feather";
  subtitle?: string;
  interactive?: boolean;
}

const SEAL_ICONS = {
  heart: Heart,
  star: Star,
  lock: Lock,
  feather: Feather,
} as const;

export default function Envelope({
  className = "",
  recipientName,
  sealColor = "wax",
  sealIcon = "heart",
  subtitle = "Scellée jusqu'à minuit",
  interactive = true,
}: EnvelopeProps) {
  const [rotate, setRotate] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!interactive) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    setRotate({
      x: -y * 0.08,
      y: x * 0.08,
    });
  };

  const handleMouseLeave = () => {
    setRotate({ x: 0, y: 0 });
    setIsHovered(false);
  };

  const getSealBackground = () => {
    switch (sealColor) {
      case "gold":
        return "bg-gradient-to-br from-[#dfb26b] via-[#c9933e] to-[#996515] text-[#2d1f05] shadow-[0_4px_16px_rgba(201,147,62,0.45)]";
      case "emerald":
        return "bg-gradient-to-br from-[#2d6a4f] via-[#1b4332] to-[#081c15] text-[#d8f3dc] shadow-[0_4px_16px_rgba(45,106,79,0.45)]";
      case "navy":
        return "bg-gradient-to-br from-[#2c3e6b] via-[#1a2647] to-[#0d1326] text-[#e0e7ff] shadow-[0_4px_16px_rgba(44,62,107,0.45)]";
      default:
        return "bg-gradient-to-br from-[#c74b32] via-[#a83622] to-[#781f10] text-[#fff5f2] shadow-[0_4px_18px_rgba(168,54,34,0.5)]";
    }
  };

  const SealIcon = SEAL_ICONS[sealIcon];

  return (
    <div
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      style={{
        transform: interactive
          ? `perspective(800px) rotateX(${rotate.x}deg) rotateY(${rotate.y}deg) scale(${isHovered ? 1.02 : 1})`
          : undefined,
        transition: isHovered ? "transform 0.12s ease-out" : "transform 0.6s cubic-bezier(0.2, 0.8, 0.2, 1)",
      }}
      className={`relative aspect-[3/2] w-72 sm:w-80 select-none group cursor-pointer ${className}`}
      aria-label="Enveloppe scellée par sceau de cire"
    >
      {/* Soft atmospheric backlight halo */}
      <div className="absolute -inset-2 rounded-2xl bg-gradient-to-b from-accent/20 to-gold/15 blur-xl opacity-75 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />

      {/* Envelope Body */}
      <div className="absolute inset-0 rounded-2xl bg-card border border-line shadow-[0_25px_60px_-15px_rgba(0,0,0,0.18),0_10px_25px_-5px_rgba(0,0,0,0.1)] overflow-hidden">
        {/* Paper texture overlay */}
        <div className="absolute inset-0 opacity-40 bg-[radial-gradient(#1a1615_0.75px,transparent_0.75px)] [background-size:12px_12px] dark:opacity-20" />

        {/* Vintage Postmark Stamp Top Right */}
        <div className="absolute top-3.5 right-3.5 flex items-center gap-1.5 rounded-full border border-line px-2.5 py-1 text-[10px] uppercase tracking-wider font-mono text-muted/80 backdrop-blur-sm bg-card/60">
          <Sparkles size={11} className="text-gold" />
          <span>Poste Magique</span>
          <span className="font-semibold text-accent">00:00</span>
        </div>

        {/* Left Postmark Wave */}
        <div className="absolute top-4 right-32 hidden sm:flex flex-col gap-0.5 opacity-30">
          <div className="h-0.5 w-12 rounded-full bg-muted" />
          <div className="h-0.5 w-14 rounded-full bg-muted" />
          <div className="h-0.5 w-10 rounded-full bg-muted" />
        </div>

        {/* Lower Left Delicate Label */}
        {recipientName && (
          <div className="absolute bottom-4 left-4 text-left">
            <span className="text-[10px] tracking-widest uppercase text-muted block font-sans">Destinataire</span>
            <span className="font-serif italic text-base text-ink font-medium tracking-tight">Pour {recipientName}</span>
          </div>
        )}

        {/* Flap Triangles (Artisan Origami) */}
        {/* Bottom flap */}
        <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-[var(--paper-subtle)]/70 to-transparent [clip-path:polygon(0_100%,50%_40%,100%_100%)] opacity-70" />
        {/* Left flap */}
        <div className="absolute inset-y-0 left-0 w-1/2 bg-gradient-to-r from-[var(--paper-subtle)]/40 to-transparent [clip-path:polygon(0_0,45%_50%,0_100%)] opacity-50" />
        {/* Right flap */}
        <div className="absolute inset-y-0 right-0 w-1/2 bg-gradient-to-l from-[var(--paper-subtle)]/40 to-transparent [clip-path:polygon(100%_0,55%_50%,100%_100%)] opacity-50" />

        {/* Top Fold Triangle */}
        <div className="absolute inset-x-0 top-0 h-[62%] bg-gradient-to-b from-card via-[var(--paper-subtle)]/60 to-[var(--paper-subtle)] [clip-path:polygon(0_0,100%_0,50%_100%)] border-b border-line shadow-sm" />
      </div>

      {/* Authentic Wax Seal (Center) */}
      <div className="absolute left-1/2 top-[58%] -translate-x-1/2 -translate-y-1/2 z-10">
        <div
          className={`relative grid size-14 place-items-center rounded-full transition-transform duration-300 group-hover:scale-110 ${getSealBackground()}`}
        >
          {/* Inner Seal Border Ring with notches */}
          <div className="absolute inset-1 rounded-full border border-white/30 border-dashed opacity-80" />
          
          {/* Seal Highlight sheen */}
          <div className="absolute top-1.5 left-2 size-3.5 rounded-full bg-white/35 blur-[1px]" />
          
          {/* Embossed Wax Edge Texture */}
          <div className="absolute -inset-1 rounded-full border-2 border-black/15 pointer-events-none" />

          {/* Icon */}
          <div className="relative z-10 transition-transform duration-300 group-hover:rotate-6">
            <SealIcon
              size={sealIcon === "lock" ? 16 : sealIcon === "feather" ? 17 : 18}
              fill={sealIcon === "heart" || sealIcon === "star" ? "currentColor" : "none"}
            />
          </div>
        </div>

        {/* Floating status tag under wax seal */}
        <div className="mt-2 -translate-x-1/2 left-1/2 absolute whitespace-nowrap rounded-full bg-ink/90 dark:bg-card/90 border border-line px-2.5 py-0.5 text-[10px] tracking-wide text-paper dark:text-ink shadow-md font-sans">
          {subtitle}
        </div>
      </div>
    </div>
  );
}
