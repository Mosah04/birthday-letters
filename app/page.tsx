import Link from "next/link";
import { ArrowRight, CalendarHeart, Gift, Link2, Lock, Mail, PenLine, ShieldCheck } from "lucide-react";
import { auth } from "@/auth";
import Envelope from "@/components/Envelope";

const STEPS = [
  [CalendarHeart, "Crée ton espace", "Ton prénom, ta date d'anniversaire. Ça prend dix secondes."],
  [Link2, "Partage ton lien", "Par message, ou avec un QR code à glisser dans une carte."],
  [PenLine, "Ils t'écrivent", "Sans compte. Chaque lettre est scellée dès l'envoi."],
  [Gift, "Ouvre le jour J", "La capsule s'ouvre à minuit. Tu lis, une lettre à la fois."],
] as const;

export default async function Home() {
  const session = await auth();
  const cta = session?.user ? { href: "/dashboard", label: "Mon espace" } : { href: "/auth", label: "Créer mon espace" };
  return (
    <div className="min-h-dvh">
      <header className="mx-auto flex max-w-5xl items-center justify-between px-6 py-5">
        <span className="flex items-center gap-2 font-serif text-lg"><Mail size={20} className="text-accent" />Birthday Letters</span>
        <Link href={cta.href} className="rounded-full border border-line px-4 py-2 text-sm transition hover:bg-line">{session?.user ? "Mon espace" : "Connexion"}</Link>
      </header>

      <main>
        <section className="mx-auto flex max-w-3xl flex-col items-center px-6 pb-20 pt-10 text-center sm:pt-20">
          <Envelope className="float" />
          <h1 className="mt-14 font-serif text-5xl leading-[1.05] tracking-tight sm:text-7xl">
            Certaines lettres<br /><em className="text-accent">méritent d'attendre.</em>
          </h1>
          <p className="mt-6 max-w-lg text-lg text-muted">Tes proches t'écrivent avant ton anniversaire. Tu regardes les lettres s'accumuler, sans pouvoir les lire, jusqu'au jour J.</p>
          <Link href={cta.href} className="group mt-10 inline-flex h-14 items-center gap-2 rounded-full bg-ink px-8 text-paper shadow-lg transition active:scale-95 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent">
            {cta.label}<ArrowRight size={18} className="transition group-hover:translate-x-1" />
          </Link>
          <p className="mt-4 flex items-center gap-1.5 text-sm text-muted"><Lock size={14} />Gratuit · sans mot de passe</p>
        </section>

        <section className="mx-auto max-w-4xl px-6 pb-20">
          <ol className="grid gap-4 sm:grid-cols-2">
            {STEPS.map(([Icon, t, d], i) => (
              <li key={t} className="rounded-2xl bg-card p-6 ring-1 ring-line">
                <div className="flex items-center justify-between">
                  <span className="grid size-10 place-items-center rounded-full bg-line text-accent"><Icon size={20} /></span>
                  <span className="font-serif text-sm text-muted">0{i + 1}</span>
                </div>
                <h2 className="mt-5 font-serif text-xl">{t}</h2>
                <p className="mt-1 text-muted">{d}</p>
              </li>
            ))}
          </ol>
        </section>

        <section className="mx-auto max-w-2xl px-6 pb-24 text-center">
          <ShieldCheck className="mx-auto text-accent" size={28} />
          <h2 className="mt-4 font-serif text-2xl">Vraiment scellées</h2>
          <p className="mt-2 text-muted">Le verrouillage se fait sur nos serveurs. Avant la date, personne, pas même toi, ne peut lire une lettre : elles n'arrivent jamais dans ton navigateur.</p>
        </section>
      </main>
      <footer className="border-t border-line py-8 text-center text-sm text-muted">Fait avec soin pour les anniversaires qui comptent.</footer>
    </div>
  );
}
