import Link from "next/link";
import {
  ArrowRight,
  CalendarHeart,
  Gift,
  Link2,
  Lock,
  Mail,
  PenLine,
  ShieldCheck,
  Sparkles,
  Heart,
  ChevronDown,
  CheckCircle2,
} from "lucide-react";
import { auth } from "@/auth";
import Envelope from "@/components/Envelope";
import NavHeader from "@/components/NavHeader";
import CapsuleSimulator from "@/components/CapsuleSimulator";

const STEPS = [
  {
    icon: CalendarHeart,
    step: "01",
    title: "Crée ta capsule",
    desc: "Ton prénom et ta date d'anniversaire. En 10 secondes, ton espace privé est prêt.",
    tag: "Simple & Gratuit",
  },
  {
    icon: Link2,
    step: "02",
    title: "Partage ton lien secret",
    desc: "Envoie-le à tes amis par message, ou imprime un élégant carton avec QR code pour tes proches.",
    tag: "Lien ou QR Code",
  },
  {
    icon: PenLine,
    step: "03",
    title: "Ils t'écrivent du cœur",
    desc: "Aucune inscription nécessaire pour eux. Chaque lettre est scellée par cire numérique dès l'envoi.",
    tag: "Sans compte",
  },
  {
    icon: Gift,
    step: "04",
    title: "Le grand frisson du jour J",
    desc: "À minuit tapante, le coffre se déverrouille. Tu découvres leurs mots, une enveloppe à la fois.",
    tag: "À minuit pile",
  },
];

const FAQS = [
  {
    q: "Est-ce que je peux vraiment tricher et lire mes lettres en avance ?",
    a: "Non, c'est techniquement impossible. Le contenu des lettres est stocké et verrouillé au niveau de nos serveurs. Aucune donnée textuelle n'est jamais transmise à votre navigateur avant la date et l'heure exacte de votre anniversaire.",
  },
  {
    q: "Mes proches doivent-ils créer un compte pour m'écrire ?",
    a: "Absolument pas ! Ils cliquent sur votre lien, choisissent leur signature, écrivent leur mot et valident en un clic. C'est fluide, poétique et sans friction.",
  },
  {
    q: "Que se passe-t-il après mon anniversaire ?",
    a: "Vos lettres restent précieusement conservées dans votre espace personnel. Vous pouvez les relire toute votre vie ou les exporter comme un recueil de souvenirs.",
  },
  {
    q: "Le service est-il gratuit ?",
    a: "Oui, la création de votre capsule et la réception illimitée de lettres sont 100% gratuites.",
  },
];

