import { useEffect, useState } from "react";

/**
 * Ultra-high-end mechanical skeleton chronograph. SVG-based, GPU-accelerated
 * transforms only. Depicts: main dial, tourbillon carriage (1 rpm),
 * escapement wheel & balance oscillator, mechanical rotor, Geneva stripes,
 * heat-blued screws, ruby jewels, sweeping seconds hand, minutes, hours.
 *
 * ENGAGE / HALT / CLEAR pushers drive the chronograph seconds sub-dial.
 */
export function WatchChronograph() {
  const [now, setNow] = useState(() => new Date());
  const [chronoRunning, setChronoRunning] = useState(false);
  const [chronoStart, setChronoStart] = useState<number | null>(null);
  const [chronoAccum, setChronoAccum] = useState(0); // seconds
  const [chronoDisplay, setChronoDisplay] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 250);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    if (!chronoRunning) {
      setChronoDisplay(chronoAccum);
      return;
    }
    let raf = 0;
    const tick = () => {
      const elapsed = chronoStart ? (performance.now() - chronoStart) / 1000 : 0;
      setChronoDisplay(chronoAccum + elapsed);
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [chronoRunning, chronoStart, chronoAccum]);

  const seconds = now.getSeconds() + now.getMilliseconds() / 1000;
  const minutes = now.getMinutes() + seconds / 60;
  const hours = (now.getHours() % 12) + minutes / 60;

  const secDeg = seconds * 6;
  const minDeg = minutes * 6;
  const hourDeg = hours * 30;

  const chronoSec = chronoDisplay % 60;
  const chronoMin = Math.floor(chronoDisplay / 60) % 30;
  const chronoSecDeg = chronoSec * 6;
  const chronoMinDeg = chronoMin * 12;

  return (
    <div className="relative w-full max-w-[560px] mx-auto aspect-square">
      <svg viewBox="0 0 600 600" className="w-full h-full drop-shadow-[0_30px_60px_rgba(0,0,0,0.7)]">
        <defs>
          <radialGradient id="case" cx="0.4" cy="0.35" r="0.75">
            <stop offset="0" stopColor="#3a2f1a" />
            <stop offset="0.35" stopColor="#1a150a" />
            <stop offset="1" stopColor="#0a0805" />
          </radialGradient>
          <radialGradient id="bezel" cx="0.5" cy="0.5" r="0.5">
            <stop offset="0.85" stopColor="#8a6a2a" />
            <stop offset="0.9" stopColor="#f5d76e" />
            <stop offset="1" stopColor="#3a2810" />
          </radialGradient>
          <radialGradient id="dial" cx="0.5" cy="0.4" r="0.7">
            <stop offset="0" stopColor="#1a1408" />
            <stop offset="0.6" stopColor="#0a0805" />
            <stop offset="1" stopColor="#050403" />
          </radialGradient>
          <linearGradient id="gold" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#ffe89a" />
            <stop offset="0.5" stopColor="#d4af37" />
            <stop offset="1" stopColor="#6a4a1a" />
          </linearGradient>
          <linearGradient id="handGold" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#fff2c2" />
            <stop offset="0.5" stopColor="#e8c96a" />
            <stop offset="1" stopColor="#8a6a2a" />
          </linearGradient>
          <linearGradient id="blued" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#6a8ac2" />
            <stop offset="1" stopColor="#1a2a52" />
          </linearGradient>
          <radialGradient id="ruby" cx="0.3" cy="0.3" r="0.7">
            <stop offset="0" stopColor="#ff8888" />
            <stop offset="0.5" stopColor="#c02030" />
            <stop offset="1" stopColor="#4a0812" />
          </radialGradient>
          <pattern id="geneva" width="8" height="60" patternUnits="userSpaceOnUse" patternTransform="rotate(35)">
            <rect width="8" height="60" fill="#1a1408" />
            <path d="M0 0 Q 4 30 0 60" stroke="#3a2a12" strokeWidth="0.4" fill="none" opacity="0.6" />
            <path d="M4 0 Q 8 30 4 60" stroke="#3a2a12" strokeWidth="0.4" fill="none" opacity="0.6" />
          </pattern>
          <filter id="glow"><feGaussianBlur stdDeviation="2" /></filter>
        </defs>

        {/* Outer case */}
        <circle cx="300" cy="300" r="290" fill="url(#case)" />
        {/* Bezel */}
        <circle cx="300" cy="300" r="272" fill="none" stroke="url(#bezel)" strokeWidth="10" />
        <circle cx="300" cy="300" r="278" fill="none" stroke="#d4af37" strokeWidth="0.6" opacity="0.5" />
        <circle cx="300" cy="300" r="266" fill="none" stroke="#d4af37" strokeWidth="0.4" opacity="0.4" />

        {/* Dial */}
        <circle cx="300" cy="300" r="260" fill="url(#dial)" />

        {/* Geneva stripe backdrop rings */}
        <circle cx="300" cy="300" r="240" fill="url(#geneva)" opacity="0.35" />

        {/* Hour markers — cardinal roman-numeral inspired batons */}
        {Array.from({ length: 60 }).map((_, i) => {
          const isHour = i % 5 === 0;
          const a = (i / 60) * Math.PI * 2 - Math.PI / 2;
          const r1 = isHour ? 232 : 244;
          const r2 = 252;
          const x1 = 300 + Math.cos(a) * r1;
          const y1 = 300 + Math.sin(a) * r1;
          const x2 = 300 + Math.cos(a) * r2;
          const y2 = 300 + Math.sin(a) * r2;
          return (
            <line
              key={i}
              x1={x1} y1={y1} x2={x2} y2={y2}
              stroke="url(#gold)"
              strokeWidth={isHour ? 2.2 : 0.8}
              strokeLinecap="round"
            />
          );
        })}

        {/* Hour numerals — I III VI IX XII */}
        {[
          { n: "XII", a: 0 },
          { n: "III", a: 90 },
          { n: "VI", a: 180 },
          { n: "IX", a: 270 },
        ].map(({ n, a }) => {
          const rad = ((a - 90) * Math.PI) / 180;
          const x = 300 + Math.cos(rad) * 210;
          const y = 300 + Math.sin(rad) * 210;
          return (
            <text
              key={n}
              x={x} y={y}
              fontFamily="'Cinzel', serif"
              fontSize="18"
              fill="#d4af37"
              textAnchor="middle"
              dominantBaseline="middle"
              opacity="0.75"
            >{n}</text>
          );
        })}

        {/* SKELETON — visible movement plates around the dial */}
        {/* Main plate cut-outs suggested by faint gold outlines */}
        <g opacity="0.7">
          <circle cx="300" cy="180" r="45" fill="none" stroke="#3a2810" strokeWidth="0.5" />
          <circle cx="300" cy="180" r="42" fill="#0a0805" stroke="url(#gold)" strokeWidth="0.6" opacity="0.6" />
          {/* small seconds sub-dial */}
          <text x="300" y="145" fontFamily="'Cinzel', serif" fontSize="7" fill="#d4af37" textAnchor="middle" opacity="0.6" letterSpacing="2">
            SECONDES
          </text>
          {Array.from({ length: 12 }).map((_, i) => {
            const a = (i / 12) * Math.PI * 2 - Math.PI / 2;
            return (
              <line
                key={i}
                x1={300 + Math.cos(a) * 38} y1={180 + Math.sin(a) * 38}
                x2={300 + Math.cos(a) * 42} y2={180 + Math.sin(a) * 42}
                stroke="#d4af37" strokeWidth="0.5" opacity="0.6"
              />
            );
          })}
          {/* small seconds hand */}
          <g transform={`translate(300 180) rotate(${secDeg})`}>
            <line x1="0" y1="6" x2="0" y2="-36" stroke="url(#handGold)" strokeWidth="1.2" strokeLinecap="round" />
            <circle r="2" fill="url(#ruby)" />
          </g>
        </g>

        {/* Tourbillon carriage — bottom, 1 rotation per minute */}
        <g transform="translate(300 420)">
          <circle r="48" fill="#0a0805" stroke="url(#gold)" strokeWidth="0.6" opacity="0.7" />
          <g style={{ animation: "tick 60s linear infinite", transformOrigin: "center", transformBox: "fill-box" }}>
            {/* carriage bridges */}
            <path d="M-42 0 L42 0 M0 -42 L0 42" stroke="url(#gold)" strokeWidth="1.4" strokeLinecap="round" />
            <circle r="18" fill="none" stroke="url(#gold)" strokeWidth="0.8" />
            {/* escapement wheel */}
            <g>
              {Array.from({ length: 15 }).map((_, i) => (
                <line
                  key={i}
                  x1="0" y1="0"
                  x2={Math.cos((i / 15) * Math.PI * 2) * 16}
                  y2={Math.sin((i / 15) * Math.PI * 2) * 16}
                  stroke="url(#gold)" strokeWidth="0.7"
                />
              ))}
              <circle r="16" fill="none" stroke="url(#gold)" strokeWidth="0.6" />
              <circle r="3" fill="url(#ruby)" />
            </g>
            {/* mounting screws */}
            {[0, 90, 180, 270].map((d) => (
              <g key={d} transform={`rotate(${d}) translate(42 0)`}>
                <circle r="3" fill="url(#blued)" stroke="#8aa2c8" strokeWidth="0.4" />
                <line x1="-2" y1="0" x2="2" y2="0" stroke="#0a0805" strokeWidth="0.6" />
              </g>
            ))}
          </g>
          {/* balance wheel oscillating */}
          <g style={{ animation: "balance-osc 0.42s ease-in-out infinite", transformOrigin: "center", transformBox: "fill-box" }}>
            <circle r="24" fill="none" stroke="url(#gold)" strokeWidth="0.5" opacity="0.4" />
            <line x1="-24" y1="0" x2="24" y2="0" stroke="url(#gold)" strokeWidth="0.6" opacity="0.5" />
          </g>
          <text y="72" fontFamily="'Cinzel', serif" fontSize="6" fill="#d4af37" textAnchor="middle" opacity="0.6" letterSpacing="2">
            TOURBILLON
          </text>
        </g>

        {/* Chronograph minutes sub-dial (30 min counter) — right */}
        <g transform="translate(420 300)">
          <circle r="42" fill="#0a0805" stroke="url(#gold)" strokeWidth="0.6" opacity="0.7" />
          {Array.from({ length: 6 }).map((_, i) => {
            const a = (i / 6) * Math.PI * 2 - Math.PI / 2;
            return (
              <text
                key={i}
                x={Math.cos(a) * 30} y={Math.sin(a) * 30 + 3}
                fontFamily="'Cinzel', serif" fontSize="7" fill="#d4af37"
                textAnchor="middle" opacity="0.6"
              >{i * 5 || 30}</text>
            );
          })}
          <g transform={`rotate(${chronoMinDeg})`}>
            <line x1="0" y1="4" x2="0" y2="-32" stroke="url(#handGold)" strokeWidth="1.2" strokeLinecap="round" />
            <circle r="2" fill="url(#ruby)" />
          </g>
          <text y="-52" fontFamily="'Cinzel', serif" fontSize="6" fill="#d4af37" textAnchor="middle" opacity="0.5" letterSpacing="2">
            MINUTES
          </text>
        </g>

        {/* Chronograph hour sub-dial (12h counter) — left */}
        <g transform="translate(180 300)">
          <circle r="42" fill="#0a0805" stroke="url(#gold)" strokeWidth="0.6" opacity="0.7" />
          {Array.from({ length: 12 }).map((_, i) => {
            const a = (i / 12) * Math.PI * 2 - Math.PI / 2;
            return (
              <line
                key={i}
                x1={Math.cos(a) * 34} y1={Math.sin(a) * 34}
                x2={Math.cos(a) * 38} y2={Math.sin(a) * 38}
                stroke="#d4af37" strokeWidth="0.5" opacity="0.6"
              />
            );
          })}
          {/* rotor slowly rotating behind */}
          <g style={{ animation: "rotor-spin 22s linear infinite", transformOrigin: "center", transformBox: "fill-box" }} opacity="0.35">
            <path d="M -36 0 A 36 36 0 0 1 36 0 L 8 0 A 8 8 0 0 0 -8 0 Z" fill="url(#gold)" opacity="0.8" />
          </g>
          <text y="-52" fontFamily="'Cinzel', serif" fontSize="6" fill="#d4af37" textAnchor="middle" opacity="0.5" letterSpacing="2">
            ROTOR
          </text>
        </g>

        {/* Main hands */}
        <g transform={`translate(300 300) rotate(${hourDeg})`}>
          <path d="M -3 12 L -2 -108 L 0 -120 L 2 -108 L 3 12 Z" fill="url(#handGold)" stroke="#3a2810" strokeWidth="0.4" />
          <circle r="4" fill="#0a0805" stroke="url(#gold)" strokeWidth="0.5" />
        </g>
        <g transform={`translate(300 300) rotate(${minDeg})`}>
          <path d="M -2 16 L -1.5 -160 L 0 -172 L 1.5 -160 L 2 16 Z" fill="url(#handGold)" stroke="#3a2810" strokeWidth="0.4" />
        </g>
        {/* Chronograph sweeping seconds — center */}
        <g transform={`translate(300 300) rotate(${chronoSecDeg})`} style={{ transition: chronoRunning ? "none" : "transform 0.4s ease" }}>
          <line x1="0" y1="30" x2="0" y2="-224" stroke="url(#handGold)" strokeWidth="1.4" strokeLinecap="round" />
          <circle cy="-224" r="5" fill="none" stroke="url(#gold)" strokeWidth="1" />
        </g>
        {/* Center cap with ruby */}
        <circle cx="300" cy="300" r="6" fill="#0a0805" stroke="url(#gold)" strokeWidth="0.6" />
        <circle cx="300" cy="300" r="2.5" fill="url(#ruby)" />

        {/* Brand plaque */}
        <text x="300" y="252" fontFamily="'Cinzel', serif" fontSize="11" fill="#d4af37" textAnchor="middle" letterSpacing="6" opacity="0.85">
          SUPREME
        </text>
        <text x="300" y="268" fontFamily="'Inter', sans-serif" fontSize="6" fill="#d4af37" textAnchor="middle" letterSpacing="4" opacity="0.6">
          KINETIC · CHRONOMETER
        </text>
        <text x="300" y="365" fontFamily="'Inter', sans-serif" fontSize="5" fill="#d4af37" textAnchor="middle" letterSpacing="4" opacity="0.5">
          SKELETON · MANUFACTURE
        </text>

        {/* Case crown & pushers (visual, real interaction below) */}
        <rect x="583" y="240" width="16" height="24" rx="2" fill="url(#bezel)" />
        <rect x="583" y="290" width="20" height="20" rx="3" fill="url(#bezel)" />
        <rect x="583" y="336" width="16" height="24" rx="2" fill="url(#bezel)" />

        {/* sapphire reflection */}
        <ellipse cx="230" cy="180" rx="130" ry="60" fill="white" opacity="0.03" />
      </svg>

      {/* Precision pushers */}
      <div className="mt-8 flex items-center justify-center gap-3 flex-wrap">
        <Pusher
          onClick={() => {
            if (chronoRunning) return;
            setChronoStart(performance.now());
            setChronoRunning(true);
          }}
          active={chronoRunning}
        >
          Engage
        </Pusher>
        <Pusher
          onClick={() => {
            if (!chronoRunning) return;
            const elapsed = chronoStart ? (performance.now() - chronoStart) / 1000 : 0;
            setChronoAccum((a) => a + elapsed);
            setChronoRunning(false);
            setChronoStart(null);
          }}
        >
          Halt
        </Pusher>
        <Pusher
          onClick={() => {
            setChronoRunning(false);
            setChronoStart(null);
            setChronoAccum(0);
            setChronoDisplay(0);
          }}
        >
          Clear
        </Pusher>
      </div>

      <div className="mt-4 text-center">
        <div className="font-mono text-3xl text-gold-bright tabular-nums">
          {formatChrono(chronoDisplay)}
        </div>
        <div className="text-[9px] tracking-[0.4em] uppercase text-gold-bright/50 mt-1">
          Chronograph
        </div>
      </div>
    </div>
  );
}

function formatChrono(s: number) {
  const mm = Math.floor(s / 60).toString().padStart(2, "0");
  const ss = Math.floor(s % 60).toString().padStart(2, "0");
  const cs = Math.floor((s % 1) * 100).toString().padStart(2, "0");
  return `${mm}:${ss}.${cs}`;
}

function Pusher({
  children, onClick, active = false,
}: { children: React.ReactNode; onClick: () => void; active?: boolean }) {
  const [down, setDown] = useState(false);
  return (
    <button
      onClick={onClick}
      onPointerDown={() => setDown(true)}
      onPointerUp={() => setDown(false)}
      onPointerLeave={() => setDown(false)}
      className={`pusher-btn rounded-md min-w-[110px] px-6 py-3 text-[10px] tracking-[0.4em] uppercase transition-colors ${
        active ? "text-white" : "text-gold-bright"
      } ${down ? "pusher-btn-active" : ""}`}
      aria-pressed={active}
    >
      <span className="relative">{children}</span>
    </button>
  );
}
