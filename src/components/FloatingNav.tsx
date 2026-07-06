import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";

const LINKS = [
  { id: "protocol", label: "Protocol", href: "/#protocol" },
  { id: "week", label: "Microcycle", href: "/#week" },
  { id: "chronograph", label: "Chronograph", href: "/#chronograph" },
  { id: "analytics", label: "Analytics", href: "/#analytics" },
];

export function FloatingNav() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 320);
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed top-6 left-1/2 -translate-x-1/2 z-50 transition-all duration-700 ${
        visible
          ? "opacity-100 translate-y-0"
          : "opacity-0 -translate-y-4 pointer-events-none"
      }`}
    >
      <nav className="glass-nav rounded-full pl-5 pr-2 py-2 flex items-center gap-1">
        <Link
          to="/"
          className="flex items-center gap-2.5 mr-3 group"
          aria-label="Home"
        >
          <EmblemMark className="w-5 h-5 text-gold-bright" />
          <span className="font-display text-[11px] tracking-[0.4em] uppercase text-gold-bright/90 group-hover:text-gold-bright transition-colors hidden sm:inline">
            S · K · P
          </span>
        </Link>
        <div className="h-4 w-px bg-gold-bright/20 mr-1 hidden sm:block" />
        {LINKS.map((l) => (
          <a
            key={l.id}
            href={l.href}
            className="relative px-3 py-1.5 text-[11px] tracking-[0.28em] uppercase text-foreground/70 hover:text-gold-bright transition-colors rounded-full"
          >
            {l.label}
          </a>
        ))}
      </nav>
    </header>
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