export default async function Home() {
  const session = await auth();
  const cta = session?.user
    ? { href: "/dashboard", label: "Accéder à ma capsule" }
    : { href: "/auth", label: "Créer ma capsule d'anniversaire" };

  return (
    <div className="min-h-dvh flex flex-col selection:bg-accent/20">
      {/* Navigation Header */}
      <NavHeader user={session?.user} />

      <main className="flex-1">
        {/* HERO SECTION */}
        <section className="relative overflow-hidden pt-12 pb-20 sm:pt-20 sm:pb-32 px-6">
          <div className="mx-auto max-w-4xl text-center flex flex-col items-center">
            {/* Pill Tag */}
            <div className="mb-8 flex max-w-full flex-col items-center gap-1.5 rounded-2xl border border-line bg-card/80 px-4 py-2.5 text-xs font-medium text-muted shadow-sm backdrop-blur-md sm:flex-row sm:gap-2 sm:rounded-full sm:py-1.5">
              <span className="flex items-center gap-2">
                <span className="size-2 shrink-0 rounded-full bg-accent animate-ping" />
                <span className="text-ink font-semibold">Le rituel des lettres scellées</span>
              </span>
              <span className="hidden text-line-strong sm:inline">·</span>
              <span>Ouverture exclusive le jour J</span>
            </div>

            {/* Interactive 3D Envelope */}
            <div className="my-2">
              <Envelope
                className="float"
                recipientName="Toi"
                subtitle="Scellé jusqu'au jour J"
              />
            </div>

            {/* Hero Main Headline */}
            <h1 className="mt-12 font-serif text-5xl leading-[1.08] tracking-tight sm:text-7xl lg:text-8xl text-ink">
              Certaines lettres<br />
              <em className="font-serif italic font-normal text-accent gold-shimmer">
                méritent d&apos;attendre.
              </em>
            </h1>

            {/* Subtitle */}
            <p className="mt-6 max-w-xl text-lg sm:text-xl text-muted font-normal leading-relaxed">
              Tes proches t&apos;écrivent avant ton anniversaire. Tu regardes les enveloppes s&apos;accumuler dans ton coffre, sans pouvoir les lire, jusqu&apos;à minuit.
            </p>

            {/* CTA Buttons */}
            <div className="mt-10 flex flex-col sm:flex-row items-center gap-4 w-full justify-center max-w-md">
              <Link
                href={cta.href}
                className="group relative flex h-14 w-full sm:w-auto px-8 items-center justify-center gap-2.5 rounded-full bg-ink text-paper font-medium text-base shadow-[0_15px_35px_-10px_rgba(26,22,21,0.35)] transition hover:bg-accent hover:shadow-[0_15px_35px_-10px_rgba(184,80,56,0.4)] active:scale-95"
              >
                <span>{cta.label}</span>
                <ArrowRight size={18} className="transition group-hover:translate-x-1" />
              </Link>
              <a
                href="#atelier"
                className="flex h-14 w-full sm:w-auto px-6 items-center justify-center rounded-full border border-line bg-card/70 text-ink text-sm font-medium transition hover:border-line-strong hover:bg-card active:scale-95"
              >
                Tester l&apos;atelier
              </a>
            </div>

            {/* Trust Badges */}
            <div className="mt-8 flex flex-wrap justify-center items-center gap-6 text-xs text-muted">
              <span className="flex items-center gap-1.5">
                <CheckCircle2 size={15} className="text-accent" />
                100% Gratuit
              </span>
              <span className="flex items-center gap-1.5">
                <Lock size={14} className="text-gold" />
                Scellé côté serveur
              </span>
              <span className="flex items-center gap-1.5">
                <Sparkles size={14} className="text-accent" />
                Sans mot de passe
              </span>
            </div>
          </div>
        </section>

        {/* INTERACTIVE CAPSULE WORKSHOP SECTION */}
        <section id="atelier" className="mx-auto max-w-5xl px-6 pb-24 scroll-mt-20">
          <CapsuleSimulator />
        </section>

        {/* 4 STEPS RITUAL SECTION */}
        <section className="mx-auto max-w-5xl px-6 py-20">
          <div className="text-center max-w-xl mx-auto mb-16">
            <span className="text-xs font-semibold uppercase tracking-widest text-accent block mb-2">
              Comment ça fonctionne
            </span>
            <h2 className="font-serif text-3xl sm:text-5xl tracking-tight text-ink">
              La poésie d&apos;un rituel en quatre actes
            </h2>
            <p className="mt-4 text-muted text-base">
              Rien à installer, aucune complexité. Juste la magie des mots qui prennent le temps d&apos;arriver.
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2">
            {STEPS.map((s) => (
              <div
                key={s.step}
                className="group relative rounded-3xl border border-line bg-card p-8 shadow-[0_10px_30px_-15px_rgba(0,0,0,0.05)] transition hover:border-accent/40 hover:shadow-lg"
              >
                <div className="flex items-center justify-between mb-6">
                  <div className="grid size-12 place-items-center rounded-2xl bg-paper border border-line text-accent transition-transform group-hover:scale-110">
                    <s.icon size={22} />
                  </div>
                  <span className="font-serif text-2xl font-light text-muted/60">{s.step}</span>
                </div>
                <div className="inline-block rounded-full bg-paper px-2.5 py-0.5 text-[11px] font-medium text-accent border border-line mb-3">
                  {s.tag}
                </div>
                <h3 className="font-serif text-2xl font-medium text-ink mb-2">{s.title}</h3>
                <p className="text-muted text-sm leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* SECURITY & SACRED PLEDGE */}
        <section className="mx-auto max-w-4xl px-6 py-16">
          <div className="rounded-3xl border border-gold/30 bg-gradient-to-br from-card via-card to-[var(--paper-subtle)] p-8 sm:p-14 text-center shadow-lg relative overflow-hidden">
            <div className="absolute top-0 right-0 -mt-12 -mr-12 size-48 rounded-full bg-gold/10 blur-2xl pointer-events-none" />

            <div className="mx-auto grid size-16 place-items-center rounded-full bg-gold/15 text-gold border border-gold/30 mb-6">
              <ShieldCheck size={32} />
            </div>
            <span className="text-xs font-semibold uppercase tracking-widest text-gold block mb-2 font-mono">
              Confidentialité Inviolable
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl text-ink">
              Verrouillées jusqu&apos;à la dernière seconde
            </h2>
            <p className="mt-4 max-w-xl mx-auto text-muted text-base leading-relaxed">
              Le verrouillage s&apos;exécute directement sur nos serveurs sécurisés. Avant la date et l&apos;heure de ton anniversaire, pas même toi ni un administrateur ne peut consulter une lettre. Elles restent protégées dans l&apos;obscurité bienveillante jusqu&apos;au grand jour.
            </p>
          </div>
        </section>

        {/* TESTIMONIALS / STORIES */}
        {/* <section className="mx-auto max-w-5xl px-6 py-20">
          <div className="text-center max-w-xl mx-auto mb-16">
            <span className="text-xs font-semibold uppercase tracking-widest text-accent block mb-2">
              Témoignages
            </span>
            <h2 className="font-serif text-3xl sm:text-5xl text-ink">
              Des anniversaires inoubliables
            </h2>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {TESTIMONIALS.map((t, idx) => (
              <div
                key={idx}
                className="flex flex-col justify-between rounded-3xl border border-line bg-card p-7 shadow-sm transition hover:shadow-md"
              >
                <div>
                  <Quote size={24} className="text-accent/30 mb-4" />
                  <p className="font-serif italic text-base leading-relaxed text-ink/90">
                    « {t.quote} »
                  </p>
                </div>
                <div className="mt-6 pt-4 border-t border-line/60 flex items-center justify-between text-xs">
                  <div>
                    <span className="font-semibold text-ink block">{t.author}</span>
                    <span className="text-muted">{t.event}</span>
                  </div>
                  <span className="text-muted font-mono">{t.city}</span>
                </div>
              </div>
            ))}
          </div>
        </section> */}

        {/* FAQ SECTION */}
        <section className="mx-auto max-w-3xl px-6 py-20">
          <div className="text-center mb-12">
            <h2 className="font-serif text-3xl sm:text-4xl text-ink">
              Questions fréquentes
            </h2>
            <p className="mt-2 text-muted text-sm">Tout ce que tu dois savoir sur le fonctionnement des lettres.</p>
          </div>

          <div className="space-y-4">
            {FAQS.map((faq, idx) => (
              <details
                key={idx}
                className="group rounded-2xl border border-line bg-card p-5 transition [&_summary::-webkit-details-marker]:hidden cursor-pointer"
              >
                <summary className="flex items-center justify-between font-serif text-lg font-medium text-ink">
                  <span>{faq.q}</span>
                  <ChevronDown size={18} className="text-muted transition-transform group-open:rotate-180" />
                </summary>
                <p className="mt-3 text-sm text-muted leading-relaxed font-sans pr-6">
                  {faq.a}
                </p>
              </details>
            ))}
          </div>
        </section>

        {/* BOTTOM INVITATION CTA */}
        <section className="mx-auto max-w-5xl px-6 py-16">
          <div className="rounded-3xl border border-line bg-ink text-paper p-10 sm:p-16 text-center shadow-2xl relative overflow-hidden">
            <div className="relative z-10 max-w-xl mx-auto space-y-6">
              <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3.5 py-1 text-xs font-medium text-gold border border-white/10">
                <Heart size={13} fill="currentColor" />
                Offre un souvenir pour la vie
              </span>
              <h2 className="font-serif text-4xl sm:text-6xl tracking-tight text-paper">
                Prêt à recevoir tes premières lettres ?
              </h2>
              <p className="text-paper/70 text-base">
                Crée ton espace en quelques clics et partage ton lien secret à tes proches dès aujourd&apos;hui.
              </p>
              <div className="pt-2">
                <Link
                  href={cta.href}
                  className="inline-flex h-14 items-center gap-2 rounded-full bg-accent px-8 text-paper font-medium text-base shadow-lg transition hover:bg-[#c9593e] active:scale-95"
                >
                  <span>{cta.label}</span>
                  <ArrowRight size={18} />
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* FOOTER */}
      <footer className="border-t border-line/80 py-12 text-center text-xs text-muted bg-paper/60">
        <div className="mx-auto max-w-5xl px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 font-serif text-sm text-ink">
            <Mail size={16} className="text-accent" />
            <span>Birthday Letters</span>
          </div>
          <p>© {new Date().getFullYear()} Birthday Letters · Certaines lettres méritent d&apos;attendre.</p>
          <div className="flex gap-4">
            <Link href="/" className="hover:text-ink transition">Accueil</Link>
            <Link href="/auth" className="hover:text-ink transition">Connexion</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
