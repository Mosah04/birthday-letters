import { redirect } from "next/navigation";
import Link from "next/link";
import { auth, signIn } from "@/auth";
import { Mail, ArrowLeft, Sparkles, User, ShieldCheck } from "lucide-react";

export const metadata = { title: "Connexion · Birthday Letters" };

export default async function AuthPage() {
  const session = await auth();
  if (session?.user) redirect("/dashboard");

  return (
    <main className="relative grid min-h-dvh place-items-center px-6 py-12">
      {/* Background ambient light */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 size-96 rounded-full bg-accent/10 blur-3xl pointer-events-none" />

      {/* Back link */}
      <div className="absolute top-6 left-6 sm:top-8 sm:left-8">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-xs font-medium text-muted hover:text-ink transition border border-line rounded-full px-3.5 py-1.5 bg-card/60 backdrop-blur-sm"
        >
          <ArrowLeft size={14} />
          <span>Retour à l&apos;accueil</span>
        </Link>
      </div>

      <div className="w-full max-w-sm text-center relative z-10">
        {/* Seal Icon */}
        <div className="relative mx-auto grid size-16 place-items-center rounded-full bg-accent/10 border border-accent/25 text-accent shadow-sm wax-pulse">
          <Mail size={26} aria-hidden />
          <span className="absolute -top-1 -right-1 size-3 rounded-full bg-wax" />
        </div>

        <h1 className="mt-6 font-serif text-3xl sm:text-4xl tracking-tight text-ink">
          Bienvenue dans ta capsule
        </h1>
        <p className="mt-2 text-sm text-muted">
          Connecte-toi pour créer ton espace ou consulter tes lettres.
        </p>

        {/* Auth Options */}
        <div className="mt-8 space-y-4">
          {/* Google Sign In Form */}
          <form
            action={async () => {
              "use server";
              await signIn("google", { redirectTo: "/dashboard" });
            }}
          >
            <button
              type="submit"
              className="flex h-13 w-full items-center justify-center gap-3 rounded-2xl border border-line bg-card font-medium text-sm text-ink shadow-sm transition hover:border-line-strong hover:shadow active:scale-95 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
            >
              <svg width="18" height="18" viewBox="0 0 48 48" aria-hidden>
                <path fill="#EA4335" d="M24 9.5c3.5 0 6.6 1.2 9.1 3.6l6.8-6.8C35.8 2.4 30.3 0 24 0 14.6 0 6.5 5.4 2.6 13.2l7.9 6.1C12.4 13.6 17.7 9.5 24 9.5z" />
                <path fill="#4285F4" d="M46.1 24.5c0-1.6-.1-3.1-.4-4.5H24v9h12.4c-.5 2.9-2.2 5.3-4.6 6.9l7.4 5.7c4.3-4 6.9-9.9 6.9-17.1z" />
                <path fill="#FBBC05" d="M10.5 28.7c-.5-1.4-.8-3-.8-4.7s.3-3.2.8-4.7l-7.9-6.1C.9 16.5 0 20.1 0 24s.9 7.5 2.6 10.8l7.9-6.1z" />
                <path fill="#34A853" d="M24 48c6.5 0 11.9-2.1 15.9-5.8l-7.4-5.7c-2.1 1.4-4.8 2.3-8.5 2.3-6.3 0-11.6-4.1-13.5-9.8l-7.9 6.1C6.5 42.6 14.6 48 24 48z" />
              </svg>
              <span>Continuer avec Google</span>
            </button>
          </form>

          {/* Divider */}
          <div className="relative my-4 flex items-center justify-center">
            <div className="w-full border-t border-line" />
            <span className="absolute bg-paper px-3 text-xs uppercase tracking-wider text-muted font-mono">
              ou
            </span>
          </div>

          {/* Quick Demo / Direct Access Form */}
          <div className="rounded-2xl border border-line bg-card/80 p-5 shadow-sm text-left">
            <div className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-accent mb-3">
              <Sparkles size={14} />
              <span>Accès Direct &amp; Démo</span>
            </div>
            <form
              action={async (formData: FormData) => {
                "use server";
                const name = (formData.get("name") as string) || "Clara";
                await signIn("credentials", { name, redirectTo: "/dashboard" });
              }}
              className="space-y-3"
            >
              <div>
                <label htmlFor="name-input" className="block text-xs font-medium text-muted mb-1">
                  Ton prénom ou pseudo
                </label>
                <input
                  id="name-input"
                  name="name"
                  defaultValue="Clara"
                  required
                  placeholder="Ex. Clara, Alex, Sam..."
                  className="h-11 w-full rounded-xl border border-line bg-paper px-3 text-sm font-medium outline-none focus:border-accent transition"
                />
              </div>

              <button
                type="submit"
                className="flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-ink text-paper text-sm font-medium shadow transition hover:bg-accent active:scale-95"
              >
                <User size={15} />
                <span>Entrer instantanément</span>
              </button>
            </form>
          </div>
        </div>

        <p className="mt-8 flex items-center justify-center gap-1.5 text-xs text-muted">
          <ShieldCheck size={14} className="text-gold" />
          <span>Accès crypté · Données protégées</span>
        </p>
      </div>
    </main>
  );
}
