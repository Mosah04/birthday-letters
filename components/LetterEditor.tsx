"use client";
import { useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import {
  ArrowLeft,
  CalendarDays,
  Check,
  Loader2,
  Send,
  Sparkles,
  Palette,
  Type,
} from "lucide-react";
import Envelope from "@/components/Envelope";
import { sounds } from "@/lib/sound";
import Link from "next/link";
import ThemeToggle from "@/components/ThemeToggle";

type Step = "envelope" | "write" | "sealing" | "sent";

const fmt = (d: Date) =>
  d.toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

type PaperTheme = "cream" | "rose" | "parchment" | "midnight";

export default function LetterEditor({
  slug,
  name,
  unlockAt,
}: {
  slug: string;
  name: string;
  unlockAt: string;
}) {
  const reduce = useReducedMotion();
  const [step, setStep] = useState<Step>("envelope");
  const [paper, setPaper] = useState<PaperTheme>("cream");
  const [fontStyle, setFontStyle] = useState<"hand" | "serif">("hand");
  const [f, setF] = useState({
    senderName: "",
    content: "",
    signature: "",
    showDate: true,
    website: "", // honeypot
  });
  const [err, setErr] = useState<string | null>(null);

  const set = (k: keyof typeof f, v: string | boolean) => {
    setF((s) => ({ ...s, [k]: v }));
  };

  const ok = f.senderName.trim() && f.content.trim();

  async function send() {
    setErr(null);
    setStep("sealing");
    sounds.waxCrack();

    try {
      const res = await fetch("/api/letters", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          slug,
          ...f,
          signature: f.signature || undefined,
        }),
      });

      if (res.ok) {
        setTimeout(() => {
          sounds.chime();
          setStep("sent");
        }, 1200);
        return;
      }

      setErr(
        res.status === 429
          ? "Vous avez déjà écrit plusieurs lettres. Réessayez dans un moment."
          : "Une erreur est survenue lors du scellement. Votre texte est conservé."
      );
      setStep("write");
    } catch {
      setErr("Erreur de connexion. Vérifiez votre réseau.");
      setStep("write");
    }
  }

  const fade = {
    initial: { opacity: 0, y: reduce ? 0 : 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: reduce ? 0 : -16 },
    transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] as const },
  };

  const getPaperBg = () => {
    switch (paper) {
      case "rose":
        return "bg-[#fffaf8] border-[#f2ded9] [--paper-writing:#30211e] [--paper-accent:#a84331] [--paper-muted:#79635d]";
      case "parchment":
        return "bg-[#fbf5e8] border-[#e8dbc0] [--paper-writing:#352b1d] [--paper-accent:#8b5a1c] [--paper-muted:#786b58]";
      case "midnight":
        return "bg-[#181a24] border-[#292d3f] [--paper-writing:#edeef5] [--paper-accent:#e57d65] [--paper-muted:#a9a4b3]";
      case "cream":
        return "bg-card border-line [--paper-writing:var(--ink)] [--paper-accent:var(--accent)] [--paper-muted:var(--muted)]";
    }
  };

  return (
    <main className="flex min-h-dvh items-center justify-center px-4 py-8 relative selection:bg-accent/20">
      <AnimatePresence mode="wait">
        {/* STEP 1: PREVIEW / INTRO ENVELOPE */}
        {step === "envelope" && (
          <motion.section
            key="env"
            {...fade}
            className="flex max-w-md flex-col items-center text-center py-6"
          >
            <Envelope
              className="float"
              recipientName={name}
              subtitle="Capsule d'anniversaire"
            />

            <h1 className="mt-12 font-serif text-4xl sm:text-5xl leading-tight text-ink font-medium tracking-tight">
              Une lettre scellée pour{" "}
              <em className="text-accent italic font-normal">{name}</em>
            </h1>

            <p className="mt-4 text-sm sm:text-base text-muted max-w-sm">
              Prends quelques instants pour lui écrire ce qui compte. Ta lettre sera scellée et personne ne pourra l&apos;ouvrir avant le{" "}
              <strong className="text-ink font-semibold">{fmt(new Date(unlockAt))}</strong>.
            </p>

            <button
              onClick={() => {
                sounds.rustle();
                setStep("write");
              }}
              className="mt-8 inline-flex h-14 items-center gap-2 rounded-full bg-ink px-8 text-paper text-sm sm:text-base font-medium shadow-xl transition hover:bg-accent active:scale-95"
            >
              <Sparkles size={16} />
              <span>Prendre la plume</span>
            </button>
          </motion.section>
        )}

        {/* STEP 2: FINE STATIONERY WRITING DESK */}
        {(step === "write" || step === "sealing") && (
          <motion.section
            key="write"
            {...fade}
            className="relative w-full max-w-2xl py-4"
          >
            {/* Top Toolbar */}
            <div             className="mb-4 flex flex-wrap items-center justify-between gap-3">
              <button
                onClick={() => {
                  sounds.click();
                  setStep("envelope");
                }}
                className="inline-flex items-center gap-1.5 text-xs font-medium text-muted hover:text-ink transition border border-line rounded-full px-3 py-1 bg-card/60"
              >
                <ArrowLeft size={14} />
                <span>Retour</span>
              </button>

              {/* Stationery options */}
              <div className="flex flex-wrap items-center justify-end gap-2">
                <div className="shrink-0">
                  <ThemeToggle />
                </div>

                {/* Paper Swatches */}
                <div className="flex shrink-0 items-center gap-1 bg-card/70 border border-line rounded-full px-2 py-1 shadow-sm">
                  <Palette size={12} className="text-muted mr-1" />
                  {(["cream", "rose", "parchment", "midnight"] as PaperTheme[]).map(
                    (p) => (
                      <button
                        key={p}
                        onClick={() => {
                          sounds.rustle();
                          setPaper(p);
                        }}
                        title={`Papier ${p}`}
                        aria-label={`Papier ${p}`}
                        aria-pressed={paper === p}
                        className={`size-4 rounded-full border transition ${p === "cream"
                            ? "bg-[#ffffff]"
                            : p === "rose"
                              ? "bg-[#ffdcd6]"
                              : p === "parchment"
                                ? "bg-[#f5e6cb]"
                                : "bg-[#181a24]"
                          } ${paper === p
                            ? "ring-2 ring-accent scale-110"
                            : "opacity-70 hover:opacity-100"
                          }`}
                      />
                    )
                  )}
                </div>

                {/* Font Toggle */}
                <button
                  onClick={() => {
                    sounds.click();
                    setFontStyle(fontStyle === "hand" ? "serif" : "hand");
                  }}
                  className="flex shrink-0 items-center gap-1 bg-card/70 border border-line rounded-full px-2.5 py-1 text-xs text-muted hover:text-ink shadow-sm"
                >
                  <Type size={12} />
                  <span>{fontStyle === "hand" ? "Manuscrit" : "Sérif"}</span>
                </button>
              </div>
            </div>

            {/* Parchment Letter Sheet */}
            <div
              className={`rounded-3xl p-6 sm:p-12 shadow-[0_30px_70px_-30px_rgba(0,0,0,0.18)] border transition-colors relative overflow-hidden ${getPaperBg()}`}
            >
              {/* Postal Watermark */}
              <div className="absolute top-4 right-6 text-[10px] uppercase font-mono tracking-widest text-muted/40 pointer-events-none select-none">
                Lettre Scellée · Minuit
              </div>

              {/* Greeting */}
              <p
                className={`text-2xl sm:text-3xl font-medium text-[color:var(--paper-accent)] select-none ${fontStyle === "hand" ? "font-hand" : "font-serif italic"
                  }`}
              >
                Cher·e {name},
              </p>

              {/* Letter textarea with lined paper background */}
              <label className="sr-only" htmlFor="letter-content">
                Ta lettre pour {name}
              </label>
              <textarea
                id="letter-content"
                autoFocus
                rows={9}
                maxLength={5000}
                value={f.content}
                onChange={(e) => set("content", e.target.value)}
                placeholder="Écris tout ce que tu n'as jamais pris le temps de dire. Tes souvenirs, tes vœux, un secret partagé..."
                className={`mt-4 w-full resize-none bg-transparent text-[color:var(--paper-writing)] text-xl sm:text-2xl leading-9 sm:leading-10 caret-accent outline-none placeholder:text-[color:var(--paper-muted)] paper-texture ${fontStyle === "hand" ? "font-hand" : "font-serif"
                  }`}
              />

              {/* Signature Input */}
              <div className="mt-6 pt-4 border-t border-line/50">
                <label className="sr-only" htmlFor="signature-input">
                  Signature
                </label>
                <input
                  id="signature-input"
                  value={f.signature}
                  onChange={(e) => set("signature", e.target.value)}
                  maxLength={120}
                  placeholder="Avec toute mon affection,"
                  className={`w-full bg-transparent text-[color:var(--paper-accent)] text-2xl sm:text-3xl outline-none placeholder:text-[color:var(--paper-muted)] ${fontStyle === "hand" ? "font-hand" : "font-serif italic"
                    }`}
                />
              </div>

              {/* Sender Details & Date Switch */}
              <div className="mt-8 flex flex-col gap-4 border-t border-line pt-6 sm:flex-row sm:items-center">
                <input
                  value={f.senderName}
                  onChange={(e) => set("senderName", e.target.value)}
                  maxLength={60}
                  required
                  placeholder="Ton nom ou surnom (ex. Lucas)"
                  className="h-14 min-w-0 flex-1 rounded-2xl border border-line bg-black/5 px-4 text-base font-medium text-[color:var(--paper-writing)] outline-none placeholder:text-[color:var(--paper-muted)] focus:border-accent focus:bg-black/10 transition sm:h-12 sm:text-sm"
                />

                <button
                  type="button"
                  role="switch"
                  aria-checked={f.showDate}
                  onClick={() => {
                    sounds.click();
                    set("showDate", !f.showDate);
                  }}
                  className="flex items-center gap-2.5 text-xs text-muted hover:text-ink transition px-3 py-2 rounded-xl bg-paper/40 border border-line"
                >
                  <span
                    className={`relative h-5 w-9 rounded-full transition ${f.showDate ? "bg-accent" : "bg-line"
                      }`}
                  >
                    <span
                      className={`absolute top-0.5 size-4 rounded-full bg-white transition-all shadow-sm ${f.showDate ? "left-[1.1rem]" : "left-0.5"
                        }`}
                    />
                  </span>
                  <CalendarDays size={14} />
                  <span>{f.showDate ? fmt(new Date()) : "Sans date"}</span>
                </button>
              </div>

              {/* Honeypot hidden input */}
              <input
                tabIndex={-1}
                autoComplete="off"
                aria-hidden
                value={f.website}
                onChange={(e) => set("website", e.target.value)}
                className="absolute left-[-9999px]"
              />

              {err && (
                <div
                  role="alert"
                  className="mt-4 rounded-xl border border-red-500/20 bg-red-500/10 p-3 text-sm text-red-600 dark:text-red-400"
                >
                  {err}
                </div>
              )}
            </div>

            {/* Submission Button */}
            <button
              disabled={!ok || step === "sealing"}
              onClick={send}
              className="mt-6 flex h-14 w-full items-center justify-center gap-2 rounded-full bg-ink text-paper text-sm sm:text-base font-medium shadow-xl transition hover:bg-accent active:scale-98 disabled:opacity-40"
            >
              {step === "sealing" ? (
                <>
                  <Loader2 size={18} className="animate-spin text-accent" />
                  <span>Pliage et scellement du sceau de cire...</span>
                </>
              ) : (
                <>
                  <Send size={18} />
                  <span>Sceller et déposer la lettre</span>
                </>
              )}
            </button>
          </motion.section>
        )}

        {/* STEP 3: SUCCESS / SEALED CONFIRMATION */}
        {step === "sent" && (
          <motion.section
            key="sent"
            {...fade}
            className="flex max-w-md flex-col items-center text-center py-8"
          >
            <motion.div
              initial={{ scale: 0.4, rotate: -15 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: "spring", stiffness: 180, damping: 14 }}
              className="grid size-24 place-items-center rounded-full bg-gradient-to-br from-wax to-[#781f10] text-paper shadow-2xl wax-pulse"
            >
              <Check size={42} strokeWidth={2.5} />
            </motion.div>

            <span className="mt-8 text-xs font-semibold uppercase tracking-widest text-accent font-mono">
              Scellée avec succès
            </span>
            <h1 className="mt-2 font-serif text-4xl sm:text-5xl text-ink font-medium">
              Lettre déposée
            </h1>
            <p className="mt-4 text-sm sm:text-base text-muted max-w-sm">
              Elle est désormais bien au chaud dans la capsule. {name} la découvrira avec émotion le{" "}
              <strong className="text-ink font-semibold">{fmt(new Date(unlockAt))}</strong>.
            </p>

            <div className="mt-8 flex flex-col gap-3 w-full max-w-xs">
              <a
                href={`/${slug}`}
                onClick={() => sounds.click()}
                className="flex h-12 items-center justify-center rounded-full bg-ink text-paper text-sm font-medium shadow transition hover:bg-accent active:scale-95"
              >
                Retourner sur la capsule de {name}
              </a>

              <Link
                href="/"
                onClick={() => sounds.click()}
                className="flex h-12 items-center justify-center rounded-full border border-line bg-card text-muted hover:text-ink text-sm font-medium transition"
              >
                Créer ma propre capsule
              </Link>
            </div>
          </motion.section>
        )}
      </AnimatePresence>
    </main>
  );
}
