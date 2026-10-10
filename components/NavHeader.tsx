"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import NextImage from "next/image";
import {
  ArrowRight,
  Mail,
  Menu,
  User,
  Volume2,
  VolumeX,
  X,
} from "lucide-react";
import { sounds } from "@/lib/sound";
import ThemeToggle from "@/components/ThemeToggle";

interface NavHeaderProps {
  user?: {
    name?: string | null;
    image?: string | null;
  } | null;
}

export default function NavHeader({ user }: NavHeaderProps) {
  const [soundOn, setSoundOn] = useState(true);
  const [menuOpen, setMenuOpen] = useState(false);

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
      <div className="relative mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-3 px-4 py-3 sm:px-6 sm:py-4">
        {/* Brand */}
        <Link
          href="/"
          onClick={() => sounds.click()}
          className="group flex min-w-0 items-center gap-2.5 font-serif text-lg tracking-tight text-ink"
        >
          <span className="relative grid size-9 shrink-0 place-items-center rounded-full bg-accent/10 border border-accent/25 text-accent transition-transform group-hover:scale-105 group-hover:rotate-6">
            <Mail size={18} />
            <span className="absolute -top-0.5 -right-0.5 size-2 rounded-full bg-wax animate-pulse" />
          </span>
          <span className="truncate font-semibold">
            Birthday<span className="font-serif italic text-accent font-normal ml-1">Letters</span>
          </span>
        </Link>

        {/* Right Actions */}
        <div className="hidden items-center gap-3 sm:flex">
          <ThemeToggle />

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
                <NextImage
                  src={user.image}
                  alt=""
                  width={20}
                  height={20}
                  unoptimized
                  className="size-5 rounded-full object-cover"
                />
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

        <button
          type="button"
          aria-label={menuOpen ? "Fermer le menu" : "Ouvrir le menu"}
          aria-expanded={menuOpen}
          aria-controls="mobile-navigation"
          onClick={() => setMenuOpen((open) => !open)}
          className="grid size-10 shrink-0 place-items-center rounded-full border border-line bg-card/80 text-ink shadow-sm transition hover:border-line-strong active:scale-95 sm:hidden"
        >
          {menuOpen ? <X size={19} /> : <Menu size={19} />}
        </button>

        {menuOpen && (
          <nav
            id="mobile-navigation"
            aria-label="Navigation mobile"
            className="absolute inset-x-4 top-full z-50 rounded-2xl border border-line bg-card p-3 shadow-xl sm:hidden"
          >
            <div className="flex items-center gap-2 border-b border-line px-2 pb-3">
              <ThemeToggle />
              <button
                onClick={toggleSound}
                aria-label={soundOn ? "Désactiver les effets sonores" : "Activer les effets sonores"}
                className="grid size-9 place-items-center rounded-full border border-line bg-card text-muted transition hover:text-ink"
              >
                {soundOn ? <Volume2 size={16} className="text-accent" /> : <VolumeX size={16} />}
              </button>
              <span className="text-xs text-muted">
                {soundOn ? "Sons activés" : "Sons désactivés"}
              </span>
            </div>

            {user ? (
              <Link
                href="/dashboard"
                onClick={() => {
                  sounds.click();
                  setMenuOpen(false);
                }}
                className="mt-2 flex h-11 items-center gap-2 rounded-xl px-3 text-sm font-medium text-ink transition hover:bg-paper"
              >
                {user.image ? (
                  <NextImage
                    src={user.image}
                    alt=""
                    width={20}
                    height={20}
                    unoptimized
                    className="size-5 rounded-full object-cover"
                  />
                ) : (
                  <User size={15} className="text-accent" />
                )}
                <span>Mon espace</span>
              </Link>
            ) : (
              <div className="mt-2 grid gap-2">
                <Link
                  href="/auth"
                  onClick={() => {
                    sounds.click();
                    setMenuOpen(false);
                  }}
                  className="flex h-11 items-center rounded-xl px-3 text-sm font-medium text-muted transition hover:bg-paper hover:text-ink"
                >
                  Connexion
                </Link>
                <Link
                  href="/auth"
                  onClick={() => {
                    sounds.click();
                    setMenuOpen(false);
                  }}
                  className="group flex h-11 items-center justify-center gap-2 rounded-xl bg-ink px-3 text-sm font-medium text-paper transition hover:bg-accent"
                >
                  <span>Créer ma capsule</span>
                  <ArrowRight size={15} className="transition group-hover:translate-x-0.5" />
                </Link>
              </div>
            )}
          </nav>
        )}
      </div>
    </header>
  );
}
