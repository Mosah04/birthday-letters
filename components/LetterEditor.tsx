"use client";
import { useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";

type Step = "envelope" | "write" | "sending" | "sent";
const SIGS = [
  { id: "serif", label: "Classique", cls: "font-serif italic" },
  { id: "script", label: "Manuscrite", cls: "font-[family-name:var(--font-script)]" },
  { id: "plain", label: "Simple", cls: "font-sans" },
] as const;

export default function LetterEditor({ slug, name, unlockAt }: { slug: string; name: string; unlockAt: string }) {
  const reduce = useReducedMotion();
  const [step, setStep] = useState<Step>("envelope");
  const [f, setF] = useState({ senderName: "", content: "", signature: "", showDate: true, website: "" });
  const [sig, setSig] = useState<(typeof SIGS)[number]["id"]>("serif");
  const [err, setErr] = useState<string | null>(null);
  const dateFmt = (d: Date) => d.toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" });
  const set = (k: keyof typeof f, v: string | boolean) => setF((s) => ({ ...s, [k]: v }));
  const ok = f.senderName.trim() && f.content.trim().length > 0;

  async function send() {
    setErr(null); setStep("sending");
    const res = await fetch("/api/letters", {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ slug, ...f, signature: f.signature || undefined }),
    });
    if (res.ok) return setStep("sent");
    setErr(res.status === 429 ? "Vous avez écrit beaucoup de lettres. Réessayez dans un moment." : "Une erreur est survenue. Votre lettre n'est pas perdue, réessayez.");
    setStep("write");
  }

  const fade = { initial: { opacity: 0, y: reduce ? 0 : 16 }, animate: { opacity: 1, y: 0 }, exit: { opacity: 0, y: reduce ? 0 : -12 }, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] as const } };

  return (
    <main className="min-h-dvh bg-[#FAF6EF] text-[#1F1B16] px-4 py-8 flex items-center justify-center">
      <AnimatePresence mode="wait">
        {step === "envelope" && (
          <motion.section key="env" {...fade} className="text-center max-w-sm">
            <motion.div whileHover={reduce ? undefined : { rotate: -2, scale: 1.03 }} className="mx-auto mb-8 h-36 w-56 rounded-md bg-[#F1E7D6] shadow-[0_20px_40px_-20px_rgba(60,40,20,.35)] relative">
              <div className="absolute inset-x-0 top-0 h-20 [clip-path:polygon(0_0,100%_0,50%_100%)] bg-[#E8DAC3]" />
              <span className="absolute inset-0 grid place-items-center pt-8 text-2xl" aria-hidden>💌</span>
            </motion.div>
            <h1 className="font-serif text-3xl leading-tight">Une lettre pour {name}</h1>
            <p className="mt-3 text-[#6B6257]">Elle restera scellée jusqu&apos;au {dateFmt(new Date(unlockAt))}.</p>
            <button onClick={() => setStep("write")} className="mt-8 h-12 px-8 rounded-full bg-[#1F1B16] text-[#FAF6EF] active:scale-95 transition focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#B8806A]">Commencer à écrire</button>
          </motion.section>
        )}

        {(step === "write" || step === "sending") && (
          <motion.section key="write" {...fade} className="w-full max-w-xl">
            <div className="rounded-sm bg-[#FFFDF8] shadow-[0_30px_60px_-30px_rgba(60,40,20,.4)] ring-1 ring-black/5 p-6 sm:p-10">
              <p className="font-serif italic text-[#6B6257]">Cher·e {name},</p>
              <label className="sr-only" htmlFor="content">Votre lettre</label>
              <textarea id="content" autoFocus rows={10} maxLength={5000} value={f.content} onChange={(e) => set("content", e.target.value)}
                placeholder="Écrivez ce que vous avez sur le cœur…"
                className="mt-4 w-full resize-none bg-transparent font-serif text-lg leading-8 outline-none placeholder:text-[#B5AA9A] caret-[#B8806A] [background-image:repeating-linear-gradient(transparent,transparent_31px,#EFE6D6_32px)]" />
              <input value={f.signature} onChange={(e) => set("signature", e.target.value)} maxLength={120} aria-label="Signature" placeholder="Avec tout mon amour,"
                className={`mt-4 w-full bg-transparent text-xl outline-none placeholder:text-[#B5AA9A] ${SIGS.find((s) => s.id === sig)!.cls}`} />
              <div className="mt-2 flex gap-2" role="radiogroup" aria-label="Style de signature">
                {SIGS.map((s) => (
                  <button key={s.id} role="radio" aria-checked={sig === s.id} onClick={() => setSig(s.id)}
                    className={`text-xs px-3 py-1.5 rounded-full border ${sig === s.id ? "border-[#B8806A] text-[#B8806A]" : "border-black/10 text-[#6B6257]"}`}>{s.label}</button>
                ))}
              </div>
              <div className="mt-6 flex flex-col sm:flex-row gap-4 sm:items-center">
                <input value={f.senderName} onChange={(e) => set("senderName", e.target.value)} maxLength={60} required placeholder="Votre nom" aria-label="Votre nom"
                  className="h-12 flex-1 rounded-lg border border-black/10 bg-white px-4 outline-none focus:border-[#B8806A]" />
                <label className="flex items-center gap-2 text-sm text-[#6B6257]">
                  <input type="checkbox" checked={f.showDate} onChange={(e) => set("showDate", e.target.checked)} className="size-5 accent-[#B8806A]" />
                  Afficher la date ({dateFmt(new Date())})
                </label>
              </div>
              {/* honeypot anti-bot : invisible pour les humains */}
              <input tabIndex={-1} autoComplete="off" aria-hidden value={f.website} onChange={(e) => set("website", e.target.value)} className="absolute left-[-9999px]" />
              {err && <p role="alert" className="mt-4 text-sm text-red-700">{err}</p>}
            </div>
            <button disabled={!ok || step === "sending"} onClick={send}
              className="mt-6 w-full h-14 rounded-full bg-[#1F1B16] text-[#FAF6EF] disabled:opacity-40 active:scale-[.98] transition">
              {step === "sending" ? "Mise sous enveloppe…" : "Déposer la lettre"}
            </button>
          </motion.section>
        )}

        {step === "sent" && (
          <motion.section key="sent" {...fade} className="text-center max-w-sm">
            <motion.div initial={{ scale: 0.6, rotate: -8 }} animate={{ scale: 1, rotate: 0 }} transition={{ type: "spring", stiffness: 180, damping: 14 }} className="text-6xl" aria-hidden>💌</motion.div>
            <h1 className="mt-6 font-serif text-3xl">Lettre déposée</h1>
            <p className="mt-3 text-[#6B6257]">Votre lettre est dans la capsule. {name} ne pourra la lire que le {dateFmt(new Date(unlockAt))}.</p>
            <a href={`/${slug}`} className="mt-8 inline-block text-[#B8806A] underline underline-offset-4">Retour</a>
          </motion.section>
        )}
      </AnimatePresence>
    </main>
  );
}
