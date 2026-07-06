import { useEffect } from "react";

/**
 * Auto-reveal — attaches an IntersectionObserver to every element with
 * `data-reveal` and adds `.reveal-in` when it enters the viewport.
 * Also re-observes on route change via a MutationObserver.
 */
export function AutoReveal() {
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (typeof IntersectionObserver === "undefined") return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) {
      document.querySelectorAll<HTMLElement>("[data-reveal]").forEach((el) => {
        el.classList.add("reveal-in");
      });
      return;
    }

    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            const el = e.target as HTMLElement;
            const delay = el.dataset.revealDelay;
            if (delay) el.style.transitionDelay = delay;
            el.classList.add("reveal-in");
            io.unobserve(el);
          }
        }
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.1 },
    );

    const attach = () => {
      document
        .querySelectorAll<HTMLElement>("[data-reveal]:not(.reveal-in)")
        .forEach((el) => {
          if (!el.classList.contains("reveal")) el.classList.add("reveal");
          io.observe(el);
        });
    };

    attach();

    const mo = new MutationObserver(() => attach());
    mo.observe(document.body, { childList: true, subtree: true });

    return () => {
      mo.disconnect();
      io.disconnect();
    };
  }, []);

  return null;
}
