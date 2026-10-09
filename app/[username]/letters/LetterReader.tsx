"use client";
import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { ChevronLeft, ChevronRight, Mail } from "lucide-react";

type L = { id: string; senderName: string; content: string; signature: string | null; date: Date | null };

export default function LetterReader({ letters, name }: { letters: L[]; name: string }) {
  const [i, setI] = useState(0);
  if (!letters.length) return <main className="grid min-h-dvh place-items-center px-6 text-center font-serif text-2xl">Aucune lettre pour l'instant, {name}.</main>;
  const l = letters[i];
  const go = (d: number) => setI((n) => Math.min(letters.length - 1, Math.max(0, n + d)));
  const nav = "grid size-12 place-items-center rounded-full border border-line transition active:scale-95 disabled:opacity-30";
  return (
    <main className="flex min-h-dvh flex-col items-center justify-center px-4 py-10">
      <p className="mb-6 text-sm tracking-[.25em] text-muted" aria-live="polite">{i + 1} / {letters.length}</p>
      <AnimatePresence mode="wait">
        <motion.article key={l.id} initial={{ opacity: 0, y: 24, rotate: -1.2 }} animate={{ opacity: 1, y: 0, rotate: 0 }} exit={{ opacity: 0, y: -12 }} transition={{ duration: 0.45 }}
          className="w-full max-w-xl rounded-2xl bg-card p-8 shadow-[0_30px_70px_-35px_rgba(0,0,0,.5)] ring-1 ring-line sm:p-12">
          <p className="flex items-center gap-2 text-sm text-muted"><Mail size={16} className="text-accent" />De {l.senderName}</p>
          <p className="mt-6 whitespace-pre-wrap font-hand text-3xl leading-10">{l.content}</p>
          <p className="mt-8 font-hand text-4xl text-accent">{l.signature ?? `— ${l.senderName}`}</p>
          {l.date && <p className="mt-2 text-sm text-muted">{new Date(l.date).toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" })}</p>}
        </motion.article>
      </AnimatePresence>
      <nav className="mt-8 flex gap-4">
        <button onClick={() => go(-1)} disabled={i === 0} className={nav} aria-label="Lettre précédente"><ChevronLeft /></button>
        <button onClick={() => go(1)} disabled={i === letters.length - 1} className={`${nav} bg-ink text-paper`} aria-label="Lettre suivante"><ChevronRight /></button>
      </nav>
    </main>
  );
}
