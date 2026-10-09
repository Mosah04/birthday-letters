"use client";
import { useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { ArrowLeft, CalendarDays, Check, Loader2, Send } from "lucide-react";
import Envelope from "@/components/Envelope";

type Step = "envelope" | "write" | "sending" | "sent";
const LINES = "[background-image:repeating-linear-gradient(transparent,transparent_35px,var(--line)_35px,var(--line)_36px)]";
const fmt = (d: Date) => d.toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" });

export default function LetterEditor({ slug, name, unlockAt }: { slug: string; name: string; unlockAt: string }) {
  const reduce = useReducedMotion();
  const [step, setStep] = useState<Step>("envelope");
  const [f, setF] = useState({ senderName: "", content: "", signature: "", showDate: true, website: "" });
  const [err, setErr] = useState<string | null>(null);
  const set = (k: keyof typeof f, v: string | boolean) => setF((s) => ({ ...s, [k]: v }));
  const ok = f.senderName.trim() && f.content.trim();

  async function send() {
    setErr(null); setStep("sending");
    const res = await fetch("/api/letters", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ slug, ...f, signature: f.signature || undefined }) });
    if (res.ok) return setStep("sent");
    setErr(res.status === 429 ? "Vous avez déjà écrit plusieurs lettres. Réessayez dans un moment." : "Une erreur est survenue. Votre texte est conservé, réessayez.");
    setStep("write");
  }
  const fade = { initial: { opacity: 0, y: reduce ? 0 : 18 }, animate: { opacity: 1, y: 0 }, exit: { opacity: 0, y: reduce ? 0 : -12 }, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] as const } };

  return (
    <main className="flex min-h-dvh items-center justify-center px-4 py-8">
      <AnimatePresence mode="wait">
        {step === "envelope" && (
          <motion.section key="env" {...fade} className="flex max-w-sm flex-col items-center text-center">
            <Envelope className="float" />
            <h1 className="mt-12 font-serif text-4xl leading-tight">Une lettre pour <em className="text-accent">{name}</em></h1>
            <p className="mt-3 text-muted">Elle restera scellée jusqu'au {fmt(new Date(unlockAt))}.</p>
            <button onClick={() => setStep("write")} className="mt-8 inline-flex h-14 items-center gap-2 rounded-full bg-ink px-8 text-paper shadow-lg transition active:scale-95">Commencer à écrire</button>
          </motion.section>
        )}

        {(step === "write" || step === "sending") && (
          <motion.section key="write" {...fade} className="relative w-full max-w-xl">
            <button onClick={() => setStep("envelope")} className="mb-4 inline-flex items-center gap-1.5 text-sm text-muted hover:text-ink"><ArrowLeft size={16} />Retour</button>
            <div className="rounded-2xl bg-card p-6 shadow-[0_30px_70px_-35px_rgba(0,0,0,.5)] ring-1 ring-line sm:p-10">
              <p className="font-hand text-3xl text-muted">Cher·e {name},</p>
              <label className="sr-only" htmlFor="content">Votre lettre</label>
              <textarea id="content" autoFocus rows={9} maxLength={5000} value={f.content} onChange={(e) => set("content", e.target.value)} placeholder="Écrivez ce que vous avez sur le cœur…"
                className={`mt-2 w-full resize-none bg-transparent font-hand text-2xl leading-9 caret-[var(--accent)] outline-none placeholder:text-muted/60 ${LINES}`} />
              <input value={f.signature} onChange={(e) => set("signature", e.target.value)} maxLength={120} aria-label="Signature" placeholder="Avec tout mon amour,"
                className="mt-4 w-full bg-transparent font-hand text-3xl text-accent outline-none placeholder:text-accent/50" />
              <div className="mt-6 flex flex-col gap-4 border-t border-line pt-6 sm:flex-row sm:items-center">
                <input value={f.senderName} onChange={(e) => set("senderName", e.target.value)} maxLength={60} required placeholder="Votre nom" aria-label="Votre nom"
                  className="h-12 flex-1 rounded-xl border border-line bg-paper px-4 outline-none focus:border-accent" />
                <button type="button" role="switch" aria-checked={f.showDate} onClick={() => set("showDate", !f.showDate)} className="flex items-center gap-3 text-sm text-muted">
                  <span className={`relative h-6 w-10 rounded-full transition ${f.showDate ? "bg-accent" : "bg-line"}`}><span className={`absolute top-0.5 size-5 rounded-full bg-white transition-all ${f.showDate ? "left-[1.1rem]" : "left-0.5"}`} /></span>
                  <CalendarDays size={16} />{f.showDate ? fmt(new Date()) : "Sans date"}
                </button>
              </div>
              <input tabIndex={-1} autoComplete="off" aria-hidden value={f.website} onChange={(e) => set("website", e.target.value)} className="absolute left-[-9999px]" />
              {err && <p role="alert" className="mt-4 text-sm text-red-600 dark:text-red-400">{err}</p>}
            </div>
            <button disabled={!ok || step === "sending"} onClick={send} className="mt-6 inline-flex h-14 w-full items-center justify-center gap-2 rounded-full bg-ink text-paper shadow-lg transition active:scale-[.98] disabled:opacity-40">
              {step === "sending" ? <><Loader2 size={18} className="animate-spin" />Mise sous enveloppe…</> : <><Send size={18} />Déposer la lettre</>}
            </button>
          </motion.section>
        )}

        {step === "sent" && (
          <motion.section key="sent" {...fade} className="flex max-w-sm flex-col items-center text-center">
            <motion.div initial={{ scale: 0.5, rotate: -10 }} animate={{ scale: 1, rotate: 0 }} transition={{ type: "spring", stiffness: 180, damping: 14 }} className="grid size-20 place-items-center rounded-full bg-accent text-paper"><Check size={36} /></motion.div>
            <h1 className="mt-8 font-serif text-4xl">Lettre déposée</h1>
            <p className="mt-3 text-muted">Elle est dans la capsule. {name} ne pourra la lire que le {fmt(new Date(unlockAt))}.</p>
            <a href={`/${slug}`} className="mt-8 text-accent underline underline-offset-4">Retour à la page de {name}</a>
          </motion.section>
        )}
      </AnimatePresence>
    </main>
  );
}
