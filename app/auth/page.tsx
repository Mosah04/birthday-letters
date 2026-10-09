import { redirect } from "next/navigation";
import { auth, signIn } from "@/auth";

export const metadata = { title: "Connexion" };

export default async function AuthPage() {
  if ((await auth())?.user) redirect("/dashboard");
  return (
    <main className="grid min-h-dvh place-items-center px-6">
      <div className="w-full max-w-sm text-center">
        <span className="text-3xl" aria-hidden>💌</span>
        <h1 className="mt-4 font-serif text-3xl">Bienvenue</h1>
        <p className="mt-2 text-[#6B6257]">Une seule étape pour créer ton espace.</p>
        <form action={async () => { "use server"; await signIn("google", { redirectTo: "/dashboard" }); }} className="mt-8">
          <button className="flex h-14 w-full items-center justify-center gap-3 rounded-full border border-black/15 bg-white transition active:scale-95 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#B8806A]">
            <svg width="18" height="18" viewBox="0 0 48 48" aria-hidden><path fill="#EA4335" d="M24 9.5c3.5 0 6.6 1.2 9.1 3.6l6.8-6.8C35.8 2.4 30.3 0 24 0 14.6 0 6.5 5.4 2.6 13.2l7.9 6.1C12.4 13.6 17.7 9.5 24 9.5z"/><path fill="#4285F4" d="M46.1 24.5c0-1.6-.1-3.1-.4-4.5H24v9h12.4c-.5 2.9-2.2 5.3-4.6 6.9l7.4 5.7c4.3-4 6.9-9.9 6.9-17.1z"/><path fill="#FBBC05" d="M10.5 28.7c-.5-1.4-.8-3-.8-4.7s.3-3.2.8-4.7l-7.9-6.1C.9 16.5 0 20.1 0 24s.9 7.5 2.6 10.8l7.9-6.1z"/><path fill="#34A853" d="M24 48c6.5 0 11.9-2.1 15.9-5.8l-7.4-5.7c-2.1 1.4-4.8 2.3-8.5 2.3-6.3 0-11.6-4.1-13.5-9.8l-7.9 6.1C6.5 42.6 14.6 48 24 48z"/></svg>
            Continue with Google
          </button>
        </form>
      </div>
    </main>
  );
}
