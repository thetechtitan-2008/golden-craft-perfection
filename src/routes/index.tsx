import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { AmbientBackground } from "@/components/AmbientBackground";
import { CinematicIntro } from "@/components/CinematicIntro";
import { FloatingNav } from "@/components/FloatingNav";
import { Hero } from "@/components/Hero";
import { WeeklyOverview } from "@/components/WeeklyOverview";
import { WatchChronograph } from "@/components/WatchChronograph";
import { RestTimer } from "@/components/RestTimer";
import { Analytics } from "@/components/Analytics";
import { PROTOCOL_SYNTHESIS } from "@/data/protocol";

export const Route = createFileRoute("/")({
  component: Home,
});

function Home() {
  // Synchronous initial state — no flash of home before the intro appears
  const [introDone, setIntroDone] = useState<boolean>(() => {
    if (typeof window === "undefined") return false;
    return sessionStorage.getItem("skp-intro-seen") === "1";
  });
  const [showIntro, setShowIntro] = useState<boolean>(() => {
    if (typeof window === "undefined") return false;
    return sessionStorage.getItem("skp-intro-seen") !== "1";
  });

  useEffect(() => {
    if (showIntro) {
      // Lock scroll while the intro plays
      document.documentElement.style.overflow = "hidden";
      return () => {
        document.documentElement.style.overflow = "";
      };
    }
  }, [showIntro]);

  const handleIntroDone = () => {
    try { sessionStorage.setItem("skp-intro-seen", "1"); } catch { /* ignore */ }
    setIntroDone(true);
    setShowIntro(false);
  };

  return (
    <div className="relative min-h-screen">
      {showIntro && <CinematicIntro onDone={handleIntroDone} />}


      <AmbientBackground />
      <FloatingNav />

      <main className="relative z-10">
        <Hero />

        {/* Protocol synthesis */}
        <section id="protocol" className="relative py-32 px-6">
          <div className="max-w-4xl mx-auto text-center">
            <div className="flex items-center justify-center gap-4 mb-8" data-reveal>
              <span className="w-12 h-px bg-gradient-to-r from-transparent to-gold-bright/60" />
              <span className="text-[10px] tracking-[0.5em] uppercase text-gold-bright/70">
                The Architecture of Greatness
              </span>
              <span className="w-12 h-px bg-gradient-to-l from-transparent to-gold-bright/60" />
            </div>
            <p
              className="font-serif italic text-2xl md:text-3xl leading-[1.55] text-foreground/85"
              data-reveal
              data-reveal-delay="120ms"
            >
              {PROTOCOL_SYNTHESIS}
            </p>
            <div className="mt-16 grid grid-cols-3 divide-x divide-gold/15 border-y border-gold/15">
              {[
                { n: "06", l: "Days Under Iron" },
                { n: "01", l: "Day of Restoration" },
                { n: "07", l: "The Complete Cycle" },
              ].map((s, i) => (
                <div
                  key={s.l}
                  className="py-8"
                  data-reveal
                  data-reveal-delay={`${200 + i * 140}ms`}
                >
                  <div className="font-display text-4xl md:text-5xl gold-gradient-text">
                    {s.n}
                  </div>
                  <div className="mt-2 text-[9px] tracking-[0.4em] uppercase text-foreground/50">
                    {s.l}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <WeeklyOverview />

        {/* Chronograph */}
        <section id="chronograph" className="relative py-32 px-6">
          <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <div className="flex items-center gap-4 mb-6" data-reveal>
                <span className="w-12 h-px bg-gradient-to-r from-transparent to-gold-bright/60" />
                <span className="text-[10px] tracking-[0.5em] uppercase text-gold-bright/70">
                  Chronograph · Manufacture
                </span>
              </div>
              <h2
                className="font-display gold-gradient-text leading-[1.02]"
                data-reveal
                data-reveal-delay="120ms"
              >
                Every Second, Earned
              </h2>
              <p
                className="mt-6 text-foreground/70 leading-[1.85]"
                data-reveal
                data-reveal-delay="240ms"
              >
                A skeleton chronometer with visible tourbillon, oscillating balance
                wheel, and mechanical rotor. Engage the pushers to time your
                sets — every millisecond mechanical, every hand hand-finished in
                the digital atelier.
              </p>
              <ul className="mt-8 space-y-3 text-sm text-foreground/70">
                {[
                  "Tourbillon carriage — one rotation per minute",
                  "Skeleton bridges revealing the escapement",
                  "Ruby jewels · heat-blued screws · Geneva stripes",
                  "Sweeping chronograph seconds hand",
                ].map((f, i) => (
                  <li
                    key={f}
                    className="flex items-center gap-3"
                    data-reveal
                    data-reveal-delay={`${300 + i * 100}ms`}
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-gold-bright" />
                    {f}
                  </li>
                ))}
              </ul>
            </div>
            <div data-reveal data-reveal-delay="200ms">
              <WatchChronograph />
            </div>
          </div>
        </section>

        <Analytics />

        <footer className="relative py-16 px-6 border-t border-gold/10">
          <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6 text-[10px] tracking-[0.4em] uppercase text-foreground/40">
            <span>Supreme Kinetic Protocol · Omega Edition</span>
            <span>Forged in Discipline</span>
            <span>MMXXVI</span>
          </div>
        </footer>
      </main>

      <RestTimer />
    </div>
  );
}
