"use client";
import { useState, useEffect } from "react";
import { AnimatePresence, motion } from "motion/react";
import {
  ChevronLeft,
  ChevronRight,
  Mail,
  Sparkles,
  Heart,
  ArrowLeft,
  Printer,
  Calendar,
  LockOpen,
} from "lucide-react";
import Link from "next/link";
import { sounds } from "@/lib/sound";

type L = {
  id: string;
  senderName: string;
  content: string;
  signature: string | null;
  date: Date | null;
};

export default function LetterReader({
  letters,
  name,
}: {
  letters: L[];
  name: string;
}) {
  const [i, setI] = useState(0);
  const [unsealedIds, setUnsealedIds] = useState<Record<string, boolean>>({});

  const go = (d: number) => {
    sounds.rustle();
    setI((n) => Math.min(letters.length - 1, Math.max(0, n + d)));
  };

  useEffect(() => {
    // Keyboard navigation
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") go(-1);
      if (e.key === "ArrowRight") go(1);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [i, letters.length]);

  if (!letters.length) {
    return (
      <main className="grid min-h-dvh place-items-center px-6 text-center font-serif text-2xl text-ink">
        <div className="space-y-4">
          <p>Aucune lettre n&apos;a été trouvée dans ta capsule, {name}.</p>
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 text-sm font-sans font-medium text-accent underline"
          >
            Retourner à mon tableau de bord
          </Link>
        </div>
      </main>
    );
  }

  const l = letters[i];
  const isUnsealed = unsealedIds[l.id] ?? false;

  const handleBreakSeal = (letterId: string) => {
    sounds.waxCrack();
    setTimeout(() => sounds.chime(), 100);
    setUnsealedIds((prev) => ({ ...prev, [letterId]: true }));
  };

  const navBtn =
    "grid size-12 place-items-center rounded-full border border-line bg-card shadow-sm transition hover:border-line-strong active:scale-95 disabled:opacity-30";

  return (
    <main className="flex min-h-dvh flex-col items-center justify-between px-4 py-8 relative selection:bg-accent/20">
      {/* Top Header */}
      <header className="w-full max-w-2xl flex items-center justify-between py-2 border-b border-line/60">
        <Link
          href="/dashboard"
          onClick={() => sounds.click()}
          className="inline-flex items-center gap-1.5 text-xs font-medium text-muted hover:text-ink transition"
        >
          <ArrowLeft size={14} />
          <span>Mon espace</span>
        </Link>

        {/* Counter */}
        <div className="flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-muted">
          <Sparkles size={13} className="text-gold" />
          <span>
            Lettre {i + 1} / {letters.length}
          </span>
        </div>

        <button
          onClick={() => window.print()}
          className="inline-flex items-center gap-1 text-xs text-muted hover:text-ink transition"
          title="Imprimer cette lettre"
        >
          <Printer size={14} />
          <span className="hidden sm:inline">Imprimer</span>
        </button>
      </header>

      {/* Main Letter Card Area */}
      <div className="my-auto w-full max-w-xl py-6 flex flex-col items-center">
        <AnimatePresence mode="wait">
          {!isUnsealed ? (
            /* SEALED ENVELOPE CEREMONY */
            <motion.div
              key={`sealed-${l.id}`}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.05 }}
              transition={{ duration: 0.4 }}
              className="w-full text-center space-y-6"
            >
              <div className="mx-auto rounded-3xl border border-line bg-card p-8 sm:p-12 shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 -mt-8 -mr-8 size-32 rounded-full bg-wax/10 blur-xl pointer-events-none" />

                <span className="text-xs uppercase font-mono tracking-widest text-muted block mb-3">
                  Lettre scellée #{i + 1}
                </span>

                <h2 className="font-serif text-3xl sm:text-4xl text-ink font-medium">
                  Un mot secret de <span className="text-accent">{l.senderName}</span>
                </h2>

                <p className="mt-3 text-sm text-muted max-w-sm mx-auto">
                  Cette lettre est restée scellée jusqu&apos;à aujourd&apos;hui. Brise le sceau pour découvrir ses mots.
                </p>

                {/* Interactive Wax Seal to Click */}
                <div className="mt-8 flex justify-center">
                  <button
                    onClick={() => handleBreakSeal(l.id)}
                    className="group relative flex flex-col items-center gap-3 focus:outline-none"
                  >
                    <div className="grid size-20 place-items-center rounded-full bg-gradient-to-br from-[#c74b32] via-[#a83622] to-[#781f10] text-[#fff5f2] shadow-[0_8px_30px_rgba(168,54,34,0.45)] transition-transform group-hover:scale-110 active:scale-95 wax-pulse">
                      <Heart size={26} fill="currentColor" className="transition group-hover:scale-125" />
                    </div>
                    <span className="text-xs font-semibold text-accent flex items-center gap-1 group-hover:underline">
                      <LockOpen size={13} />
                      <span>Cliquer pour briser le sceau</span>
                    </span>
                  </button>
                </div>
              </div>
            </motion.div>
          ) : (
            /* OPENED UNSEALED LETTER */
            <motion.article
              key={`open-${l.id}`}
              initial={{ opacity: 0, y: 30, rotate: -1 }}
              animate={{ opacity: 1, y: 0, rotate: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
              className="w-full rounded-3xl border border-line bg-card p-8 sm:p-14 shadow-[0_30px_80px_-30px_rgba(0,0,0,0.18)] relative overflow-hidden"
            >
              {/* Top Watermark */}
              <div className="flex items-center justify-between pb-6 mb-6 border-b border-line/60 text-xs text-muted">
                <span className="flex items-center gap-1.5 font-sans font-medium text-ink">
                  <Mail size={15} className="text-accent" />
                  <span>De {l.senderName}</span>
                </span>
                {l.date && (
                  <span className="flex items-center gap-1 font-mono text-[11px]">
                    <Calendar size={12} />
                    <span>
                      {new Date(l.date).toLocaleDateString("fr-FR", {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      })}
                    </span>
                  </span>
                )}
              </div>

              {/* Letter Greeting */}
              <p className="font-hand text-3xl sm:text-4xl text-muted/80 mb-6">
                Cher·e {name},
              </p>

              {/* Letter Content */}
              <div className="whitespace-pre-wrap font-hand text-2xl sm:text-3xl leading-relaxed text-ink/90 paper-texture">
                {l.content}
              </div>

              {/* Signature */}
              <div className="mt-10 pt-6 border-t border-line/50 text-right">
                <p className="font-hand text-3xl sm:text-4xl text-accent font-medium">
                  {l.signature ?? `— ${l.senderName}`}
                </p>
              </div>
            </motion.article>
          )}
        </AnimatePresence>
      </div>

      {/* Bottom Navigation */}
      <footer className="w-full max-w-xl flex items-center justify-between pt-4">
        <button
          onClick={() => go(-1)}
          disabled={i === 0}
          className={navBtn}
          aria-label="Lettre précédente"
        >
          <ChevronLeft size={20} />
        </button>

        {/* Dots indicators */}
        <div className="flex items-center gap-1.5">
          {letters.map((_, idx) => (
            <button
              key={idx}
              onClick={() => {
                sounds.rustle();
                setI(idx);
              }}
              className={`size-2.5 rounded-full transition-all ${idx === i
                  ? "bg-accent w-6"
                  : "bg-line hover:bg-muted"
                }`}
              aria-label={`Aller à la lettre ${idx + 1}`}
            />
          ))}
        </div>

        <button
          onClick={() => go(1)}
          disabled={i === letters.length - 1}
          className={`${navBtn} bg-ink text-paper hover:bg-accent`}
          aria-label="Lettre suivante"
        >
          <ChevronRight size={20} />
        </button>
      </footer>
    </main>
  );
}
