"use client";
import { useState } from "react";
import { Sparkles, Check, Send, RotateCcw, Lock } from "lucide-react";
import Envelope from "./Envelope";
import { sounds } from "@/lib/sound";

export default function CapsuleSimulator() {
  const [name, setName] = useState("Camille");
  const [note, setNote] = useState("On se connaît depuis le lycée et chaque souvenir avec toi est précieux...");
  const [sealColor, setSealColor] = useState<"wax" | "gold" | "emerald" | "navy">("wax");
  const [sealIcon, setSealIcon] = useState<"heart" | "star" | "lock" | "feather">("heart");
  const [isSealed, setIsSealed] = useState(false);

  const colors = [
    { id: "wax", label: "Cire Pourpre", bg: "bg-[#a83622]" },
    { id: "gold", label: "Or Ancien", bg: "bg-[#c9933e]" },
    { id: "emerald", label: "Émeraude", bg: "bg-[#1b4332]" },
    { id: "navy", label: "Minuit", bg: "bg-[#1a2647]" },
  ] as const;

  const icons = [
    { id: "heart", label: "Cœur" },
    { id: "star", label: "Étoile" },
    { id: "feather", label: "Plume" },
    { id: "lock", label: "Cadenas" },
  ] as const;

  const handleSeal = () => {
    sounds.waxCrack();
    setIsSealed(true);
  };

  const handleReset = () => {
    sounds.rustle();
    setIsSealed(false);
  };

  return (
    <div className="w-full rounded-3xl border border-line bg-card/70 p-6 sm:p-10 shadow-[0_20px_50px_-20px_rgba(0,0,0,0.1)] backdrop-blur-md">
      <div className="flex flex-col lg:flex-row items-center gap-10 lg:gap-14">
        {/* Left: Envelope Visualization */}
        <div className="flex flex-col items-center justify-center flex-1 w-full">
          <div className="relative">
            <Envelope
              recipientName={name || "Destinataire"}
              sealColor={sealColor}
              sealIcon={sealIcon}
              subtitle={isSealed ? "🔒 Verrouillé jusqu'à minuit" : "Aperçu en direct"}
              className={isSealed ? "scale-105 transition-transform" : "float"}
            />
          </div>

          {isSealed && (
            <div className="mt-8 flex items-center gap-2 rounded-full bg-wax/10 border border-wax/25 px-4 py-1.5 text-xs text-wax font-medium animate-bounce">
              <Lock size={13} />
              <span>Sceau apposé. Impossible d&apos;ouvrir avant le jour J !</span>
            </div>
          )}
        </div>

        {/* Right: Interactive Controls */}
        <div className="w-full lg:max-w-md space-y-6 text-left">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-accent">
              <Sparkles size={14} />
              <span>Atelier d&apos;écriture interactif</span>
            </div>
            <h3 className="font-serif text-2xl font-medium text-ink">
              Personnalise le rituel de ta lettre
            </h3>
            <p className="text-sm text-muted">
              Découvre comment tes proches composeront leur mot secret avant qu&apos;il ne soit scellé sur nos serveurs.
            </p>
          </div>

          <div className="space-y-4">
            {/* Recipient Name */}
            <div>
              <label className="block text-xs font-medium uppercase tracking-wider text-muted mb-1.5">
                Prénom du destinataire
              </label>
              <input
                type="text"
                value={name}
                maxLength={30}
                onChange={(e) => setName(e.target.value)}
                className="h-11 w-full rounded-xl border border-line bg-paper/60 px-3.5 text-sm font-medium outline-none focus:border-accent focus:bg-paper transition"
                placeholder="Ex. Clara, Lucas..."
              />
            </div>

            {/* Note Snippet */}
            <div>
              <label className="block text-xs font-medium uppercase tracking-wider text-muted mb-1.5">
                Quelques mots du cœur
              </label>
              <textarea
                rows={2}
                value={note}
                maxLength={200}
                onChange={(e) => setNote(e.target.value)}
                className="w-full rounded-xl border border-line bg-paper/60 p-3 text-sm font-hand text-lg outline-none focus:border-accent focus:bg-paper transition resize-none"
              />
            </div>

            {/* Wax Color Picker */}
            <div>
              <label className="block text-xs font-medium uppercase tracking-wider text-muted mb-2">
                Teinte du sceau de cire
              </label>
              <div className="flex gap-2.5">
                {colors.map((c) => (
                  <button
                    key={c.id}
                    onClick={() => {
                      sounds.click();
                      setSealColor(c.id);
                    }}
                    className={`flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-medium transition ${
                      sealColor === c.id
                        ? "border-ink bg-ink text-paper dark:bg-paper dark:text-ink shadow-sm"
                        : "border-line bg-paper/40 text-muted hover:border-line-strong"
                    }`}
                  >
                    <span className={`size-3 rounded-full ${c.bg} shadow-inner`} />
                    <span>{c.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Emblems */}
            <div>
              <label className="block text-xs font-medium uppercase tracking-wider text-muted mb-2">
                Emblème gravé
              </label>
              <div className="flex flex-wrap gap-2">
                {icons.map((ic) => (
                  <button
                    key={ic.id}
                    onClick={() => {
                      sounds.click();
                      setSealIcon(ic.id);
                    }}
                    className={`rounded-lg border px-3 py-1 text-xs font-medium transition ${
                      sealIcon === ic.id
                        ? "border-accent bg-accent/10 text-accent font-semibold"
                        : "border-line text-muted hover:text-ink"
                    }`}
                  >
                    {ic.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Action button */}
          <div className="pt-2 flex gap-3">
            {!isSealed ? (
              <button
                onClick={handleSeal}
                className="flex-1 flex h-12 items-center justify-center gap-2 rounded-full bg-ink text-paper font-medium text-sm shadow-md transition hover:bg-accent active:scale-95"
              >
                <Send size={15} />
                <span>Simuler le scellement officiel</span>
              </button>
            ) : (
              <button
                onClick={handleReset}
                className="flex-1 flex h-12 items-center justify-center gap-2 rounded-full border border-line bg-card text-ink font-medium text-sm transition hover:bg-line active:scale-95"
              >
                <RotateCcw size={15} />
                <span>Réouvrir l&apos;enveloppe</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
