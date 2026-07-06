import { useEffect, useState } from "react";

export type Theme = "dark" | "light";
const KEY = "sr:theme";

function apply(theme: Theme) {
  const root = document.documentElement;
  root.classList.toggle("light", theme === "light");
  root.classList.toggle("dark", theme === "dark");
  root.style.colorScheme = theme;
}

export function useTheme() {
  const [theme, setTheme] = useState<Theme>("dark");

  useEffect(() => {
    if (typeof window === "undefined") return;
    const stored = (window.localStorage.getItem(KEY) as Theme | null) ?? "dark";
    setTheme(stored);
    apply(stored);
  }, []);

  const toggle = () => {
    const next: Theme = theme === "dark" ? "light" : "dark";
    setTheme(next);
    apply(next);
    try { window.localStorage.setItem(KEY, next); } catch { /* ignore */ }
  };

  return { theme, toggle };
}
