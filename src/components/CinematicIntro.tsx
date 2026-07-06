import { useEffect, useRef, useState } from "react";
import { playIntroScore, stopAllIntro, unlockAudio, playClick } from "@/lib/sound";

/**
 * Cinematic intro — three-act sequence with procedural orchestral score.
 *
 *   Act I  (0.0–3.5s)  Black. Typography: "In an age of average..."
 *   Act II (3.5–7.5s)  Particles converge into a golden eagle emblem.
 *   Act III(7.5–11s)   Wings spread, camera pushes through into the home page.
 *
 * A silent "Begin" gate appears first so audio can unlock on user gesture.
 */
export function CinematicIntro({ onDone }: { onDone: () => void }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [phase, setPhase] = useState<"gate" | "active" | "fading" | "done">("gate");
  const [captionIndex, setCaptionIndex] = useState(0);
  const skipRef = useRef(false);
  const stopScoreRef = useRef<() => void>(() => {});

  const captions = [
    { pre: "In an age of average", main: "we forge exception" },
    { pre: "Six days of exposure", main: "one day of restoration" },
    { pre: "The Supreme Kinetic Protocol", main: "Omega Edition" },
  ];

  // Auto-skip for reduced motion
  useEffect(() => {
    if (typeof window === "undefined") return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) onDone();
  }, [onDone]);

  const begin = () => {
    unlockAudio();
    playClick(1.4);
    stopScoreRef.current = playIntroScore();
    setPhase("active");
  };

  // Caption timing while active
  useEffect(() => {
    if (phase !== "active") return;
    const timers = [
      setTimeout(() => setCaptionIndex(1), 3200),
      setTimeout(() => setCaptionIndex(2), 6400),
    ];
    return () => timers.forEach(clearTimeout);
  }, [phase]);

  // Canvas animation
  useEffect(() => {
    if (phase !== "active") return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 1.6);
    const resize = () => {
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      canvas.style.width = window.innerWidth + "px";
      canvas.style.height = window.innerHeight + "px";
    };
    resize();
    window.addEventListener("resize", resize);

    // Eagle silhouette targets — symmetric across x=0
    const half = [
      [0, -0.02], [0.02, 0.05], [0.03, 0.14], [0.02, 0.22], [0, 0.28],
      [0, -0.08], [0.03, -0.09], [0.05, -0.075], [0.06, -0.06],
      [0.05, -0.02], [0.09, 0], [0.14, 0.02], [0.20, 0.03], [0.26, 0.02],
      [0.32, 0], [0.38, -0.03], [0.44, -0.07], [0.49, -0.11], [0.53, -0.15],
      [0.48, -0.06], [0.42, 0.01], [0.36, 0.06], [0.30, 0.09], [0.24, 0.10],
      [0.18, 0.10], [0.12, 0.09], [0.07, 0.08],
      [0.55, -0.13], [0.51, -0.08], [0.47, -0.02],
      [0.20, 0.06], [0.26, 0.06], [0.32, 0.04],
      [0.02, 0.30], [0.04, 0.32], [0.06, 0.30],
    ];
    const targets: { x: number; y: number }[] = [];
    const N = 1100;
    for (let i = 0; i < N; i++) {
      const seg = half[Math.floor(Math.random() * half.length)];
      const jx = (Math.random() - 0.5) * 0.03;
      const jy = (Math.random() - 0.5) * 0.03;
      const side = Math.random() < 0.5 ? -1 : 1;
      targets.push({ x: side * (seg[0] + jx), y: seg[1] + jy });
    }

    type Particle = {
      x: number; y: number; tx: number; ty: number;
      vx: number; vy: number; size: number; hue: number; life: number;
    };
    const parts: Particle[] = targets.map((t) => {
      const a = Math.random() * Math.PI * 2;
      const r = 0.6 + Math.random() * 0.7;
      return {
        x: Math.cos(a) * r, y: Math.sin(a) * r + (Math.random() - 0.5) * 0.4,
        tx: t.x, ty: t.y, vx: 0, vy: 0,
        size: 0.6 + Math.random() * 1.6,
        hue: 42 + Math.random() * 12,
        life: Math.random(),
      };
    });

    const start = performance.now();
    const DURATION = 11000;
    let raf = 0;

    const draw = (now: number) => {
      const t = skipRef.current ? DURATION : now - start;
      const p = Math.min(t / DURATION, 1);
      const W = canvas.width, H = canvas.height;
      const cx = W / 2, cy = H / 2;
      const scale = Math.min(W, H) * 0.85;

      ctx.globalCompositeOperation = "source-over";
      ctx.fillStyle = "#040404";
      ctx.fillRect(0, 0, W, H);

      // Act I: 0–3.5s — sparse floating dust
      // Act II: 3.5–7.5s — particles converge to eagle
      // Act III: 7.5–11s — spread + push through
      let assembly = 0, push = 0;
      if (p < 0.32) assembly = 0;
      else if (p < 0.7) assembly = easeOutCubic((p - 0.32) / 0.38);
      else assembly = 1;
      if (p > 0.82) push = (p - 0.82) / 0.18;

      const glowStrength = Math.min(1, assembly + push * 3);
      const rg = ctx.createRadialGradient(cx, cy, 0, cx, cy, scale);
      rg.addColorStop(0, `rgba(212,175,55,${0.10 * glowStrength})`);
      rg.addColorStop(0.4, `rgba(212,175,55,${0.05 * glowStrength})`);
      rg.addColorStop(1, "rgba(0,0,0,0)");
      ctx.fillStyle = rg;
      ctx.fillRect(0, 0, W, H);

      ctx.globalCompositeOperation = "lighter";

      for (const pt of parts) {
        const dx = pt.tx - pt.x;
        const dy = pt.ty - pt.y;
        const k = 0.015 + assembly * 0.10;
        pt.vx = pt.vx * 0.86 + dx * k;
        pt.vy = pt.vy * 0.86 + dy * k;
        pt.x += pt.vx;
        pt.y += pt.vy;

        const spread = p > 0.7 ? Math.min(1, (p - 0.7) / 0.15) : 0;
        const stretch = 1 + spread * 0.18;
        const pushScale = 1 + push * 7;

        const drawX = cx + pt.x * scale * stretch * pushScale;
        const drawY = cy + pt.y * scale * pushScale +
          Math.sin(now * 0.001 + pt.life * 6) * (1 - assembly) * 22;

        const alpha = (0.30 + assembly * 0.60) * (1 - push * 0.9);
        const size = pt.size * dpr * (1 + push * 3.5) * (0.6 + assembly * 1.6);

        ctx.fillStyle = `hsla(${pt.hue}, 82%, ${58 + assembly * 22}%, ${alpha})`;
        ctx.beginPath();
        ctx.arc(drawX, drawY, size, 0, Math.PI * 2);
        ctx.fill();

        if (assembly > 0.6 && Math.random() < 0.025) {
          ctx.fillStyle = `hsla(50, 100%, 90%, ${0.85 * alpha})`;
          ctx.beginPath();
          ctx.arc(drawX, drawY, size * 1.8, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      // Eye glow when nearly assembled
      if (assembly > 0.7 && p < 0.92) {
        const eyeI = Math.min(1, (assembly - 0.7) / 0.3) * (1 - push);
        const eg = ctx.createRadialGradient(
          cx + 0.045 * scale, cy - 0.07 * scale, 0,
          cx + 0.045 * scale, cy - 0.07 * scale, 44 * dpr,
        );
        eg.addColorStop(0, `rgba(255,232,154,${0.95 * eyeI})`);
        eg.addColorStop(1, "rgba(255,232,154,0)");
        ctx.fillStyle = eg;
        ctx.fillRect(0, 0, W, H);
      }

      // Final gold flash
      if (p > 0.9) {
        const flash = (p - 0.9) / 0.1;
        ctx.globalCompositeOperation = "source-over";
        ctx.fillStyle = `rgba(255,232,154,${flash * 0.4})`;
        ctx.fillRect(0, 0, W, H);
      }

      if (p >= 1) {
        setPhase("fading");
        setTimeout(() => {
          setPhase("done");
          onDone();
        }, 700);
        return;
      }
      raf = requestAnimationFrame(draw);
    };

    raf = requestAnimationFrame(draw);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
    };
  }, [phase, onDone]);

  useEffect(() => () => stopAllIntro(), []);

  if (phase === "done") return null;

  return (
    <div
      className={`fixed inset-0 z-[100] bg-[#040404] transition-opacity duration-700 ${
        phase === "fading" ? "opacity-0" : "opacity-100"
      }`}
      aria-hidden={phase !== "gate"}
      role={phase === "gate" ? "dialog" : undefined}
    >
      {/* Gate: waits for user gesture to unlock audio */}
      {phase === "gate" && (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-10 px-6 animate-[gateIn_1.2s_ease-out]">
          <div className="flex items-center gap-4">
            <span className="w-20 h-px bg-gradient-to-r from-transparent via-[#d4af37]/60 to-transparent" />
            <span className="text-[10px] tracking-[0.55em] uppercase text-[#e8c96a]/80">
              Supreme Kinetic Protocol
            </span>
            <span className="w-20 h-px bg-gradient-to-l from-transparent via-[#d4af37]/60 to-transparent" />
          </div>
          <h1
            className="font-display text-center leading-[0.98] max-w-3xl text-transparent bg-clip-text"
            style={{
              backgroundImage: "linear-gradient(180deg,#fff2c2 0%,#e8c96a 45%,#8a6a2a 100%)",
              fontSize: "clamp(2.75rem, 7vw, 5.5rem)",
              letterSpacing: "-0.01em",
            }}
          >
            Omega Edition
          </h1>
          <p className="text-center max-w-md text-sm text-white/60 leading-[1.85]">
            An immersive experience with cinematic sound. Best in headphones.
          </p>
          <button
            onClick={begin}
            className="group relative overflow-hidden rounded-full px-10 py-4 border border-[#d4af37]/50 hover:border-[#d4af37] transition-colors text-[11px] tracking-[0.45em] uppercase text-[#e8c96a] hover:text-white"
            style={{
              background: "linear-gradient(180deg,#1a1408 0%,#0a0805 100%)",
              boxShadow:
                "inset 0 1px 0 rgba(255,232,154,0.15), 0 20px 60px -20px rgba(212,175,55,0.4)",
            }}
          >
            <span className="relative z-10">Begin the Ceremony ▸</span>
          </button>
          <button
            onClick={() => {
              playClick(0.6);
              onDone();
            }}
            className="text-[10px] tracking-[0.4em] uppercase text-white/40 hover:text-[#e8c96a] transition-colors"
          >
            Skip intro
          </button>
        </div>
      )}

      {phase === "active" && (
        <>
          <canvas ref={canvasRef} className="w-full h-full block" />

          {/* Captions overlay */}
          <div className="absolute inset-x-0 top-[14%] flex justify-center pointer-events-none px-6">
            <div key={captionIndex} className="text-center animate-[captionIn_0.9s_cubic-bezier(0.19,1,0.22,1)_both]">
              <div className="text-[10px] tracking-[0.55em] uppercase text-[#e8c96a]/80 mb-4">
                {captions[captionIndex].pre}
              </div>
              <div
                className="font-display italic text-transparent bg-clip-text"
                style={{
                  backgroundImage: "linear-gradient(180deg,#fff2c2 0%,#e8c96a 45%,#8a6a2a 100%)",
                  fontSize: "clamp(1.75rem, 4.5vw, 3.5rem)",
                  letterSpacing: "0.005em",
                }}
              >
                {captions[captionIndex].main}
              </div>
            </div>
          </div>

          <button
            onClick={() => {
              skipRef.current = true;
              stopAllIntro();
            }}
            className="absolute bottom-8 right-8 text-[10px] tracking-[0.35em] uppercase text-[#e8c96a]/60 hover:text-[#e8c96a] transition-colors"
          >
            Skip
          </button>
          <div className="absolute bottom-8 left-8 flex items-center gap-3 text-[10px] tracking-[0.35em] uppercase text-[#e8c96a]/50">
            <span className="w-8 h-px bg-[#e8c96a]/40" />
            Initiating Protocol
          </div>
        </>
      )}

      <style>{`
        @keyframes gateIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes captionIn {
          0% { opacity: 0; transform: translateY(18px); letter-spacing: 0.2em; }
          100% { opacity: 1; transform: translateY(0); letter-spacing: 0.005em; }
        }
      `}</style>
    </div>
  );
}

function easeOutCubic(x: number) {
  return 1 - Math.pow(1 - x, 3);
}
