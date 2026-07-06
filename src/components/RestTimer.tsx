import { useEffect, useRef, useState } from "react";

/**
 * Rest timer — starts on demand from an exercise card, then floats at the
 * bottom-right of the viewport. Displays a mechanical progress ring, the
 * remaining time, and precision pusher-style controls.
 */

type TimerEvent = {
  seconds: number;
  label?: string;
};

const CH: EventTarget = typeof window === "undefined" ? new EventTarget() : window;
export const RestTimerAPI = {
  start(seconds: number, label?: string) {
    CH.dispatchEvent(new CustomEvent<TimerEvent>("skp-rest-start", { detail: { seconds, label } }));
  },
};

export function RestTimer() {
  const [total, setTotal] = useState(0);
  const [remaining, setRemaining] = useState(0);
  const [label, setLabel] = useState<string | undefined>();
  const [paused, setPaused] = useState(false);
  const [pulse, setPulse] = useState(false);
  const rafRef = useRef<number>(0);
  const startRef = useRef<number>(0);
  const remainingAtStartRef = useRef<number>(0);

  useEffect(() => {
    const handler = (e: Event) => {
      const detail = (e as CustomEvent<TimerEvent>).detail;
      setTotal(detail.seconds);
      setRemaining(detail.seconds);
      setLabel(detail.label);
      setPaused(false);
      setPulse(true);
      setTimeout(() => setPulse(false), 700);
      startRef.current = performance.now();
      remainingAtStartRef.current = detail.seconds;
    };
    CH.addEventListener("skp-rest-start", handler);
    return () => CH.removeEventListener("skp-rest-start", handler);
  }, []);

  useEffect(() => {
    if (total === 0 || paused) return;
    const tick = () => {
      const elapsed = (performance.now() - startRef.current) / 1000;
      const r = Math.max(0, remainingAtStartRef.current - elapsed);
      setRemaining(r);
      if (r <= 0) {
        // gentle beep via WebAudio
        try {
          const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
          const o = ctx.createOscillator();
          const g = ctx.createGain();
          o.frequency.value = 880;
          o.type = "sine";
          g.gain.value = 0.0001;
          o.connect(g).connect(ctx.destination);
          o.start();
          g.gain.exponentialRampToValueAtTime(0.15, ctx.currentTime + 0.02);
          g.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.6);
          o.stop(ctx.currentTime + 0.65);
        } catch {}
        return;
      }
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, [total, paused]);

  if (total === 0) return null;

  const progress = total > 0 ? (total - remaining) / total : 0;
  const R = 34;
  const C = 2 * Math.PI * R;

  const mm = Math.floor(remaining / 60).toString().padStart(2, "0");
  const ss = Math.floor(remaining % 60).toString().padStart(2, "0");

  return (
    <div
      className={`fixed bottom-6 right-6 z-40 glass-panel rounded-2xl p-4 pr-5 flex items-center gap-4 transition-all duration-500 ${
        pulse ? "scale-105" : "scale-100"
      }`}
      style={{ minWidth: 260 }}
    >
      <div className="relative w-20 h-20 flex items-center justify-center">
        <svg viewBox="0 0 80 80" className="absolute inset-0 progress-ring">
          <circle cx="40" cy="40" r={R} stroke="oklch(0.72 0.13 82 / 0.15)" strokeWidth="2" fill="none" />
          <circle
            cx="40" cy="40" r={R}
            stroke="url(#rt-g)"
            strokeWidth="2.5"
            fill="none"
            strokeLinecap="round"
            strokeDasharray={C}
            strokeDashoffset={C * (1 - progress)}
            style={{ transition: "stroke-dashoffset 0.4s linear" }}
          />
          <defs>
            <linearGradient id="rt-g" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0" stopColor="oklch(0.92 0.09 92)" />
              <stop offset="1" stopColor="oklch(0.55 0.11 78)" />
            </linearGradient>
          </defs>
        </svg>
        <div className="text-center">
          <div className="font-mono text-lg text-gold-bright leading-none tabular-nums">
            {mm}:{ss}
          </div>
          <div className="text-[8px] tracking-[0.3em] uppercase text-gold-bright/50 mt-1">Rest</div>
        </div>
      </div>
      <div className="flex flex-col gap-2 min-w-0">
        {label && (
          <div className="text-[10px] tracking-[0.25em] uppercase text-foreground/70 truncate max-w-[160px]">
            {label}
          </div>
        )}
        <div className="flex items-center gap-2">
          <PusherButton onClick={() => setPaused((p) => !p)}>
            {paused ? "Resume" : "Halt"}
          </PusherButton>
          <PusherButton
            onClick={() => {
              setTotal(0);
              setRemaining(0);
              setLabel(undefined);
            }}
          >
            Clear
          </PusherButton>
        </div>
      </div>
    </div>
  );
}

function PusherButton({ children, onClick }: { children: React.ReactNode; onClick: () => void }) {
  const [down, setDown] = useState(false);
  return (
    <button
      onClick={onClick}
      onPointerDown={() => setDown(true)}
      onPointerUp={() => setDown(false)}
      onPointerLeave={() => setDown(false)}
      className={`pusher-btn rounded-md px-3 py-1.5 text-[9px] tracking-[0.3em] uppercase text-gold-bright hover:text-white transition-colors ${
        down ? "pusher-btn-active" : ""
      }`}
    >
      {children}
    </button>
  );
}
