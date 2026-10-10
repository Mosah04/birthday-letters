"use client";
import { useEffect, useState } from "react";
import QRCode from "qrcode";
import NextImage from "next/image";
import {
  Check,
  Copy,
  Download,
  Share2,
  MessageCircle,
  QrCode,
  ExternalLink,
} from "lucide-react";
import { sounds } from "@/lib/sound";

type ShareArtwork = {
  png: string;
  svg: string;
};

const escapeXml = (value: string) =>
  value.replace(/[<>&'"]/g, (character) => {
    const entities: Record<string, string> = {
      "<": "&lt;",
      ">": "&gt;",
      "&": "&amp;",
      "'": "&apos;",
      '"': "&quot;",
    };
    return entities[character];
  });

const createPosterSvg = (qrPng: string, recipientName: string) => {
  const recipient = escapeXml(recipientName.trim().slice(0, 42) || "toi");

  return `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="1500" viewBox="0 0 1200 1500">
  <defs>
    <linearGradient id="paper" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#fffdf9"/>
      <stop offset="1" stop-color="#f5ecdf"/>
    </linearGradient>
    <linearGradient id="seal" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#c8664d"/>
      <stop offset="1" stop-color="#8f3428"/>
    </linearGradient>
  </defs>
  <rect width="1200" height="1500" fill="#211815"/>
  <rect x="24" y="24" width="1152" height="1452" rx="40" fill="url(#paper)"/>
  <rect x="48" y="48" width="1104" height="1404" rx="30" fill="none" stroke="#d7c4a8" stroke-width="2"/>
  <circle cx="600" cy="135" r="39" fill="url(#seal)"/>
  <path d="M580 126h40a4 4 0 0 1 4 4v25a4 4 0 0 1-4 4h-40a4 4 0 0 1-4-4v-25a4 4 0 0 1 4-4Zm-3 3 23 18 23-18" fill="none" stroke="#fff8ed" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
  <text x="600" y="214" text-anchor="middle" fill="#382722" font-family="Georgia,serif" font-size="35" font-weight="700" letter-spacing="1">Birthday <tspan fill="#ad4b37" font-style="italic" font-weight="400">Letters</tspan></text>
  <text x="600" y="270" text-anchor="middle" fill="#9b634d" font-family="Arial,sans-serif" font-size="18" font-weight="700" letter-spacing="5">CAPSULE D'ANNIVERSAIRE</text>
  <path d="M510 300h180" stroke="#d9c6a9" stroke-width="2"/>
  <text x="600" y="351" text-anchor="middle" fill="#78665a" font-family="Arial,sans-serif" font-size="19" font-weight="700" letter-spacing="3">UNE LETTRE SCELLÉE POUR</text>
  <text x="600" y="405" text-anchor="middle" fill="#30211e" font-family="Georgia,serif" font-size="43" font-style="italic">${recipient}</text>
  <rect x="196" y="438" width="808" height="808" rx="32" fill="#fffdf8" stroke="#e2d4bf" stroke-width="2"/>
  <image href="${qrPng}" x="220" y="462" width="760" height="760" preserveAspectRatio="xMidYMid meet"/>
  <text x="600" y="1302" text-anchor="middle" fill="#382722" font-family="Georgia,serif" font-size="30" font-weight="700">Scanne pour lui écrire</text>
  <text x="600" y="1345" text-anchor="middle" fill="#78665a" font-family="Arial,sans-serif" font-size="20">Ta lettre restera scellée jusqu'au jour J.</text>
  <circle cx="600" cy="1400" r="4" fill="#b85038"/>
  <text x="600" y="1433" text-anchor="middle" fill="#9b634d" font-family="Arial,sans-serif" font-size="14" font-weight="700" letter-spacing="3">UN MOT DU CŒUR, À OUVRIR LE BON JOUR</text>
</svg>`;
};

