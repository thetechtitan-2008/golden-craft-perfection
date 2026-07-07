import { useEffect, useRef, useState } from "react";
import { playIntroScore, stopAllIntro, unlockAudio, playClick } from "@/lib/sound";

/**
 * Cinematic intro — a purely abstract cosmic overture. No logos, no crest,
 * no animal, no symbol. Only golden particles, volumetric light, and
 * flowing energy that dissolves seamlessly into the hero.
 *
 *   Act I  (0.0–3.2s)   Infinite darkness. Sparse golden dust drifting.
 *   Act II (3.2–7.0s)   Camera pushes through cosmic space. Volumetric
 *                       rays bloom. Billions of particles flow like
 *                       intelligent energy in twin sinusoidal currents.
 *   Act III(7.0–11s)    A wave of golden light sweeps the field. Particles
 *                       accelerate outward — becoming the hero's atmosphere.
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
      setTimeout(() => setCaptionIndex(1), 3400),
      setTimeout(() => setCaptionIndex(2), 6800),
    ];
    return () => timers.forEach(clearTimeout);
  }, [phase]);

  // Canvas animation — abstract cosmic flow
  useEffect(() => {
    if (phase !== "active") return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    const isMobile = window.matchMedia("(max-width: 768px)").matches;
    const dpr = Math.min(window.devicePixelRatio || 1, isMobile ? 1.25 : 1.6);
    const resize = () => {
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      canvas.style.width = window.innerWidth + "px";
      canvas.style.height = window.innerHeight + "px";
    };
    resize();
    window.addEventListener("resize", resize);

    // Two flowing rivers of particles crossing through cosmic space.
    type Particle = {
      x: number; y: number;
      z: number;           // depth 0..1 (0 near, 1 far)
      vx: number; vy: number;
      seed: number;        // per-particle phase
      band: number;        // 0 or 1 — which current
      size: number;
      hue: number;
    };
    const N = isMobile ? 900 : 1800;
    const parts: Particle[] = [];
    for (let i = 0; i < N; i++) {
      parts.push({
        x: Math.random(),
        y: Math.random(),
        z: Math.random(),
        vx: 0,
        vy: 0,
        seed: Math.random() * Math.PI * 2,
        band: Math.random() < 0.5 ? 0 : 1,
        size: 0.35 + Math.random() * 1.6,
        hue: 40 + Math.random() * 14,
      });
    }

    // Volumetric light rays — fixed angles, gently pulsing.
    const rays = Array.from({ length: 7 }).map((_, i) => ({
      angle: -35 + i * 12 + (Math.random() - 0.5) * 4,
      offset: Math.random(),
      width: 0.08 + Math.random() * 0.16,
    }));

    const start = performance.now();
    const DURATION = 11000;
    let raf = 0;

    const draw = (now: number) => {
      const t = skipRef.current ? DURATION : now - start;
      const p = Math.min(t / DURATION, 1);
      const W = canvas.width, H = canvas.height;

      // Background — deepens then blooms
      const bloom = Math.pow(Math.max(0, p - 0.25), 1.6);
      const bg = ctx.createRadialGradient(W * 0.5, H * 0.55, 0, W * 0.5, H * 0.55, Math.max(W, H) * 0.7);
      bg.addColorStop(0, `rgba(${18 + bloom * 40}, ${12 + bloom * 30}, ${4 + bloom * 8}, 1)`);
      bg.addColorStop(0.55, `rgba(${8 + bloom * 14}, ${5 + bloom * 8}, ${2}, 1)`);
      bg.addColorStop(1, "#020202");
      ctx.globalCompositeOperation = "source-over";
      ctx.fillStyle = bg;
      ctx.fillRect(0, 0, W, H);

      // Volumetric god-rays (Act II onward)
      const rayAlpha = Math.max(0, Math.min(1, (p - 0.2) / 0.35)) * (1 - Math.max(0, (p - 0.9) / 0.1));
      if (rayAlpha > 0.01) {
        ctx.globalCompositeOperation = "screen";
        const cx = W * 0.5;
        const cy = H * -0.15;
        for (const r of rays) {
          const pulse = 0.55 + 0.45 * Math.sin(now * 0.0008 + r.offset * 6.28);
          const a = (r.angle * Math.PI) / 180;
          const len = Math.hypot(W, H) * 1.2;
          const nx = Math.cos(a + Math.PI / 2);
          const ny = Math.sin(a + Math.PI / 2);
          const half = W * r.width;
          const x2 = cx + Math.cos(a) * len;
          const y2 = cy + Math.sin(a) * len;
          const grad = ctx.createLinearGradient(cx, cy, x2, y2);
          grad.addColorStop(0, `rgba(255, 220, 130, ${0.22 * rayAlpha * pulse})`);
          grad.addColorStop(0.5, `rgba(212, 175, 55, ${0.08 * rayAlpha * pulse})`);
          grad.addColorStop(1, "rgba(0,0,0,0)");
          ctx.fillStyle = grad;
          ctx.beginPath();
          ctx.moveTo(cx + nx * half * 0.3, cy + ny * half * 0.3);
          ctx.lineTo(cx - nx * half * 0.3, cy - ny * half * 0.3);
          ctx.lineTo(x2 - nx * half, y2 - ny * half);
          ctx.lineTo(x2 + nx * half, y2 + ny * half);
          ctx.closePath();
          ctx.fill();
        }
      }

      // Fog layer
      const fogAlpha = 0.05 + 0.12 * Math.sin(now * 0.0003);
      const fog = ctx.createRadialGradient(W * 0.5, H * 0.6, W * 0.1, W * 0.5, H * 0.6, W * 0.9);
      fog.addColorStop(0, `rgba(120, 90, 40, ${fogAlpha * (0.4 + bloom)})`);
      fog.addColorStop(1, "rgba(0,0,0,0)");
      ctx.globalCompositeOperation = "screen";
      ctx.fillStyle = fog;
      ctx.fillRect(0, 0, W, H);

      // Camera-push scale (Act II/III)
      const push = p < 0.7 ? 0 : (p - 0.7) / 0.3;
      const cameraZ = 1 + Math.pow(push, 1.6) * 6;

      // Particles — flow like intelligent energy in two crossing currents
      ctx.globalCompositeOperation = "lighter";
      const flowStrength = Math.max(0, Math.min(1, (p - 0.15) / 0.4));
      const time = now * 0.0004;

      for (const pt of parts) {
        // Sinusoidal current — twin rivers cross the field
        const bandY = pt.band === 0 ? 0.35 : 0.65;
        const wave = Math.sin(pt.x * 6.28 * 1.5 + time * 2 + pt.seed) * 0.12;
        const targetY = bandY + wave;
        const dy = targetY - pt.y;
        pt.vy = pt.vy * 0.92 + dy * 0.02 * flowStrength;
        const dir = pt.band === 0 ? 1 : -1;
        pt.vx = pt.vx * 0.94 + dir * (0.0006 + pt.z * 0.001) * flowStrength;

        pt.x += pt.vx + (pt.band === 0 ? 0.0004 : -0.0004) * flowStrength;
        pt.y += pt.vy;

        // Wrap
        if (pt.x > 1.05) pt.x = -0.05;
        if (pt.x < -0.05) pt.x = 1.05;

        // Camera zoom from center
        const relX = pt.x - 0.5;
        const relY = pt.y - 0.55;
        const zx = relX * cameraZ + 0.5;
        const zy = relY * cameraZ + 0.55;

        // Cull offscreen
        if (zx < -0.02 || zx > 1.02 || zy < -0.02 || zy > 1.02) continue;

        const drawX = zx * W;
        const drawY = zy * H;

        const depthAlpha = 0.35 + (1 - pt.z) * 0.55;
        const alpha =
          depthAlpha *
          (0.25 + flowStrength * 0.75) *
          (1 - push * 0.6);
        const size = pt.size * dpr * (0.5 + (1 - pt.z) * 1.6) * (1 + push * 2.2);

        // Core
        ctx.fillStyle = `hsla(${pt.hue}, 88%, ${62 + flowStrength * 18}%, ${alpha})`;
        ctx.beginPath();
        ctx.arc(drawX, drawY, size, 0, Math.PI * 2);
        ctx.fill();

        // Occasional bright kernel
        if ((1 - pt.z) > 0.75 && Math.random() < 0.02) {
          ctx.fillStyle = `hsla(50, 100%, 92%, ${0.9 * alpha})`;
          ctx.beginPath();
          ctx.arc(drawX, drawY, size * 2.2, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      // Golden wave sweep at ~7s
      if (p > 0.55 && p < 0.92) {
        const w = (p - 0.55) / 0.37;
        const waveY = H * (1.1 - w * 1.4);
        const grad = ctx.createLinearGradient(0, waveY - H * 0.3, 0, waveY + H * 0.3);
        grad.addColorStop(0, "rgba(0,0,0,0)");
        grad.addColorStop(0.5, `rgba(255,220,120,${0.28 * Math.sin(w * Math.PI)})`);
        grad.addColorStop(1, "rgba(0,0,0,0)");
        ctx.globalCompositeOperation = "screen";
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, W, H);
      }

      // Final bloom / dissolve
      if (p > 0.9) {
        const flash = (p - 0.9) / 0.1;
        ctx.globalCompositeOperation = "source-over";
        ctx.fillStyle = `rgba(255,232,154,${flash * 0.28})`;
        ctx.fillRect(0, 0, W, H);
      }

      if (p >= 1) {
        setPhase("fading");
        setTimeout(() => {
          setPhase("done");
          onDone();
        }, 900);
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
      className={`fixed inset-0 z-[100] bg-[#020202] transition-opacity duration-[900ms] ${
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

          {/* Captions — perfectly centered, majestic */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none px-6">
            <div
              key={captionIndex}
              className="text-center animate-[captionIn_1.4s_cubic-bezier(0.19,1,0.22,1)_both] max-w-4xl"
            >
              <div className="flex items-center justify-center gap-4 mb-6 opacity-90">
                <span className="w-16 h-px bg-gradient-to-r from-transparent via-[#e8c96a]/70 to-transparent" />
                <span className="text-[10px] tracking-[0.55em] uppercase text-[#e8c96a]/90">
                  {captions[captionIndex].pre}
                </span>
                <span className="w-16 h-px bg-gradient-to-l from-transparent via-[#e8c96a]/70 to-transparent" />
              </div>
              <div
                className="font-display italic text-transparent bg-clip-text leading-[0.98]"
                style={{
                  backgroundImage:
                    "linear-gradient(180deg,#fff6d4 0%,#f2d47a 40%,#c99a3a 75%,#6a4a18 100%)",
                  fontSize: "clamp(2.5rem, 7.5vw, 6rem)",
                  letterSpacing: "-0.005em",
                  textShadow: "0 0 60px rgba(212,175,55,0.35)",
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
            className="absolute bottom-8 right-8 text-[10px] tracking-[0.35em] uppercase text-[#e8c96a]/60 hover:text-[#e8c96a] transition-colors pointer-events-auto"
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
          0% { opacity: 0; transform: translateY(22px); letter-spacing: 0.2em; filter: blur(6px); }
          100% { opacity: 1; transform: translateY(0); letter-spacing: 0.005em; filter: blur(0); }
        }
      `}</style>
    </div>
  );
}
