import Link from "next/link";
import { auth } from "@/auth";

const STEPS = [
  ["Crée ton espace", "Ton prénom, ta date d'anniversaire. C'est tout."],
  ["Partage ton lien", "Par message, ou avec le QR code sur une carte."],
  ["Tes proches écrivent", "Sans compte. Chaque lettre est scellée."],
  ["Découvre-les", "Le jour J, la capsule s'ouvre, une lettre à la fois."],
];

export default async function Home() {
  const session = await auth();
  const cta = session?.user ? { href: "/dashboard", label: "Mon espace" } : { href: "/auth", label: "Créer mon espace" };
  return (
    <main className="min-h-dvh">
      <section className="mx-auto flex min-h-[85dvh] max-w-2xl flex-col items-center justify-center px-6 text-center">
        <span className="text-4xl" aria-hidden>💌</span>
        <h1 className="mt-6 font-serif text-5xl leading-[1.1] sm:text-6xl">Certaines lettres<br /><em>méritent d&apos;attendre.</em></h1>
        <p className="mt-6 max-w-md text-lg text-[#6B6257]">Tes proches t&apos;écrivent avant ton anniversaire. Tu vois les lettres s&apos;accumuler, sans pouvoir les lire, jusqu&apos;au jour J.</p>
        <Link href={cta.href} className="mt-10 inline-flex h-14 items-center rounded-full bg-[#1F1B16] px-8 text-[#FAF6EF] transition active:scale-95 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#B8806A]">{cta.label}</Link>
      </section>
      <section className="mx-auto max-w-2xl px-6 pb-24">
        <ol className="grid gap-px overflow-hidden rounded-2xl bg-black/5 ring-1 ring-black/5 sm:grid-cols-2">
          {STEPS.map(([t, d], i) => (
            <li key={t} className="bg-[#FFFDF8] p-6">
              <span className="font-serif text-sm text-[#B8806A]">0{i + 1}</span>
              <h2 className="mt-1 font-serif text-xl">{t}</h2>
              <p className="mt-1 text-[#6B6257]">{d}</p>
            </li>
          ))}
        </ol>
        <p className="mt-10 text-center text-sm text-[#6B6257]">Les lettres sont protégées côté serveur : personne, pas même toi, ne peut les lire avant la date.</p>
      </section>
    </main>
  );
}
