import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import { ThemeToggle } from "./ThemeToggle";
import { SoundToggle } from "./SoundToggle";

const LINKS = [
  { id: "protocol", label: "Protocol", href: "/#protocol" },
  { id: "week", label: "Microcycle", href: "/#week" },
  { id: "chronograph", label: "Chronograph", href: "/#chronograph" },
  { id: "analytics", label: "Analytics", href: "/#analytics" },
];

export function FloatingNav() {
  const [visible, setVisible] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 320);
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <>
      {/* Center nav pill — hidden on mobile, full on md+ */}
      <header
        className={`fixed top-4 md:top-6 left-1/2 -translate-x-1/2 z-50 transition-all duration-700 max-w-[calc(100vw-1.5rem)] ${
          visible ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-4 pointer-events-none"
        }`}
      >
        {/* Desktop: full pill */}
        <nav className="hidden md:flex glass-nav rounded-full pl-5 pr-3 py-2 items-center gap-1">
          <Link to="/" className="flex items-center gap-2.5 mr-3 group shrink-0" aria-label="Home">
            <EmblemMark className="w-5 h-5 text-gold-bright" />
            <span className="font-display text-[11px] tracking-[0.4em] uppercase text-gold-bright/90 group-hover:text-gold-bright transition-colors">
              S · K · P
            </span>
          </Link>
          <div className="h-4 w-px bg-gold-bright/20 mr-1" />
          {LINKS.map((l) => (
            <a
              key={l.id}
              href={l.href}
              className="relative px-3 py-1.5 text-[11px] tracking-[0.28em] uppercase text-foreground/70 hover:text-gold-bright transition-colors rounded-full whitespace-nowrap"
            >
              {l.label}
            </a>
          ))}
        </nav>

        {/* Mobile: compact pill (emblem + hamburger) */}
        <nav className="md:hidden glass-nav rounded-full pl-4 pr-1.5 py-1.5 flex items-center gap-2">
          <Link to="/" className="flex items-center gap-2 shrink-0" aria-label="Home">
            <EmblemMark className="w-6 h-6 text-gold-bright" />
            <span className="font-display text-[11px] tracking-[0.32em] uppercase text-gold-bright/95">
              S·K·P
            </span>
          </Link>
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-label={open ? "Close menu" : "Open menu"}
            className="ml-1 w-11 h-11 rounded-full flex items-center justify-center text-gold-bright/90 hover:text-gold-bright active:scale-95 transition-transform bg-gold/5"
          >
            <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden>
              {open ? (
                <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
              ) : (
                <path d="M4 8h16M4 16h16" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
              )}
            </svg>
          </button>
        </nav>
      </header>

      {/* Separate floating Theme Toggle — always its own button */}
      <div
        className={`fixed top-4 md:top-6 right-4 md:right-6 z-50 transition-all duration-700 ${
          visible ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-4 pointer-events-none"
        }`}
      >
        <div className="glass-nav rounded-full p-1 flex items-center gap-0.5">
          <SoundToggle />
          <span className="w-px h-4 bg-gold-bright/20" />
          <ThemeToggle />
        </div>
      </div>

      {/* Mobile menu sheet */}
      <div
        className={`md:hidden fixed inset-0 z-40 transition-opacity duration-500 ${
          open ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
        aria-hidden={!open}
      >
        <button
          type="button"
          aria-label="Close menu"
          onClick={() => setOpen(false)}
          className="absolute inset-0 bg-background/70 backdrop-blur-md"
        />
        <div
          className={`absolute top-24 left-4 right-4 glass-panel rounded-3xl p-6 flex flex-col gap-1 transition-all duration-500 ${
            open ? "translate-y-0 opacity-100" : "-translate-y-4 opacity-0"
          }`}
        >
          <div className="text-[10px] tracking-[0.45em] uppercase text-gold-bright/70 px-3 pb-3">
            Navigate
          </div>
          {LINKS.map((l) => (
            <a
              key={l.id}
              href={l.href}
              onClick={() => setOpen(false)}
              className="px-4 py-4 text-[13px] tracking-[0.3em] uppercase text-foreground/90 hover:text-gold-bright hover:bg-gold/10 rounded-xl transition-colors border border-transparent hover:border-gold/20"
            >
              {l.label}
            </a>
          ))}
        </div>
      </div>
    </>
  );
}

export function EmblemMark({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 40 40" fill="none" className={className} aria-hidden>
      <defs>
        <linearGradient id="em-g" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="currentColor" stopOpacity="1" />
          <stop offset="1" stopColor="currentColor" stopOpacity="0.4" />
        </linearGradient>
      </defs>
      <path
        d="M20 3 L6 12 L20 20 L34 12 Z M6 12 L6 28 L20 37 L20 20 Z M34 12 L34 28 L20 37 L20 20 Z"
        stroke="url(#em-g)"
        strokeWidth="1.2"
        strokeLinejoin="round"
      />
      <circle cx="20" cy="20" r="1.6" fill="currentColor" />
    </svg>
  );
}
