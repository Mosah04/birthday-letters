import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { publicState } from "@/lib/lock";
import { PenLine } from "lucide-react";
import Countdown from "@/components/Countdown";

const getProfile = (slug: string) =>
  prisma.birthdayProfile.findUnique({
    where: { slug },
    select: { slug: true, displayName: true, description: true, birthday: true, user: { select: { avatar: true } }, _count: { select: { letters: true } } },
  });

export async function generateMetadata({ params }: { params: Promise<{ username: string }> }): Promise<Metadata> {
  const p = await getProfile((await params).username);
  if (!p) return {};
  const title = `Laisse une lettre à ${p.displayName} 💌`;
  const description = "Une lettre scellée, à ouvrir le jour de son anniversaire.";
  return { title, description, openGraph: { title, description, type: "website" }, twitter: { card: "summary_large_image", title, description } };
}

export default async function PublicPage({ params }: { params: Promise<{ username: string }> }) {
  const p = await getProfile((await params).username);
  if (!p) notFound();
  const state = publicState(p.birthday);
  const n = p._count.letters;
  const copy = {
    waiting: ["C'est bientôt l'anniversaire de", "Laisse-lui une lettre qu'il ou elle découvrira le jour J."],
    tomorrow: ["C'est demain l'anniversaire de", "Il reste quelques heures pour glisser une lettre dans la capsule."],
    open: ["Les lettres de", "sont maintenant ouvertes."],
  }[state];

  return (
    <main className="min-h-dvh bg-paper text-ink px-6 py-16 flex flex-col items-center text-center">
      <div className="max-w-md w-full">
        {p.user.avatar && <img src={p.user.avatar} alt="" className="mx-auto mb-6 size-20 rounded-full object-cover ring-4 ring-card" />}
        <p className="text-muted">{copy[0]}</p>
        <h1 className="font-serif text-5xl mt-1">{p.displayName}</h1>
        {p.description && <p className="mt-4 font-serif italic text-muted">« {p.description} »</p>}

        {state === "open" ? (
          <p className="mt-8 text-lg">{copy[1]}</p>
        ) : (
          <>
            <p className="mt-8 text-muted">{copy[1]}</p>
            <div className="mt-8"><Countdown to={p.birthday.toISOString()} /></div>
            <Link href={`/${p.slug}/write`} className="mt-10 inline-flex h-14 items-center px-8 rounded-full bg-ink text-paper active:scale-95 transition"><PenLine size={18} className="mr-2" />Écrire une lettre</Link>
          </>
        )}
        <p className="mt-10 text-sm text-muted">{n === 0 ? "Sois le premier à écrire." : `${n} lettre${n > 1 ? "s" : ""} déjà déposée${n > 1 ? "s" : ""}`}</p>
      </div>
    </main>
  );
}
