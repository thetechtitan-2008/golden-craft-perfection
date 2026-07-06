import { useEffect, useRef } from "react";

/**
 * Ambient background: soft moving gradient orbs + drifting dust motes.
 * Very subtle. Pauses when off-screen. Pure canvas for GPU efficiency.
 */
export function AmbientBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const runningRef = useRef(true);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
    const resize = () => {
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
    };
    resize();
    window.addEventListener("resize", resize);

    const COUNT = reduced ? 0 : 42;
    const motes = Array.from({ length: COUNT }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      r: (0.4 + Math.random() * 1.2) * dpr,
      vx: (Math.random() - 0.5) * 0.12 * dpr,
      vy: -(0.05 + Math.random() * 0.15) * dpr,
      a: 0.15 + Math.random() * 0.5,
      p: Math.random() * Math.PI * 2,
    }));

    const onVis = () => { runningRef.current = !document.hidden; if (runningRef.current) tick(); };
    document.addEventListener("visibilitychange", onVis);

    let raf = 0;
    let last = performance.now();
    const tick = (now = performance.now()) => {
      if (!runningRef.current) return;
      const dt = Math.min(50, now - last);
      last = now;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.globalCompositeOperation = "lighter";
      for (const m of motes) {
        m.x += m.vx * (dt / 16);
        m.y += m.vy * (dt / 16);
        m.p += 0.008;
        if (m.y < -10) { m.y = canvas.height + 10; m.x = Math.random() * canvas.width; }
        if (m.x < -10) m.x = canvas.width + 10;
        if (m.x > canvas.width + 10) m.x = -10;
        const alpha = m.a * (0.6 + 0.4 * Math.sin(m.p));
        ctx.fillStyle = `rgba(212,175,55,${alpha * 0.35})`;
        ctx.beginPath();
        ctx.arc(m.x, m.y, m.r, 0, Math.PI * 2);
        ctx.fill();
      }
      raf = requestAnimationFrame(tick);
    };
    if (!reduced) tick();

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      document.removeEventListener("visibilitychange", onVis);
    };
  }, []);

  return (
    <>
      <div
        className="fixed inset-0 pointer-events-none z-0"
        aria-hidden
        style={{
          background: `
            radial-gradient(60% 40% at 20% 10%, oklch(0.14 0.03 82 / 0.35), transparent 60%),
            radial-gradient(50% 40% at 80% 90%, oklch(0.12 0.025 60 / 0.45), transparent 60%),
            radial-gradient(70% 50% at 50% 50%, oklch(0.06 0.008 60 / 0.4), transparent 70%),
            linear-gradient(180deg, #050505 0%, #040404 100%)
          `,
        }}
      />
      <canvas
        ref={canvasRef}
        className="fixed inset-0 pointer-events-none z-[1] w-full h-full"
        aria-hidden
      />
      <div className="ambient-grain" aria-hidden />
      <div className="ambient-vignette" aria-hidden />
    </>
  );
}
