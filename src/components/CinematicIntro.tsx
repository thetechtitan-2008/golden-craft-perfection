import { useEffect, useRef, useState } from "react";

/**
 * Cinematic intro: pitch-black → floating gold dust → particles converge and
 * assemble into a golden eagle silhouette → wings spread → camera pushes
 * through, particles disperse into the hero.
 *
 * Pure canvas — no external 3D. Cleans itself up completely when finished.
 */
export function CinematicIntro({ onDone }: { onDone: () => void }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [phase, setPhase] = useState<"active" | "fading" | "done">("active");
  const skipRef = useRef(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) {
      onDone();
      return;
    }
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

    // Eagle silhouette — parametric points forming outstretched wings + body.
    // Symmetric across x=0. Values sampled to trace a majestic wingspan.
    const half = [
      // body
      [0, -0.02], [0.02, 0.05], [0.03, 0.14], [0.02, 0.22], [0, 0.28],
      // head
      [0, -0.08], [0.03, -0.09], [0.05, -0.075], [0.06, -0.06],
      // upper wing (from body outward)
      [0.05, -0.02], [0.09, 0], [0.14, 0.02], [0.20, 0.03], [0.26, 0.02],
      [0.32, 0], [0.38, -0.03], [0.44, -0.07], [0.49, -0.11], [0.53, -0.15],
      // wing trailing edge
      [0.48, -0.06], [0.42, 0.01], [0.36, 0.06], [0.30, 0.09], [0.24, 0.10],
      [0.18, 0.10], [0.12, 0.09], [0.07, 0.08],
      // wing tips feathers
      [0.55, -0.13], [0.51, -0.08], [0.47, -0.02],
      // lower wing detail
      [0.20, 0.06], [0.26, 0.06], [0.32, 0.04],
      // tail feathers
      [0.02, 0.30], [0.04, 0.32], [0.06, 0.30],
    ];
    const targets: { x: number; y: number }[] = [];
    // densify: interpolate several points between key positions and mirror
    const N = 900;
    for (let i = 0; i < N; i++) {
      const seg = half[Math.floor(Math.random() * half.length)];
      const jitterX = (Math.random() - 0.5) * 0.03;
      const jitterY = (Math.random() - 0.5) * 0.03;
      const side = Math.random() < 0.5 ? -1 : 1;
      targets.push({
        x: side * (seg[0] + jitterX),
        y: seg[1] + jitterY,
      });
    }

    type Particle = {
      x: number; y: number; tx: number; ty: number;
      vx: number; vy: number; size: number; hue: number; life: number;
    };
    const parts: Particle[] = targets.map((t) => {
      const startAngle = Math.random() * Math.PI * 2;
      const startRadius = 0.6 + Math.random() * 0.6;
      return {
        x: Math.cos(startAngle) * startRadius,
        y: Math.sin(startAngle) * startRadius + (Math.random() - 0.5) * 0.4,
        tx: t.x, ty: t.y,
        vx: 0, vy: 0,
        size: 0.6 + Math.random() * 1.4,
        hue: 42 + Math.random() * 12,
        life: Math.random(),
      };
    });

    const start = performance.now();
    const DURATION = 10500; // ms
    let raf = 0;

    const draw = (now: number) => {
      const t = skipRef.current ? DURATION : now - start;
      const p = Math.min(t / DURATION, 1);
      const W = canvas.width, H = canvas.height;
      const cx = W / 2, cy = H / 2;
      const scale = Math.min(W, H) * 0.85;

      // background with subtle radial glow that grows
      ctx.globalCompositeOperation = "source-over";
      ctx.fillStyle = "#040404";
      ctx.fillRect(0, 0, W, H);
      const glowStrength = p < 0.35 ? p / 0.35 * 0.15 : 0.15 + (p - 0.35) * 0.9;
      const rg = ctx.createRadialGradient(cx, cy, 0, cx, cy, scale);
      rg.addColorStop(0, `rgba(212,175,55,${0.08 * glowStrength})`);
      rg.addColorStop(0.4, `rgba(212,175,55,${0.04 * glowStrength})`);
      rg.addColorStop(1, "rgba(0,0,0,0)");
      ctx.fillStyle = rg;
      ctx.fillRect(0, 0, W, H);

      // easing for assembly (0..0.7 assemble, 0.7..0.85 spread wings, 0.85..1 push through)
      let assembly = 0, push = 0;
      if (p < 0.7) assembly = easeOutCubic(p / 0.7);
      else assembly = 1;
      if (p > 0.85) push = (p - 0.85) / 0.15;

      ctx.globalCompositeOperation = "lighter";

      for (const pt of parts) {
        // move toward target
        const dx = pt.tx - pt.x;
        const dy = pt.ty - pt.y;
        const k = 0.02 + assembly * 0.09;
        pt.vx = pt.vx * 0.85 + dx * k;
        pt.vy = pt.vy * 0.85 + dy * k;
        pt.x += pt.vx;
        pt.y += pt.vy;

        // wing spread: horizontally amplify past 0.7
        const spread = p > 0.7 ? Math.min(1, (p - 0.7) / 0.15) : 0;
        const stretch = 1 + spread * 0.15;

        // push through: fly outward toward camera
        const pushScale = 1 + push * 6;
        const drawX = cx + pt.x * scale * stretch * pushScale;
        const drawY = cy + pt.y * scale * pushScale + Math.sin(now * 0.001 + pt.life * 6) * (1 - assembly) * 20;

        const alpha = (0.35 + assembly * 0.55) * (1 - push * 0.9);
        const size = pt.size * dpr * (1 + push * 3) * (0.7 + assembly * 1.4);

        ctx.fillStyle = `hsla(${pt.hue}, 82%, ${58 + assembly * 20}%, ${alpha})`;
        ctx.beginPath();
        ctx.arc(drawX, drawY, size, 0, Math.PI * 2);
        ctx.fill();

        // core sparkle for the brightest
        if (assembly > 0.6 && Math.random() < 0.02) {
          ctx.fillStyle = `hsla(50, 100%, 90%, ${0.8 * alpha})`;
          ctx.beginPath();
          ctx.arc(drawX, drawY, size * 1.8, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      // eye glow when nearly assembled
      if (assembly > 0.7 && p < 0.9) {
        const eyeIntensity = Math.min(1, (assembly - 0.7) / 0.3) * (1 - push);
        const eg = ctx.createRadialGradient(
          cx + 0.045 * scale, cy - 0.07 * scale, 0,
          cx + 0.045 * scale, cy - 0.07 * scale, 40 * dpr
        );
        eg.addColorStop(0, `rgba(255,232,154,${0.9 * eyeIntensity})`);
        eg.addColorStop(1, "rgba(255,232,154,0)");
        ctx.fillStyle = eg;
        ctx.fillRect(0, 0, W, H);
      }

      // final flash of gold
      if (p > 0.9) {
        const flash = (p - 0.9) / 0.1;
        ctx.globalCompositeOperation = "source-over";
        ctx.fillStyle = `rgba(255,232,154,${flash * 0.35})`;
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
  }, [onDone]);

  if (phase === "done") return null;

  return (
    <div
      className={`fixed inset-0 z-[100] bg-[#040404] transition-opacity duration-700 ${
        phase === "fading" ? "opacity-0" : "opacity-100"
      }`}
      aria-hidden
    >
      <canvas ref={canvasRef} className="w-full h-full block" />
      <button
        onClick={() => { skipRef.current = true; }}
        className="absolute bottom-8 right-8 text-[10px] tracking-[0.35em] uppercase text-gold-bright/60 hover:text-gold-bright transition-colors"
      >
        Skip
      </button>
      <div className="absolute bottom-8 left-8 flex items-center gap-3 text-[10px] tracking-[0.35em] uppercase text-gold-bright/50">
        <span className="w-8 h-px bg-gold-bright/40" />
        Initiating Protocol
      </div>
    </div>
  );
}

function easeOutCubic(x: number) {
  return 1 - Math.pow(1 - x, 3);
}
