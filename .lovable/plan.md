# Supreme Regalia V2 — Phased Refinement Plan

**Rule Zero honored:** no section removed, no layout changed, no component replaced. Every existing file is *refined in place*.

Your brief contains ~25 distinct systems. Delivering all of them as one atomic change would produce an unreviewable diff and burn a lot of AI-music/asset credits without your say-so. I propose 4 phases. Phase 1 lands this turn; phases 2–4 land as follow-ups you approve individually.

---

## Phase 1 — Foundations (this turn)

The refinements that touch every pixel and unlock everything else.

1. **Typography system overhaul** — display font pairing (Cormorant / Instrument Serif + Inter), monumental hero sizing, refined tracking, magazine line-heights, responsive fluid scale via `clamp()`.
2. **Gold material system** — replace flat gold with layered gradients, animated specular sweep (`@keyframes shimmer`), soft bloom, brushed-metal token set. All existing `text-gold` / `border-gold` usages automatically upgrade via token remap.
3. **Handcrafted Light Mode** — ivory/marble/champagne palette hand-tuned per section (not inverted). Theme toggle in FloatingNav, `localStorage` persistence, smooth cross-fade transition.
4. **Copywriting pass** — every headline and subhead rewritten in the requested timeless-luxury register ("Forged Beyond Limits", "The Architecture of Greatness", etc.) across Hero, WeeklyOverview, WatchChronograph, day route.
5. **Scroll & UX chrome** — top scroll-progress bar, luxury back-to-top button, smooth anchor scrolling, focus-visible rings, `prefers-reduced-motion` global respect.
6. **Micro-interactions** — refined hover states on cards/buttons/nav (translateY + shadow bloom + gold border sweep), section reveal via IntersectionObserver with staggered `translateY/opacity`, GPU-accelerated (`transform`/`opacity` only).
7. **Custom gold cursor** (desktop, pointer-fine only, auto-disabled on touch and reduced-motion).
8. **Reading-progress indicator** on the day route.

## Phase 2 — Immersion (next turn, on approval)

9. **Cinematic intro rebuild** — canvas-based particle field (2–4k particles, GPU-friendly, no WebGL dependency), 10-second sequence matching your storyboard beats, seamless fade-into-hero. Skippable, remembered.
10. **Chronograph ticking** — Web Audio API oscillator-synthesized tick (no asset needed), IntersectionObserver-gated, smooth gain-node fade.
11. **Ambient section wind** — very quiet Web-Audio noise generator, section-aware filter sweep, muteable.
12. **Section-based accent lighting** — a fixed radial gradient behind content whose hue/position lerps as sections scroll into view.

## Phase 3 — Original Orchestral Soundtrack (needs your OK)

13. **ElevenLabs Music API** — generate a ~30s original cinematic orchestral piece (soaring strings, brass, taiko, choir pads) as an MP3, stored as a Lovable asset, synced to the intro. **This uses paid AI credits** and needs the ElevenLabs connector linked. Confirm before I proceed.

## Phase 4 — Settings & Polish

14. **Settings panel** (gear icon in FloatingNav) — sound on/off, animation intensity, particle density, theme, cursor effects, all persisted.
15. **3D mouse-parallax depth** on lion, chronograph, hero eagle.
16. **Perf pass** — `content-visibility: auto` on off-screen sections, `will-change` audit, image `loading="lazy"` + `decoding="async"`, prefetch hints.

---

## Technical notes

- All new code is additive or edits-in-place; no file deletions.
- No new heavy deps. Canvas 2D for particles (not Three.js) to keep bundle lean and preserve 60fps on mid-tier laptops.
- Audio is Web-Audio synthesis where possible (ticking, ambient wind) to avoid asset weight; only the orchestral hero cue is a generated file.
- Theme + settings persist to `localStorage` under `sr:*` keys; SSR-safe (guarded by `typeof window`).
- `prefers-reduced-motion` short-circuits particles, cursor, parallax, and reveal delays.

---

## What I need from you

**Approve Phase 1 to start.** Then confirm for Phase 3 whether I should spend AI credits generating the orchestral track via ElevenLabs (alternative: leave the intro silent with only a subtle low-brass sub-drone synthesized in Web Audio — no credit cost, less cinematic).
