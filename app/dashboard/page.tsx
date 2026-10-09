import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { isUnlocked } from "@/lib/lock";
import { Mail, Lock } from "lucide-react";
import Countdown from "@/components/Countdown";
import SharePanel from "@/components/SharePanel";
import CreateProfileForm from "@/components/CreateProfileForm";

export default async function Dashboard() {
  const session = await auth();
  if (!session?.user?.id) redirect("/auth");
  const profile = await prisma.birthdayProfile.findUnique({ where: { userId: session.user.id } });

  if (!profile) return (
    <main className="min-h-dvh bg-paper px-6 py-16 flex justify-center">
      <div className="w-full max-w-sm text-center"><h1 className="font-serif text-3xl mb-8">Crée ton espace</h1><CreateProfileForm defaultName={session.user.name?.split(" ")[0] ?? ""} /></div>
    </main>
  );

  // Métadonnées UNIQUEMENT : pas de `content`.
  const metas = await prisma.letter.findMany({ where: { profileId: profile.id }, orderBy: { createdAt: "asc" }, select: { id: true, senderName: true } });
  const senders = new Set(metas.map((m) => m.senderName.trim().toLowerCase())).size;
  const open = isUnlocked(profile.birthday);
  const h = await headers();
  const base = `${h.get("x-forwarded-proto") ?? "https"}://${h.get("host")}`;
  const when = profile.birthday.toLocaleDateString("fr-FR", { day: "numeric", month: "long" });

  return (
    <main className="min-h-dvh bg-paper text-ink px-5 py-10">
      <div className="mx-auto max-w-xl space-y-8">
        <header className="text-center">
          <p className="text-muted">{open ? "Joyeux anniversaire" : "Ton anniversaire"}</p>
          <h1 className="font-serif text-4xl">{profile.displayName}</h1>
          {!open && <div className="mt-6"><Countdown to={profile.birthday.toISOString()} /></div>}
        </header>
        <div className="grid grid-cols-2 gap-3 text-center">
          <div className="rounded-xl bg-card ring-1 ring-line p-4"><div className="font-serif text-3xl">{metas.length}</div><div className="text-sm text-muted">lettres</div></div>
          <div className="rounded-xl bg-card ring-1 ring-line p-4"><div className="font-serif text-3xl">{senders}</div><div className="text-sm text-muted">personnes</div></div>
        </div>
        {open ? (
          <a href={`/${profile.slug}/letters`} className="flex h-14 items-center justify-center rounded-full bg-ink text-paper">Ouvrir mes lettres</a>
        ) : metas.length === 0 ? (
          <p className="text-center text-muted">Aucune lettre pour l'instant. Partage ton lien ↓</p>
        ) : (
          <ul className="space-y-2">
            {metas.map((m, i) => (
              <li key={m.id} className="flex items-center justify-between rounded-xl bg-card ring-1 ring-line px-4 py-3">
                <span className="flex items-center gap-2"><Mail size={16} className="text-accent" />Lettre #{i + 1} · de {m.senderName}</span><span className="flex items-center gap-1.5 text-sm text-muted"><Lock size={14} />le {when}</span>
              </li>
            ))}
          </ul>
        )}
        <SharePanel url={`${base}/${profile.slug}`} />
      </div>
    </main>
  );
}
