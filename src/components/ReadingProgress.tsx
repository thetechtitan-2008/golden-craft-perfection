import { useEffect, useState } from "react";

/**
 * Hair-thin reading progress rail — for long-form routes.
 * Positioned below the top scroll-progress bar.
 */
export function ReadingProgress() {
  const [pct, setPct] = useState(0);
  useEffect(() => {
    let raf = 0;
    const update = () => {
      const doc = document.documentElement;
      const max = doc.scrollHeight - window.innerHeight;
      setPct(max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0);
      raf = 0;
    };
    const onScroll = () => { if (!raf) raf = requestAnimationFrame(update); };
    window.addEventListener("scroll", onScroll, { passive: true });
    update();
    return () => { window.removeEventListener("scroll", onScroll); if (raf) cancelAnimationFrame(raf); };
  }, []);
  return (
    <div
      className="fixed left-4 top-1/2 -translate-y-1/2 z-40 hidden md:flex flex-col items-center gap-3"
      aria-hidden
    >
      <span className="font-mono text-[9px] tracking-[0.4em] uppercase text-gold-bright/60">
        {String(Math.round(pct * 100)).padStart(2, "0")}
      </span>
      <div className="relative h-40 w-px bg-foreground/10 overflow-hidden rounded-full">
        <div
          className="absolute left-0 top-0 w-full origin-top bg-gradient-to-b from-[color:var(--gold-highlight)] via-[color:var(--gold-bright)] to-[color:var(--gold)]"
          style={{ height: "100%", transform: `scaleY(${pct})`, transformOrigin: "top" }}
        />
      </div>
    </div>
  );
}
