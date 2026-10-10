import { redirect } from "next/navigation";
import { headers } from "next/headers";
import Link from "next/link";
import { auth, signOut } from "@/auth";
import { prisma } from "@/lib/prisma";
import { isUnlocked } from "@/lib/lock";
import {
  Mail,
  Lock,
  Sparkles,
  Users,
  Calendar,
  ExternalLink,
  PenLine,
  Eye,
  LogOut,
  Gift,
  CheckCircle2,
} from "lucide-react";
import Countdown from "@/components/Countdown";
import SharePanel from "@/components/SharePanel";
import CreateProfileForm from "@/components/CreateProfileForm";
import NavHeader from "@/components/NavHeader";

export default async function Dashboard() {
  const session = await auth();
  if (!session?.user?.id) redirect("/auth");

  const profile = await prisma.birthdayProfile.findUnique({
    where: { userId: session.user.id },
  });

  if (!profile) {
    return (
      <div className="min-h-dvh flex flex-col bg-paper">
        <NavHeader user={session.user} />
        <main className="flex-1 px-6 py-12 flex justify-center items-center">
          <div className="w-full max-w-md rounded-3xl border border-line bg-card/90 p-8 sm:p-10 shadow-xl backdrop-blur-sm text-center">
            <div className="mx-auto grid size-16 place-items-center rounded-full bg-accent/10 border border-accent/25 text-accent mb-6 wax-pulse">
              <Gift size={28} />
            </div>
            <h1 className="font-serif text-3xl sm:text-4xl text-ink">
              Crée ta capsule
            </h1>
            <p className="mt-2 text-sm text-muted mb-8">
              Remplis ces quelques détails pour activer ta capsule temporelle.
            </p>
            <CreateProfileForm defaultName={session.user.name?.split(" ")[0] ?? ""} />
          </div>
        </main>
      </div>
    );
  }

  // Metadata ONLY: zero letter contents exposed before unlock
  const metas = await prisma.letter.findMany({
    where: { profileId: profile.id },
    orderBy: { createdAt: "asc" },
    select: { id: true, senderName: true, createdAt: true },
  });

  const senders = new Set(metas.map((m) => m.senderName.trim().toLowerCase())).size;
  const open = isUnlocked(profile.birthday);

  const h = await headers();
  const host = h.get("host") || "localhost:3001";
  const proto = h.get("x-forwarded-proto") || (host.includes("localhost") ? "http" : "https");
  const base = `${proto}://${host}`;

  const when = profile.birthday.toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "long",
  });

  return (
    <div className="min-h-dvh flex flex-col bg-paper text-ink">
      <NavHeader user={session.user} />

      <main className="flex-1 px-4 sm:px-6 py-8 sm:py-12">
        <div className="mx-auto max-w-3xl space-y-8">
          {/* Top Status Banner */}
          <div className="relative rounded-3xl border border-line bg-card/90 p-8 sm:p-10 shadow-lg text-center backdrop-blur-sm overflow-hidden">
            <div className="absolute top-0 right-0 -mt-10 -mr-10 size-40 rounded-full bg-accent/10 blur-2xl pointer-events-none" />

            {/* Birthday Badge */}
            <div className="inline-flex items-center gap-2 rounded-full border border-line bg-paper px-4 py-1 text-xs font-medium text-muted shadow-sm mb-4">
              <Calendar size={13} className="text-accent" />
              <span>
                {open ? "🎉 Joyeux anniversaire !" : `Rendez-vous le ${when}`}
              </span>
            </div>

            <h1 className="font-serif text-4xl sm:text-5xl text-ink tracking-tight font-medium">
              Capsule de {profile.displayName}
            </h1>
            {profile.description && (
              <p className="mt-3 font-serif italic text-muted text-base max-w-md mx-auto">
                « {profile.description} »
              </p>
            )}

            {/* Countdown or Open state */}
            {!open ? (
              <div className="mt-8 pt-6 border-t border-line/60">
                <span className="text-xs font-semibold uppercase tracking-wider text-muted block mb-4">
                  Temps restant avant l&apos;ouverture automatique
                </span>
                <Countdown to={profile.birthday.toISOString()} />
                {metas.length > 0 && host.includes("localhost") && (
                  <div className="mt-4 pt-3 border-t border-line/40">
                    <Link
                      href={`/${profile.slug}/letters?preview=true`}
                      className="inline-flex items-center gap-1.5 text-xs text-accent hover:underline font-mono"
                    >
                      <Sparkles size={13} />
                      <span>Aperçu créateur (tester la cérémonie)</span>
                    </Link>
                  </div>
                )}
              </div>
            ) : (
              <div className="mt-8 pt-6 border-t border-line/60">
                <p className="text-sm font-medium text-accent mb-4">
                  Le moment tant attendu est arrivé ! Tes lettres sont scellées et prêtes.
                </p>
                <Link
                  href={`/${profile.slug}/letters`}
                  className="inline-flex h-14 items-center gap-2 px-8 rounded-full bg-ink text-paper font-medium text-base shadow-xl transition hover:bg-accent active:scale-95"
                >
                  <Gift size={18} />
                  <span>Ouvrir mes lettres</span>
                </Link>
              </div>
            )}
          </div>

          {/* Quick Metrics */}
          <div className="grid grid-cols-2 gap-4 text-center">
            <div className="rounded-2xl border border-line bg-card p-5 shadow-sm transition hover:shadow">
              <div className="mx-auto grid size-10 place-items-center rounded-xl bg-accent/10 text-accent mb-2">
                <Mail size={18} />
              </div>
              <div className="font-serif text-4xl font-semibold text-ink tabular-nums">
                {metas.length}
              </div>
              <div className="text-xs font-medium uppercase tracking-wider text-muted mt-1">
                Lettre{metas.length > 1 ? "s" : ""} scellée{metas.length > 1 ? "s" : ""}
              </div>
            </div>

            <div className="rounded-2xl border border-line bg-card p-5 shadow-sm transition hover:shadow">
              <div className="mx-auto grid size-10 place-items-center rounded-xl bg-gold/15 text-gold mb-2">
                <Users size={18} />
              </div>
              <div className="font-serif text-4xl font-semibold text-ink tabular-nums">
                {senders}
              </div>
              <div className="text-xs font-medium uppercase tracking-wider text-muted mt-1">
                Ami{senders > 1 ? "s" : ""} complice{senders > 1 ? "s" : ""}
              </div>
            </div>
          </div>

          {/* Quick Action Navigation Toolbar */}
          <div className="flex flex-wrap items-center justify-between gap-3 p-4 rounded-2xl border border-line bg-card/60 backdrop-blur-sm text-xs">
            <div className="flex items-center gap-2">
              <Link
                href={`/${profile.slug}`}
                target="_blank"
                className="inline-flex items-center gap-1.5 rounded-full border border-line px-3.5 py-1.5 font-medium hover:border-line-strong transition"
              >
                <Eye size={13} className="text-accent" />
                <span>Voir ma page publique</span>
                <ExternalLink size={11} className="text-muted" />
              </Link>
              <Link
                href={`/${profile.slug}/write`}
                target="_blank"
                className="inline-flex items-center gap-1.5 rounded-full border border-line px-3.5 py-1.5 font-medium hover:border-line-strong transition"
              >
                <PenLine size={13} className="text-gold" />
                <span>Tester l&apos;écriture</span>
              </Link>
            </div>

            <form
              action={async () => {
                "use server";
                await signOut({ redirectTo: "/" });
              }}
            >
              <button
                type="submit"
                className="inline-flex items-center gap-1.5 text-muted hover:text-red-500 transition px-2 py-1"
              >
                <LogOut size={13} />
                <span>Déconnexion</span>
              </button>
            </form>
          </div>

          {/* Letters Vault Section */}
          <div className="rounded-3xl border border-line bg-card p-6 sm:p-8 shadow-sm space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-line/60">
              <div className="flex items-center gap-2">
                <Sparkles size={16} className="text-accent" />
                <h2 className="font-serif text-xl font-medium text-ink">
                  Le Coffre aux Lettres
                </h2>
              </div>
              <span className="text-xs text-muted font-mono">
                {metas.length} enveloppe{metas.length > 1 ? "s" : ""}
              </span>
            </div>

            {metas.length === 0 ? (
              <div className="text-center py-12 space-y-3">
                <div className="mx-auto grid size-12 place-items-center rounded-full bg-paper text-muted border border-line">
                  <Mail size={20} />
                </div>
                <p className="font-serif text-lg text-ink">
                  Aucune lettre pour l&apos;instant
                </p>
                <p className="text-xs text-muted max-w-sm mx-auto">
                  Partage ton lien ou ton QR Code à tes amis pour qu&apos;ils commencent à déposer leurs mots doux !
                </p>
              </div>
            ) : (
              <div className="space-y-2.5 pt-2">
                {metas.map((m, i) => (
                  <div
                    key={m.id}
                    className="flex items-center justify-between rounded-2xl border border-line bg-paper/60 p-4 transition hover:bg-paper hover:border-line-strong"
                  >
                    <div className="flex items-center gap-3">
                      <span className="relative grid size-10 place-items-center rounded-full bg-wax/10 border border-wax/25 text-wax">
                        <Mail size={16} />
                        <span className="absolute -top-0.5 -right-0.5 size-2 rounded-full bg-wax" />
                      </span>
                      <div>
                        <span className="font-medium text-sm text-ink block">
                          Lettre #{i + 1}
                        </span>
                        <span className="text-xs text-muted">
                          Déposée par <strong className="text-ink font-semibold">{m.senderName}</strong>
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="inline-flex items-center gap-1 rounded-full bg-card border border-line px-2.5 py-1 text-xs text-muted font-mono">
                        <Lock size={12} className="text-accent" />
                        <span>Scellée</span>
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Share Studio */}
          <SharePanel
            url={`${base}/${profile.slug}`}
            recipientName={profile.displayName}
          />
        </div>
      </main>
    </div>
  );
}
