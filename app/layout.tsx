import type { Metadata, Viewport } from "next";
import { Inter, Fraunces, Caveat } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const fraunces = Fraunces({ subsets: ["latin"], variable: "--font-fraunces", style: ["normal", "italic"] });
const caveat = Caveat({ subsets: ["latin"], variable: "--font-script" });

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000"),
  title: { default: "Birthday Letters", template: "%s · Birthday Letters" },
  description: "Certaines lettres méritent d'attendre. Tes proches t'écrivent, tu les ouvres le jour de ton anniversaire.",
  openGraph: { siteName: "Birthday Letters", locale: "fr_FR", type: "website" },
};
export const viewport: Viewport = { themeColor: "#FAF6EF", width: "device-width", initialScale: 1 };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" className={`${inter.variable} ${fraunces.variable} ${caveat.variable}`}>
      <body className="font-sans antialiased">{children}</body>
    </html>
  );
}
