"use client";
import { useEffect, useSyncExternalStore } from "react";
import { Sun, Moon } from "lucide-react";
import { sounds } from "@/lib/sound";

type Theme = "light" | "dark";

const listeners = new Set<() => void>();

const getTheme = (): Theme => {
  const saved = localStorage.getItem("bl_theme");
  if (saved === "light" || saved === "dark") return saved;
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
};

const applyTheme = (theme: Theme) => {
  document.documentElement.classList.remove("light", "dark");
  document.documentElement.classList.add(theme);
};

const notifyThemeChange = () => {
  listeners.forEach((listener) => listener());
};

const subscribeToTheme = (onChange: () => void) => {
  const media = window.matchMedia("(prefers-color-scheme: dark)");
  const handleStorage = (event: StorageEvent) => {
    if (event.key === "bl_theme") notifyThemeChange();
  };
  listeners.add(onChange);
  media.addEventListener("change", onChange);
  window.addEventListener("storage", handleStorage);
  return () => {
    listeners.delete(onChange);
    media.removeEventListener("change", onChange);
    window.removeEventListener("storage", handleStorage);
  };
};

export default function ThemeToggle() {
  const theme = useSyncExternalStore<Theme>(
    subscribeToTheme,
    getTheme,
    () => "light"
  );

  useEffect(() => {
    applyTheme(theme);
  }, [theme]);

  const toggleTheme = () => {
    sounds.click();
    const nextTheme = theme === "dark" ? "light" : "dark";
    localStorage.setItem("bl_theme", nextTheme);
    applyTheme(nextTheme);
    notifyThemeChange();
  };

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
