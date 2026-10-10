"use client";
import { useState, useActionState } from "react";
import { createProfile } from "@/app/dashboard/actions";
import { ArrowRight, Loader2, Calendar, Link as LinkIcon, User, MessageSquare } from "lucide-react";
import { sounds } from "@/lib/sound";

const slugFromName = (name: string) =>
  name
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 30);

export default function CreateProfileForm({ defaultName }: { defaultName: string }) {
  const [err, action, pending] = useActionState(createProfile, null);
  const [name, setName] = useState(defaultName || "");
  const [slug, setSlug] = useState(() => slugFromName(defaultName));
  const [slugManuallyEdited, setSlugManuallyEdited] = useState(false);

  const inputClass =
    "h-12 w-full rounded-xl border border-line bg-card px-4 text-sm font-medium text-ink outline-none transition focus:border-accent focus:ring-2 focus:ring-accent/15";

  return (
    <form
      action={action}
      onSubmit={() => sounds.click()}
      className="space-y-5 text-left"
    >
      {/* Display Name */}
      <div>
        <label className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-muted mb-2">
          <User size={14} className="text-accent" />
          <span>Ton prénom ou nom</span>
        </label>
        <input
          name="displayName"
          value={name}
          onChange={(e) => {
            const nextName = e.target.value;
            setName(nextName);
            if (!slugManuallyEdited && nextName) {
              setSlug(slugFromName(nextName) || "mon-anniversaire");
            }
          }}
          required
          placeholder="Ex. Clara, Lucas..."
          maxLength={60}
          className={inputClass}
        />
      </div>

      {/* Birthday Date */}
      <div>
        <label className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-muted mb-2">
          <Calendar size={14} className="text-accent" />
          <span>Ta date d&apos;anniversaire</span>
        </label>
        <input
          name="birthday"
          type="date"
          required
          className={inputClass}
        />
        <p className="mt-1.5 text-[11px] text-muted">
          La capsule s&apos;ouvrira automatiquement à minuit le jour venu.
        </p>
      </div>

      {/* Slug / Address */}
      <div>
        <label className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-muted mb-2">
          <LinkIcon size={14} className="text-accent" />
          <span>Ton adresse personnalisée</span>
        </label>
        <div className="flex items-center rounded-xl border border-line bg-card overflow-hidden focus-within:border-accent focus-within:ring-2 focus-within:ring-accent/15 transition">
          <span className="bg-paper px-3 py-3 text-xs font-mono text-muted border-r border-line select-none">
            /
          </span>
          <input
            name="slug"
            value={slug}
            onChange={(e) => {
              setSlug(e.target.value);
              setSlugManuallyEdited(true);
            }}
            required
            pattern="[a-z0-9\-]{3,30}"
            placeholder="clara-25ans"
            maxLength={30}
            className="h-12 flex-1 bg-transparent px-3 text-sm font-mono text-ink outline-none"
          />
        </div>
        <p className="mt-1.5 text-[11px] text-muted">
          3 à 30 caractères (lettres minuscules, chiffres, tirets).
        </p>
      </div>

      {/* Description / Personal Note */}
      <div>
        <label className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-muted mb-2">
          <MessageSquare size={14} className="text-accent" />
          <span>Un petit mot d&apos;accueil (facultatif)</span>
        </label>
        <input
          name="description"
          maxLength={140}
          placeholder="« Laissez-moi vos plus beaux mots pour mes 25 ans ! »"
          className={inputClass}
        />
      </div>

      {/* Error Message */}
      {err && (
        <div role="alert" className="rounded-xl border border-red-500/20 bg-red-500/10 p-3.5 text-sm text-red-600 dark:text-red-400">
          {err}
        </div>
      )}

      {/* Submit Button */}
      <button
        type="submit"
        disabled={pending}
        className="flex h-13 w-full items-center justify-center gap-2 rounded-full bg-ink text-paper font-medium text-sm shadow-md transition hover:bg-accent active:scale-95 disabled:opacity-50"
      >
        {pending ? (
          <>
            <Loader2 size={16} className="animate-spin" />
            <span>Création de ta capsule...</span>
          </>
        ) : (
          <>
            <span>Créer mon espace &amp; sceller</span>
            <ArrowRight size={16} />
          </>
        )}
      </button>
    </form>
  );
}
