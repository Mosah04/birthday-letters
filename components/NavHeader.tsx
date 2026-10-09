"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { Mail, Volume2, VolumeX, Sparkles, User, ArrowRight } from "lucide-react";
import { sounds } from "@/lib/sound";

interface NavHeaderProps {
  user?: {
    name?: string | null;
    image?: string | null;
  } | null;
}

export default function NavHeader({ user }: NavHeaderProps) {
  const [soundOn, setSoundOn] = useState(true);

  useEffect(() => {
    sounds.enabled = soundOn;
  }, [soundOn]);

  const toggleSound = () => {
    setSoundOn(!soundOn);
    if (!soundOn) {
      setTimeout(() => sounds.chime(), 50);
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full backdrop-blur-md bg-paper/85 border-b border-line/60 transition-colors">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
        {/* Brand */}
        <Link
          href="/"
          onClick={() => sounds.click()}
          className="group flex items-center gap-2.5 font-serif text-lg tracking-tight text-ink"
        >
          <span className="relative grid size-9 place-items-center rounded-full bg-accent/10 border border-accent/25 text-accent transition-transform group-hover:scale-105 group-hover:rotate-6">
            <Mail size={18} />
            <span className="absolute -top-0.5 -right-0.5 size-2 rounded-full bg-wax animate-pulse" />
          </span>
          <span className="font-semibold">
            Birthday<span className="font-serif italic text-accent font-normal ml-1">Letters</span>
          </span>
        </Link>

        {/* Right Actions */}
        <div className="flex items-center gap-3">
          {/* Sound Toggle */}
          <button
            onClick={toggleSound}
            aria-label={soundOn ? "Désactiver les effets sonores" : "Activer les effets sonores"}
            title={soundOn ? "Effets sonores tactiles actifs" : "Muet"}
            className="grid size-9 place-items-center rounded-full border border-line bg-card/60 text-muted transition hover:text-ink hover:border-line-strong active:scale-95"
          >
            {soundOn ? <Volume2 size={16} className="text-accent" /> : <VolumeX size={16} />}
          </button>

          {/* User / CTA */}
          {user ? (
            <Link
              href="/dashboard"
              onClick={() => sounds.click()}
              className="flex items-center gap-2 rounded-full border border-line bg-card px-4 py-1.5 text-sm font-medium shadow-sm transition hover:border-accent hover:shadow active:scale-95"
            >
              {user.image ? (
                <img src={user.image} alt="" className="size-5 rounded-full object-cover" />
              ) : (
                <User size={15} className="text-accent" />
              )}
              <span>Mon espace</span>
            </Link>
          ) : (
            <div className="flex items-center gap-2">
              <Link
                href="/auth"
                onClick={() => sounds.click()}
                className="hidden sm:inline-flex rounded-full border border-line px-4 py-1.5 text-sm font-medium text-muted hover:text-ink hover:bg-card transition"
              >
                Connexion
              </Link>
              <Link
                href="/auth"
                onClick={() => sounds.click()}
                className="group inline-flex items-center gap-1.5 rounded-full bg-ink px-4 py-1.5 text-sm font-medium text-paper shadow-sm transition hover:bg-accent active:scale-95"
              >
                <span>Créer ma capsule</span>
                <ArrowRight size={14} className="transition group-hover:translate-x-0.5" />
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
