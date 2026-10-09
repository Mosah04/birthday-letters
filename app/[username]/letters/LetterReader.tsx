"use client";
import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";

type L = { id: string; senderName: string; content: string; signature: string | null; date: Date | null };

export default function LetterReader({ letters, name }: { letters: L[]; name: string }) {
  const [i, setI] = useState(0);
  if (!letters.length) return <main className="min-h-dvh grid place-items-center bg-[#FAF6EF] font-serif text-xl">Aucune lettre pour l&apos;instant, {name}.</main>;
  const l = letters[i];
  const go = (d: number) => setI((n) => Math.min(letters.length - 1, Math.max(0, n + d)));
  return (
    <main className="min-h-dvh bg-[#FAF6EF] px-4 py-10 flex flex-col items-center justify-center">
      <p className="mb-6 text-sm tracking-widest text-[#6B6257]" aria-live="polite">{i + 1} / {letters.length}</p>
      <AnimatePresence mode="wait">
        <motion.article key={l.id} initial={{ opacity: 0, y: 20, rotate: -1 }} animate={{ opacity: 1, y: 0, rotate: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.4 }}
          className="w-full max-w-xl bg-[#FFFDF8] ring-1 ring-black/5 shadow-[0_30px_60px_-30px_rgba(60,40,20,.4)] p-8 sm:p-12">
          <p className="font-serif italic text-[#6B6257]">💌 De {l.senderName}</p>
          <p className="mt-6 whitespace-pre-wrap font-serif text-lg leading-8">{l.content}</p>
          <p className="mt-8 font-serif italic text-xl">{l.signature ?? `— ${l.senderName}`}</p>
          {l.date && <p className="mt-1 text-sm text-[#6B6257]">{new Date(l.date).toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" })}</p>}
        </motion.article>
      </AnimatePresence>
      <nav className="mt-8 flex gap-4">
        <button onClick={() => go(-1)} disabled={i === 0} className="h-12 px-6 rounded-full border border-black/15 disabled:opacity-30">Précédente</button>
        <button onClick={() => go(1)} disabled={i === letters.length - 1} className="h-12 px-6 rounded-full bg-[#1F1B16] text-[#FAF6EF] disabled:opacity-30">Suivante</button>
      </nav>
    </main>
  );
}