const renderPng = (svg: string) =>
  new Promise<string>((resolve, reject) => {
    const objectUrl = URL.createObjectURL(
      new Blob([svg], { type: "image/svg+xml;charset=utf-8" })
    );
    const image = new Image();

    image.onload = () => {
      URL.revokeObjectURL(objectUrl);
      const canvas = document.createElement("canvas");
      canvas.width = 1200;
      canvas.height = 1500;
      const context = canvas.getContext("2d");
      if (!context) {
        reject(new Error("Le navigateur ne peut pas créer l’image PNG."));
        return;
      }
      context.drawImage(image, 0, 0, canvas.width, canvas.height);
      resolve(canvas.toDataURL("image/png"));
    };

    image.onerror = () => {
      URL.revokeObjectURL(objectUrl);
      reject(new Error("Le visuel de partage n’a pas pu être généré."));
    };
    image.src = objectUrl;
  });

export default function SharePanel({
  url,
  recipientName,
}: {
  url: string;
  recipientName: string;
}) {
  const [generation, setGeneration] = useState<{
    key: string;
    artwork?: ShareArtwork;
    error?: string;
  } | null>(null);
  const [copied, setCopied] = useState(false);
  const [actionError, setActionError] = useState<{
    key: string;
    message: string;
  } | null>(null);
  const artworkKey = `${url}\n${recipientName}`;
  const artwork = generation?.key === artworkKey ? generation.artwork : null;
  const error =
    (actionError?.key === artworkKey ? actionError.message : null) ??
    (generation?.key === artworkKey ? generation.error : null);

  useEffect(() => {
    let cancelled = false;

    const generateArtwork = async () => {
      try {
        const qrPng = await QRCode.toDataURL(url, {
          width: 800,
          margin: 4,
          errorCorrectionLevel: "H",
          color: { dark: "#2d1c1a", light: "#fffdf8" },
        });
        const svg = createPosterSvg(qrPng, recipientName);
        const png = await renderPng(svg);
        if (!cancelled) {
          setGeneration({ key: artworkKey, artwork: { png, svg } });
        }
      } catch (cause) {
        console.error("Unable to generate the capsule QR artwork.", cause);
        if (!cancelled) {
          setGeneration({
            key: artworkKey,
            error: "Le visuel du QR Code n’a pas pu être créé. Réessaie dans un instant.",
          });
        }
      }
    };

    void generateArtwork();
    return () => {
      cancelled = true;
    };
  }, [url, recipientName, artworkKey]);

  const save = (href: string, name: string) => {
    sounds.click();
    const anchor = document.createElement("a");
    anchor.href = href;
    anchor.download = name;
    anchor.click();
    if (href.startsWith("blob:")) {
      window.setTimeout(() => URL.revokeObjectURL(href), 1000);
    }
  };

  const downloadSvg = () => {
    if (!artwork) return;
    const href = URL.createObjectURL(
      new Blob([artwork.svg], { type: "image/svg+xml;charset=utf-8" })
    );
    save(href, "birthday-letters-capsule.svg");
  };

  const copy = async () => {
    sounds.click();
    setActionError(null);
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch (cause) {
      console.error("Unable to copy the capsule link.", cause);
      setActionError({
        key: artworkKey,
        message: "Impossible de copier le lien depuis ce navigateur.",
      });
    }
  };

  const shareNative = async () => {
    sounds.click();
    setActionError(null);
    if (typeof navigator.share !== "function") {
      setActionError({
        key: artworkKey,
        message: "Le partage natif n’est pas disponible sur ce navigateur.",
      });
      return;
    }
    try {
      await navigator.share({
        title: `Écris une lettre pour ${recipientName} · Birthday Letters`,
        text: `Scanne ou ouvre ce lien pour écrire à ${recipientName}. Ta lettre restera scellée jusqu'au jour J.`,
        url,
      });
      setActionError(null);
    } catch (cause) {
      if (cause instanceof DOMException && cause.name === "AbortError") return;
      console.error("Unable to share the capsule.", cause);
      setActionError({
        key: artworkKey,
        message: "Le partage n’a pas abouti. Tu peux copier le lien à la place.",
      });
    }
  };

  const shareWhatsApp = () => {
    sounds.click();
    setActionError(null);
    const text = encodeURIComponent(
      `Écris une lettre secrète pour ${recipientName} avec Birthday Letters 💌 Elle restera scellée jusqu'au jour J : ${url}`
    );
    window.open(`https://api.whatsapp.com/send?text=${text}`, "_blank", "noopener,noreferrer");
  };

  const btn =
    "inline-flex h-11 items-center gap-2 px-4 rounded-full border border-line bg-card text-xs font-medium text-ink shadow-sm transition hover:border-line-strong hover:bg-paper active:scale-95 disabled:cursor-not-allowed disabled:opacity-50";

  return (
    <section className="rounded-3xl border border-line bg-card/90 p-6 sm:p-8 text-center shadow-lg backdrop-blur-sm">
      <div className="mx-auto max-w-md">
        <div className="flex items-center justify-center gap-2 text-xs font-semibold uppercase tracking-wider text-accent mb-2">
          <QrCode size={15} />
          <span>Partage ta capsule</span>
        </div>
        <h3 className="font-serif text-2xl font-medium text-ink">
          Invite tes proches à écrire à {recipientName}
        </h3>
        <p className="mt-1 text-xs sm:text-sm text-muted">
          Ce QR ouvre la capsule de {recipientName} pour y déposer une lettre scellée jusqu&apos;à son anniversaire.
        </p>

        <div className="mt-6 mx-auto w-fit rounded-2xl border border-line bg-paper p-3 shadow-inner">
          {artwork ? (
            <NextImage
              src={artwork.png}
              alt={`Carte Birthday Letters : scanne pour écrire à ${recipientName}, ta lettre restera scellée jusqu’au jour J.`}
              width={1200}
              height={1500}
              unoptimized
              className="h-auto w-60 rounded-xl shadow-sm sm:w-72"
            />
          ) : (
            <div className="flex size-60 sm:size-72 flex-col items-center justify-center gap-3 rounded-xl bg-card text-muted">
              {error ? <QrCode size={24} /> : <div className="size-8 animate-spin rounded-full border-2 border-line border-t-accent" />}
              <span className="px-6 text-xs">{error ? "Visuel indisponible" : "Préparation de ta carte…"}</span>
            </div>
          )}
        </div>

        <div className="mt-4 flex items-center justify-between rounded-xl border border-line bg-paper px-3.5 py-2 text-xs font-mono text-muted">
          <span className="truncate pr-2">{url.replace(/^https?:\/\//, "")}</span>
          <a
            href={url}
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-1 text-accent hover:underline font-sans font-medium"
          >
            <span>Voir</span>
            <ExternalLink size={12} />
          </a>
        </div>

        <div className="mt-5 flex flex-wrap justify-center gap-2.5">
          <button onClick={copy} className={`${btn} ${copied ? "border-accent text-accent font-semibold" : ""}`}>
            {copied ? <Check size={15} /> : <Copy size={15} />}
            <span>{copied ? "Lien copié !" : "Copier le lien"}</span>
          </button>

          <button onClick={shareWhatsApp} className={btn}>
            <MessageCircle size={15} className="text-[#25D366]" />
            <span>WhatsApp</span>
          </button>

          <button onClick={shareNative} className={btn}>
            <Share2 size={15} />
            <span>Partager</span>
          </button>

          <button
            onClick={() => artwork && save(artwork.png, "birthday-letters-capsule.png")}
            className={btn}
            disabled={!artwork}
          >
            <Download size={14} />
            <span>Carte PNG</span>
          </button>

          <button onClick={downloadSvg} className={btn} disabled={!artwork}>
            <Download size={14} />
            <span>Carte SVG</span>
          </button>
        </div>

        {error && (
          <p role="alert" className="mt-4 text-xs text-red-600 dark:text-red-400">
            {error}
          </p>
        )}
      </div>
    </section>
  );
}
