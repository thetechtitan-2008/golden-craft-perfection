import { useEffect, useState } from "react";

/**
 * A hair-thin gold progress bar across the top of the viewport.
 * Tracks scroll from 0 → 100% of the document.
 */
export function ScrollProgress() {
  const [pct, setPct] = useState(0);

  useEffect(() => {
    let raf = 0;
    const update = () => {
      const doc = document.documentElement;
      const max = doc.scrollHeight - window.innerHeight;
      const p = max > 0 ? window.scrollY / max : 0;
      setPct(Math.min(1, Math.max(0, p)));
      raf = 0;
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    update();
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div className="scroll-progress-track" aria-hidden>
      <div
        className="scroll-progress-bar"
        style={{ transform: `scaleX(${pct})` }}
      />
    </div>
  );
}
