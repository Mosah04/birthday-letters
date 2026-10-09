"use client";
import { useEffect, useState } from "react";
import QRCode from "qrcode";
import { Check, Copy, Download, Share2 } from "lucide-react";

export default function SharePanel({ url }: { url: string }) {
  const [png, setPng] = useState("");
  const [copied, setCopied] = useState(false);
  useEffect(() => { QRCode.toDataURL(url, { width: 1024, margin: 2, errorCorrectionLevel: "M", color: { dark: "#1F1B16", light: "#FFFDF8" } }).then(setPng); }, [url]);
  const save = (href: string, name: string) => { const a = document.createElement("a"); a.href = href; a.download = name; a.click(); };
  const svg = async () => { const s = await QRCode.toString(url, { type: "svg", margin: 2 }); save(URL.createObjectURL(new Blob([s], { type: "image/svg+xml" })), "qr-birthday-letters.svg"); };
  const copy = async () => { await navigator.clipboard.writeText(url); setCopied(true); setTimeout(() => setCopied(false), 1800); };
  const btn = "inline-flex h-12 items-center gap-2 px-5 rounded-full border border-line text-sm active:scale-95 transition";
  return (
    <section className="rounded-2xl bg-card ring-1 ring-line p-6 text-center">
      {png ? <img src={png} alt="QR code vers ta page d'anniversaire" className="mx-auto size-52 rounded-xl bg-white p-2" /> : <div className="mx-auto size-48 animate-pulse rounded bg-line" />}
      <p className="mt-4 break-all font-serif">{url.replace(/^https?:\/\//, "")}</p>
      <div className="mt-5 flex flex-wrap justify-center gap-2">
        <button onClick={copy} className={btn}>{copied ? <Check size={16} /> : <Copy size={16} />}{copied ? "Copié" : "Copier le lien"}</button>
        {typeof navigator !== "undefined" && "share" in navigator && <button onClick={() => navigator.share({ title: "Écris-moi une lettre 💌", url })} className={btn}><Share2 size={16} />Partager</button>}
        <button onClick={() => png && save(png, "qr-birthday-letters.png")} className={btn}><Download size={16} />PNG</button>
        <button onClick={svg} className={btn}><Download size={16} />SVG</button>
      </div>
    </section>
  );
}
