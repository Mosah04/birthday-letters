"use client";
import { useEffect, useState } from "react";
import QRCode from "qrcode";
import { Check, Copy, Download, Share2, MessageCircle, QrCode, ExternalLink } from "lucide-react";
import { sounds } from "@/lib/sound";

export default function SharePanel({ url }: { url: string }) {
  const [png, setPng] = useState("");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    QRCode.toDataURL(url, {
      width: 1024,
      margin: 2,
      errorCorrectionLevel: "M",
      color: { dark: "#1A1615", light: "#FFFDF9" },
    }).then(setPng);
  }, [url]);

  const save = (href: string, name: string) => {
    sounds.click();
    const a = document.createElement("a");
    a.href = href;
    a.download = name;
    a.click();
  };

  const downloadSvg = async () => {
    sounds.click();
    const s = await QRCode.toString(url, { type: "svg", margin: 2 });
    save(
      URL.createObjectURL(new Blob([s], { type: "image/svg+xml" })),
      "qr-birthday-letters.svg"
    );
  };

  const copy = async () => {
    sounds.click();
    await navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const shareNative = () => {
    sounds.click();
    if (typeof navigator !== "undefined" && "share" in navigator) {
      navigator.share({
        title: "Écris-moi une lettre pour mon anniversaire 💌",
        text: "Glisse un mot dans ma capsule, elle ne s'ouvrira que le jour de mon anniversaire !",
        url,
      });
    }
  };

  const shareWhatsApp = () => {
    sounds.click();
    const text = encodeURIComponent(
      `Écris-moi une lettre secrète pour mon anniversaire 💌 Elle restera scellée jusqu'au jour J : ${url}`
    );
    window.open(`https://api.whatsapp.com/send?text=${text}`, "_blank");
  };

  const btn =
    "inline-flex h-11 items-center gap-2 px-4 rounded-full border border-line bg-card text-xs font-medium text-ink shadow-sm transition hover:border-line-strong hover:bg-paper active:scale-95";

  return (
    <section className="rounded-3xl border border-line bg-card/90 p-6 sm:p-8 text-center shadow-lg backdrop-blur-sm">
      <div className="mx-auto max-w-md">
        <div className="flex items-center justify-center gap-2 text-xs font-semibold uppercase tracking-wider text-accent mb-2">
          <QrCode size={15} />
          <span>Partage ta capsule</span>
        </div>
        <h3 className="font-serif text-2xl font-medium text-ink">
          Invite tes proches à t&apos;écrire
        </h3>
        <p className="mt-1 text-xs sm:text-sm text-muted">
          Partage ton lien par message ou glisse le QR Code dans une carte de vœux.
        </p>

        {/* QR Code Presentation Box */}
        <div className="mt-6 mx-auto w-fit rounded-2xl border border-line bg-paper p-4 shadow-inner">
          {png ? (
            <img
              src={png}
              alt="QR Code de ta capsule d'anniversaire"
              className="size-48 sm:size-56 rounded-xl bg-white p-2.5 shadow-sm"
            />
          ) : (
            <div className="size-48 sm:size-56 animate-pulse rounded-xl bg-line/40" />
          )}
        </div>

        {/* URL Pill */}
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

        {/* Action Buttons */}
        <div className="mt-5 flex flex-wrap justify-center gap-2.5">
          <button onClick={copy} className={`${btn} ${copied ? "border-accent text-accent font-semibold" : ""}`}>
            {copied ? <Check size={15} /> : <Copy size={15} />}
            <span>{copied ? "Lien copié !" : "Copier le lien"}</span>
          </button>

          <button onClick={shareWhatsApp} className={btn}>
            <MessageCircle size={15} className="text-[#25D366]" />
            <span>WhatsApp</span>
          </button>

          {typeof navigator !== "undefined" && "share" in navigator && (
            <button onClick={shareNative} className={btn}>
              <Share2 size={15} />
              <span>Partager</span>
            </button>
          )}

          <button onClick={() => png && save(png, "qr-birthday-letters.png")} className={btn}>
            <Download size={14} />
            <span>QR PNG</span>
          </button>

          <button onClick={downloadSvg} className={btn}>
            <Download size={14} />
            <span>SVG</span>
          </button>
        </div>
      </div>
    </section>
  );
}
