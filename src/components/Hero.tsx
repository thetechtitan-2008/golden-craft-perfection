import lionImg from "@/assets/lion-guardian.jpg";
import { EmblemMark } from "./FloatingNav";

export function Hero() {
  return (
    <section className="relative min-h-[100svh] w-full overflow-hidden flex items-center justify-center">
      {/* Lion — the guardian */}
      <div className="absolute inset-0 camera-breath">
        <img
          src={lionImg}
          alt="The golden lion — guardian of the protocol"
          width={1920}
          height={1280}
          fetchPriority="high"
          className="w-full h-full object-cover object-[50%_35%] opacity-70 md:opacity-80"
        />
        {/* atmospheric layers */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: `
              radial-gradient(60% 60% at 50% 40%, transparent 20%, rgba(4,4,4,0.55) 65%, rgba(4,4,4,0.95) 100%),
              linear-gradient(180deg, rgba(4,4,4,0.35) 0%, transparent 25%, transparent 60%, rgba(4,4,4,1) 100%)
            `,
          }}
        />
        <div className="absolute inset-0 pointer-events-none god-rays" />
      </div>

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center text-center px-6 max-w-5xl">
        <div className="flex items-center gap-4 mb-8 rise" style={{ animationDelay: "0.2s" }}>
          <span className="w-16 h-px bg-gradient-to-r from-transparent via-gold-bright/60 to-transparent" />
          <EmblemMark className="w-6 h-6 text-gold-bright eye-glow" />
          <span className="w-16 h-px bg-gradient-to-r from-transparent via-gold-bright/60 to-transparent" />
        </div>

        <p
          className="text-[10px] md:text-[11px] tracking-[0.5em] uppercase text-gold-bright/70 mb-6 rise"
          style={{ animationDelay: "0.4s" }}
        >
          The Supreme Kinetic Protocol · Omega Edition
        </p>

        <h1
          className="font-display font-normal text-[13vw] sm:text-[10vw] md:text-[7.5vw] lg:text-[6.5rem] leading-[0.95] tracking-[0.01em] rise"
          style={{ animationDelay: "0.6s" }}
        >
          <span className="gold-gradient-text block">Forged in</span>
          <span className="gold-shimmer block italic font-serif">Discipline</span>
        </h1>

        <p
          className="mt-8 max-w-xl text-sm md:text-base text-foreground/70 leading-relaxed rise"
          style={{ animationDelay: "0.85s" }}
        >
          A biomechanical masterclass. Six days of extreme mechanical exposure,
          one day of parasympathetic supercompensation. Every rep, every tempo,
          every rest interval — mathematically precise.
        </p>

        <div
          className="mt-12 flex flex-wrap items-center justify-center gap-4 rise"
          style={{ animationDelay: "1.05s" }}
        >
          <a
            href="#week"
            className="group relative overflow-hidden rounded-full pusher-btn px-8 py-3.5 text-[11px] tracking-[0.35em] uppercase text-gold-bright hover:text-white transition-colors"
          >
            <span className="relative z-10">Enter the Microcycle</span>
          </a>
          <a
            href="#chronograph"
            className="text-[11px] tracking-[0.35em] uppercase text-foreground/60 hover:text-gold-bright transition-colors px-4 py-3.5"
          >
            View Chronograph →
          </a>
        </div>

        <div
          className="absolute -bottom-24 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3 rise"
          style={{ animationDelay: "1.4s" }}
        >
          <span className="text-[9px] tracking-[0.4em] uppercase text-gold-bright/50">
            Scroll
          </span>
          <span className="w-px h-16 bg-gradient-to-b from-gold-bright/60 to-transparent" />
        </div>
      </div>
    </section>
  );
}
