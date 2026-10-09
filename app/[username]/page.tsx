import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { publicState } from "@/lib/lock";
import { PenLine, Lock, Sparkles, Heart, Gift, ArrowRight } from "lucide-react";
import Countdown from "@/components/Countdown";
import Envelope from "@/components/Envelope";
import NavHeader from "@/components/NavHeader";
import { auth } from "@/auth";

const getProfile = (slug: string) =>
  prisma.birthdayProfile.findUnique({
    where: { slug },
    select: {
      id: true,
      slug: true,
      userId: true,
      displayName: true,
      description: true,
      birthday: true,
      user: { select: { avatar: true } },
      _count: { select: { letters: true } },
    },
  });

export async function generateMetadata({
  params,
}: {
  params: Promise<{ username: string }>;
}): Promise<Metadata> {
  const { username } = await params;
  const p = await getProfile(username);
  if (!p) return {};
  const title = `Laisse une lettre à ${p.displayName} 💌`;
  const description =
    "Une lettre scellée, impossible à ouvrir avant le jour de son anniversaire.";
  return {
    title,
    description,
    openGraph: { title, description, type: "website" },
    twitter: { card: "summary_large_image", title, description },
  };
}

export default async function PublicPage({
  params,
}: {
  params: Promise<{ username: string }>;
}) {
  const { username } = await params;
  const p = await getProfile(username);
  if (!p) notFound();

  const session = await auth();
  const isOwner = session?.user?.id === p.userId;
  const state = publicState(p.birthday);
  const n = p._count.letters;

  const copy = {
    waiting: [
      "C'est bientôt l'anniversaire de",
      "Laisse-lui un mot du cœur qu'il ou elle découvrira le jour J.",
    ],
    tomorrow: [
      "C'est demain l'anniversaire de",
      "Il reste quelques heures pour glisser ta lettre dans la capsule !",
    ],
    open: [
      "Aujourd'hui, c'est l'anniversaire de",
      "La capsule temporelle est officiellement ouverte !",
    ],
  }[state];

  return (
    <div className="min-h-dvh flex flex-col bg-paper text-ink selection:bg-accent/20">
      <NavHeader user={session?.user} />

      <main className="flex-1 flex flex-col items-center justify-center px-6 py-12 sm:py-20 text-center relative overflow-hidden">
        {/* Ambient Glow */}
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 size-96 rounded-full bg-accent/10 blur-3xl pointer-events-none" />

        <div className="max-w-lg w-full relative z-10 space-y-8">
          {/* Avatar / Recipient Badge */}
          <div className="flex flex-col items-center">
            {p.user.avatar ? (
              <img
                src={p.user.avatar}
                alt={p.displayName}
                className="size-24 rounded-full object-cover ring-4 ring-card shadow-lg mb-4 border border-line"
              />
            ) : (
              <div className="grid size-20 place-items-center rounded-full bg-accent/10 border border-accent/25 text-accent text-2xl font-serif font-bold shadow-md mb-4">
                {p.displayName.charAt(0).toUpperCase()}
              </div>
            )}

            <span className="text-xs font-semibold uppercase tracking-widest text-muted">
              {copy[0]}
            </span>
            <h1 className="font-serif text-5xl sm:text-6xl text-ink font-medium mt-1 tracking-tight">
              {p.displayName}
            </h1>

            {p.description && (
              <p className="mt-3 font-serif italic text-muted text-lg max-w-sm">
                « {p.description} »
              </p>
            )}
          </div>

          {/* Interactive Envelope Preview */}
          <div className="flex justify-center">
            <Envelope
              recipientName={p.displayName}
              subtitle={state === "open" ? "🎉 Capsule déverrouillée" : "Scellée jusqu'au jour J"}
              className="float"
            />
          </div>

          {/* Status & Actions */}
          {state === "open" ? (
            <div className="rounded-3xl border border-accent/30 bg-card p-8 shadow-xl space-y-4">
              <span className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-accent font-mono">
                <Sparkles size={14} />
                Jour J
              </span>
              <p className="font-serif text-2xl text-ink">{copy[1]}</p>
              {isOwner ? (
                <Link
                  href={`/${p.slug}/letters`}
                  className="inline-flex h-14 items-center gap-2 px-8 rounded-full bg-accent text-paper font-medium text-base shadow-lg transition hover:bg-[#c9593e] active:scale-95"
                >
                  <Gift size={18} />
                  <span>Ouvrir mes {n} lettres</span>
                </Link>
              ) : (
                <p className="text-sm text-muted">
                  {p.displayName} peut maintenant lire les précieux mots déposés par ses proches.
                </p>
              )}
            </div>
          ) : (
            <div className="rounded-3xl border border-line bg-card/80 p-8 shadow-lg backdrop-blur-sm space-y-6">
              <p className="text-sm text-muted font-medium">{copy[1]}</p>

              <div>
                <span className="text-xs font-semibold uppercase tracking-wider text-muted block mb-3 font-mono">
                  Compte à rebours
                </span>
                <Countdown to={p.birthday.toISOString()} />
              </div>

              <div className="pt-2">
                <Link
                  href={`/${p.slug}/write`}
                  className="group inline-flex h-14 w-full sm:w-auto items-center justify-center gap-2.5 px-8 rounded-full bg-ink text-paper font-medium text-base shadow-xl transition hover:bg-accent active:scale-95"
                >
                  <PenLine size={18} className="text-accent group-hover:text-paper transition" />
                  <span>Glisser une lettre scellée</span>
                  <ArrowRight size={16} className="transition group-hover:translate-x-1" />
                </Link>
              </div>

              <p className="text-xs text-muted flex items-center justify-center gap-1.5">
                <Lock size={13} className="text-gold" />
                <span>Sans compte · Inviolable jusqu&apos;à minuit</span>
              </p>
            </div>
          )}

          {/* Letters Counter Badge */}
          <div className="text-xs text-muted font-medium">
            {n === 0 ? (
              <span className="text-accent font-semibold">✨ Sois la toute première personne à écrire.</span>
            ) : (
              <span>💌 Déjà {n} lettre{n > 1 ? "s" : ""} déposée{n > 1 ? "s" : ""} dans la capsule</span>
            )}
          </div>

          {/* Viral CTA: Create own capsule */}
          <div className="pt-8 border-t border-line/60">
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 text-xs text-muted hover:text-ink transition"
            >
              <span>Toi aussi, crée ta capsule d&apos;anniversaire</span>
              <ArrowRight size={13} />
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
