"use client";
import { useEffect, useState } from "react";
import { Sun, Moon } from "lucide-react";
import { sounds } from "@/lib/sound";

export default function ThemeToggle() {
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const saved = localStorage.getItem("bl_theme") as "light" | "dark" | null;
    if (saved) {
      setTheme(saved);
      document.documentElement.classList.remove("light", "dark");
      document.documentElement.classList.add(saved);
    } else {
      const isDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
      setTheme(isDark ? "dark" : "light");
      document.documentElement.classList.remove("light", "dark");
      document.documentElement.classList.add(isDark ? "dark" : "light");
    }
  }, []);

  const toggleTheme = () => {
    sounds.click();
    const nextTheme = theme === "dark" ? "light" : "dark";
    setTheme(nextTheme);
    localStorage.setItem("bl_theme", nextTheme);
    document.documentElement.classList.remove("light", "dark");
    document.documentElement.classList.add(nextTheme);
  };

  if (!mounted) {
    return (
      <div className="size-9 rounded-full border border-line bg-card/60" aria-hidden />
    );
  }

  return (
    <button
      onClick={toggleTheme}
      aria-label={theme === "dark" ? "Activer le mode clair" : "Activer le mode sombre"}
      title={theme === "dark" ? "Passer en mode clair" : "Passer en mode sombre"}
      className="grid size-9 place-items-center rounded-full border border-line bg-card/60 text-muted transition hover:text-ink hover:border-line-strong active:scale-95 shadow-sm"
    >
      {theme === "dark" ? (
        <Sun size={16} className="text-gold transition-transform hover:rotate-45" />
      ) : (
        <Moon size={15} className="text-accent transition-transform hover:-rotate-12" />
      )}
    </button>
  );
}
