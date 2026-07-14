import { useEffect, useRef, useState } from "react";
import architectAsset from "@/assets/architect-portrait.png.asset.json";

/**
 * Editorial portrait section — an elegant, magazine-style spread
 * introducing "The Architect" with a parallax-driven portrait, gold
 * corner rules, editorial dropcap, and stagger-reveal typography.
 */
export function ArchitectPortrait() {
  const sectionRef = useRef<HTMLElement>(null);
  const imgRef = useRef<HTMLDivElement>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) return;

    let raf = 0;
    const onScroll = () => {
      if (raf) return;
      raf = requestAnimationFrame(() => {
        raf = 0;
        const el = sectionRef.current;
        const img = imgRef.current;
        if (!el || !img) return;
        const rect = el.getBoundingClientRect();
        const vh = window.innerHeight;
        // -0.5 .. +0.5 across the viewport pass
        const p = (rect.top + rect.height / 2 - vh / 2) / vh;
        const y = Math.max(-1, Math.min(1, p)) * -40;
        img.style.transform = `translate3d(0, ${y}px, 0) scale(1.04)`;
      });
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      id="architect"
      className="relative py-32 px-6 overflow-hidden"
      aria-labelledby="architect-heading"
    >
      <div className="max-w-6xl mx-auto grid lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] gap-14 items-center">
        {/* Portrait */}
        <div className="relative" data-reveal>
          <div
            className="relative aspect-[4/5] overflow-hidden rounded-sm border border-gold/20"
            style={{
              boxShadow:
                "0 40px 120px -30px rgba(0,0,0,0.7), inset 0 0 0 1px rgba(212,175,55,0.15)",
            }}
          >
            {/* Corner rules */}
            <span className="absolute top-3 left-3 w-6 h-6 border-t border-l border-gold-bright/70 z-20 pointer-events-none" />
            <span className="absolute top-3 right-3 w-6 h-6 border-t border-r border-gold-bright/70 z-20 pointer-events-none" />
            <span className="absolute bottom-3 left-3 w-6 h-6 border-b border-l border-gold-bright/70 z-20 pointer-events-none" />
            <span className="absolute bottom-3 right-3 w-6 h-6 border-b border-r border-gold-bright/70 z-20 pointer-events-none" />

            {/* Parallax wrap */}
            <div
              ref={imgRef}
              className="absolute inset-0 will-change-transform"
              style={{ transform: "translate3d(0,0,0) scale(1.04)" }}
            >
              <img
                src={architectAsset.url}
                alt="The Architect of the Supreme Kinetic Protocol"
                loading="lazy"
                decoding="async"
                onLoad={() => setLoaded(true)}
                className={`w-full h-full object-cover object-[center_20%] transition-[opacity,filter] duration-[1400ms] ease-out ${
                  loaded ? "opacity-100 blur-0" : "opacity-0 blur-md"
                }`}
              />
            </div>

            {/* Cinematic gradient */}
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                background:
                  "linear-gradient(180deg, rgba(0,0,0,0) 55%, rgba(0,0,0,0.55) 100%)",
              }}
            />
            {/* Warm gold vignette */}
            <div
              className="absolute inset-0 pointer-events-none mix-blend-overlay"
              style={{
                background:
                  "radial-gradient(60% 55% at 55% 40%, rgba(255,220,140,0.18), transparent 70%)",
              }}
            />

            {/* Signature plate */}
            <div className="absolute bottom-5 left-5 right-5 z-20 flex items-end justify-between gap-4">
              <div className="min-w-0">
                <div className="text-[9px] tracking-[0.5em] uppercase text-gold-bright/80">
                  Abhiram R Ajay
                </div>
                <div className="mt-1 font-serif italic text-white/90 text-sm truncate">
                  Forged in Discipline
                </div>
              </div>
              <div className="text-right shrink-0">
                <div className="text-[9px] tracking-[0.4em] uppercase text-white/50">
                  Portrait
                </div>
                <div className="text-[9px] tracking-[0.4em] text-gold-bright/70">
                  MMXXVI
                </div>
              </div>
            </div>
          </div>

          {/* Floating gold plate — sits clearly BELOW the frame, never overlapping the signature */}
          <div
            className="hidden md:flex items-center gap-4 mt-6 mx-auto w-fit px-6 py-3 border border-gold/30 backdrop-blur-md"
            data-reveal
            data-reveal-delay="260ms"
            style={{
              background:
                "linear-gradient(180deg, rgba(20,15,8,0.85), rgba(10,8,5,0.85))",
              boxShadow: "0 20px 60px -20px rgba(212,175,55,0.35)",
            }}
          >
            <div>
              <div className="text-[9px] tracking-[0.45em] uppercase text-gold-bright/70">
                Custodian · Nº 001
              </div>
              <div className="mt-1 font-display gold-gradient-text text-lg leading-none">
                Omega Edition
              </div>
            </div>
            <span className="w-px h-8 bg-gold/25" />
            <div className="font-serif italic text-white/70 text-xs">
              — Abhi
            </div>
          </div>
        </div>

        {/* Editorial copy */}
        <div>
          <div className="flex items-center gap-4 mb-6" data-reveal>
            <span className="w-12 h-px bg-gradient-to-r from-transparent to-gold-bright/60" />
            <span className="text-[10px] tracking-[0.5em] uppercase text-gold-bright/70">
              A Letter from the Architect
            </span>
          </div>

          <h2
            id="architect-heading"
            className="font-display gold-gradient-text leading-[1.02] text-4xl md:text-5xl lg:text-6xl"
            data-reveal
            data-reveal-delay="120ms"
          >
            Discipline is<br />the last luxury.
          </h2>

          <p
            className="mt-8 text-foreground/80 leading-[1.9] text-lg"
            data-reveal
            data-reveal-delay="240ms"
          >
            <span
              className="float-left font-display text-6xl md:text-7xl leading-[0.9] mr-3 mt-1"
              style={{
                backgroundImage:
                  "linear-gradient(180deg,#fff6d4 0%,#f2d47a 45%,#8a6a2a 100%)",
                WebkitBackgroundClip: "text",
                backgroundClip: "text",
                color: "transparent",
              }}
            >
              I
            </span>
            built this protocol for the man who refuses the average — who
            treats his body as the finest instrument he will ever own.
            Six days of considered exposure. One day of restoration. No
            noise. No shortcuts. Only the quiet, mechanical certainty of
            work done at the highest standard.
          </p>

          <p
            className="mt-6 text-foreground/70 leading-[1.9]"
            data-reveal
            data-reveal-delay="320ms"
          >
            What follows is not a program. It is a covenant — hand-finished,
            precisely balanced, and made to be worn like a chronometer.
          </p>

          <div className="mt-10 flex items-center gap-6" data-reveal data-reveal-delay="420ms">
            <span
              className="font-display italic text-2xl md:text-3xl"
              style={{
                backgroundImage:
                  "linear-gradient(180deg,#fff6d4 0%,#e8c96a 50%,#8a6a2a 100%)",
                WebkitBackgroundClip: "text",
                backgroundClip: "text",
                color: "transparent",
              }}
            >
              — The Architect
            </span>
            <span className="flex-1 h-px bg-gradient-to-r from-gold/40 to-transparent" />
          </div>
        </div>
      </div>
    </section>
  );
}
