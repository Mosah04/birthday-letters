"use client";
import { useActionState } from "react";
import { createProfile } from "@/app/dashboard/actions";

export default function CreateProfileForm({ defaultName }: { defaultName: string }) {
  const [err, action, pending] = useActionState(createProfile, null);
  const input = "h-12 w-full rounded-lg border border-line bg-card px-4 outline-none focus:border-accent";
  return (
    <form action={action} className="space-y-4 text-left">
      <label className="block text-sm">Ton prénom<input name="displayName" defaultValue={defaultName} required className={input} /></label>
      <label className="block text-sm">Ton anniversaire<input name="birthday" type="date" required className={input} /></label>
      <label className="block text-sm">Ton adresse<div className="flex items-center gap-1 text-muted">birthdayletters.com/<input name="slug" required pattern="[a-z0-9\-]{3,30}" className={input} /></div></label>
      <label className="block text-sm">Une phrase (facultatif)<input name="description" maxLength={140} className={input} /></label>
      {err && <p role="alert" className="text-sm text-red-600 dark:text-red-400">{err}</p>}
      <button disabled={pending} className="h-14 w-full rounded-full bg-ink text-paper disabled:opacity-50">{pending ? "Création…" : "Créer mon espace"}</button>
    </form>
  );
}
