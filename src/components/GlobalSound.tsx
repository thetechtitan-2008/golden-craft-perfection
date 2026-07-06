import { useEffect } from "react";
import { playClick, playHover, unlockAudio, isSoundEnabled } from "@/lib/sound";

/**
 * Global sound wiring:
 *  - Unlocks the audio context on the first user gesture (browser policy).
 *  - Adds subtle click sounds to buttons, links, and role=button elements.
 *  - Adds soft hover ticks to primary interactive elements.
 *  - Respects the user's sound toggle + reduced-motion.
 */
export function GlobalSound() {
  useEffect(() => {
    if (typeof window === "undefined") return;

    const unlock = () => unlockAudio();
    window.addEventListener("pointerdown", unlock, { once: true, passive: true });
    window.addEventListener("keydown", unlock, { once: true });

    const isInteractive = (el: EventTarget | null): HTMLElement | null => {
      if (!(el instanceof HTMLElement)) return null;
      return el.closest(
        "button, a[href], [role='button'], input[type='submit'], input[type='button']",
      ) as HTMLElement | null;
    };

    const onClick = (e: MouseEvent) => {
      if (!isSoundEnabled()) return;
      const target = isInteractive(e.target);
      if (!target) return;
      if (target.dataset.silent === "true") return;
      // Heavier click for pushers, lighter for links
      const intensity = target.classList.contains("pusher-btn") ? 1.2 : 0.75;
      playClick(intensity);
    };

    let lastHover = 0;
    const onOver = (e: PointerEvent) => {
      if (!isSoundEnabled()) return;
      const target = isInteractive(e.target);
      if (!target) return;
      if (target.dataset.silent === "true") return;
      const now = performance.now();
      if (now - lastHover < 90) return;
      lastHover = now;
      playHover();
    };

    window.addEventListener("click", onClick, true);
    window.addEventListener("pointerover", onOver, { passive: true });
    return () => {
      window.removeEventListener("click", onClick, true);
      window.removeEventListener("pointerover", onOver);
      window.removeEventListener("pointerdown", unlock);
      window.removeEventListener("keydown", unlock);
    };
  }, []);

  return null;
}
