/**
 * Supreme Kinetic Protocol — Web Audio sound engine.
 * Generates all sounds procedurally. No external assets, no credits.
 *
 * Respects prefers-reduced-motion and a `sr:sound` localStorage toggle.
 * Auto-unlocks on first user gesture (browser autoplay policy).
 */

let ctx: AudioContext | null = null;
let master: GainNode | null = null;
let enabled = true;
let unlocked = false;

const STORAGE_KEY = "sr:sound";

function getEnabled(): boolean {
  if (typeof window === "undefined") return false;
  const stored = window.localStorage.getItem(STORAGE_KEY);
  if (stored === "off") return false;
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  return !reduced;
}

function ensureCtx(): AudioContext | null {
  if (typeof window === "undefined") return null;
  if (!ctx) {
    const AC = window.AudioContext || (window as any).webkitAudioContext;
    if (!AC) return null;
    ctx = new AC();
    master = ctx.createGain();
    master.gain.value = 0.5;
    master.connect(ctx.destination);
    enabled = getEnabled();
  }
  return ctx;
}

export function unlockAudio(): void {
  if (unlocked) return;
  const c = ensureCtx();
  if (!c) return;
  if (c.state === "suspended") c.resume().catch(() => {});
  unlocked = true;
}

export function setSoundEnabled(v: boolean): void {
  enabled = v;
  if (typeof window !== "undefined") {
    window.localStorage.setItem(STORAGE_KEY, v ? "on" : "off");
  }
  if (master) master.gain.value = v ? 0.5 : 0;
}

export function isSoundEnabled(): boolean {
  return getEnabled();
}

// --- Sound primitives -------------------------------------------------------

function envelope(
  node: AudioParam,
  now: number,
  attack: number,
  peak: number,
  decay: number,
  sustain: number,
  release: number,
) {
  node.cancelScheduledValues(now);
  node.setValueAtTime(0.0001, now);
  node.exponentialRampToValueAtTime(peak, now + attack);
  node.exponentialRampToValueAtTime(Math.max(sustain, 0.0001), now + attack + decay);
  node.exponentialRampToValueAtTime(0.0001, now + attack + decay + release);
}

/** A crisp mechanical UI click — brass pusher meeting a jewel. */
export function playClick(intensity: number = 1): void {
  if (!enabled) return;
  const c = ensureCtx();
  if (!c) return;
  const now = c.currentTime;

  // High-frequency tick
  const tickOsc = c.createOscillator();
  const tickGain = c.createGain();
  tickOsc.type = "square";
  tickOsc.frequency.setValueAtTime(2600, now);
  tickOsc.frequency.exponentialRampToValueAtTime(900, now + 0.04);
  envelope(tickGain.gain, now, 0.001, 0.15 * intensity, 0.02, 0.001, 0.04);
  tickOsc.connect(tickGain).connect(master!);
  tickOsc.start(now);
  tickOsc.stop(now + 0.1);

  // Sub-body knock
  const bodyOsc = c.createOscillator();
  const bodyGain = c.createGain();
  bodyOsc.type = "sine";
  bodyOsc.frequency.setValueAtTime(180, now);
  bodyOsc.frequency.exponentialRampToValueAtTime(60, now + 0.08);
  envelope(bodyGain.gain, now, 0.001, 0.22 * intensity, 0.05, 0.001, 0.08);
  bodyOsc.connect(bodyGain).connect(master!);
  bodyOsc.start(now);
  bodyOsc.stop(now + 0.16);
}

/** Softer hover — a jewel bearing rolling. */
export function playHover(): void {
  if (!enabled) return;
  const c = ensureCtx();
  if (!c) return;
  const now = c.currentTime;
  const osc = c.createOscillator();
  const gain = c.createGain();
  osc.type = "sine";
  osc.frequency.setValueAtTime(1400, now);
  osc.frequency.exponentialRampToValueAtTime(1900, now + 0.08);
  envelope(gain.gain, now, 0.005, 0.05, 0.03, 0.001, 0.08);
  osc.connect(gain).connect(master!);
  osc.start(now);
  osc.stop(now + 0.14);
}

// --- Cinematic intro score --------------------------------------------------

let introNodes: { stop: () => void }[] = [];

/**
 * Play the full intro score — 10.5s.
 * Layers:
 *   0.0s  Deep sub-drone rises (rumble of forging)
 *   1.8s  Low brass swell (D minor)
 *   4.5s  Rising chime cluster (particles assemble)
 *   7.0s  Gold gong hit (eagle takes form)
 *   9.5s  Whoosh + fade
 */
export function playIntroScore(): () => void {
  if (!enabled) return () => {};
  const c = ensureCtx();
  if (!c) return () => {};
  const now = c.currentTime;

  // Master intro bus
  const bus = c.createGain();
  bus.gain.value = 0.8;
  bus.connect(master!);

  // 1. Sub drone — pink-ish noise low-passed
  const noiseBuf = c.createBuffer(1, c.sampleRate * 12, c.sampleRate);
  const d = noiseBuf.getChannelData(0);
  let last = 0;
  for (let i = 0; i < d.length; i++) {
    const white = Math.random() * 2 - 1;
    last = (last + 0.02 * white) / 1.02;
    d[i] = last * 3;
  }
  const noise = c.createBufferSource();
  noise.buffer = noiseBuf;
  const noiseFilter = c.createBiquadFilter();
  noiseFilter.type = "lowpass";
  noiseFilter.frequency.value = 120;
  const noiseGain = c.createGain();
  noiseGain.gain.setValueAtTime(0.0001, now);
  noiseGain.gain.exponentialRampToValueAtTime(0.35, now + 3);
  noiseGain.gain.exponentialRampToValueAtTime(0.5, now + 7);
  noiseGain.gain.exponentialRampToValueAtTime(0.0001, now + 10.5);
  noise.connect(noiseFilter).connect(noiseGain).connect(bus);
  noise.start(now);
  noise.stop(now + 11);

  // 2. Low brass swell — layered sawtooths (Dm chord: D2, F2, A2)
  const brassFreqs = [73.42, 87.31, 110.0];
  brassFreqs.forEach((f, i) => {
    const osc = c.createOscillator();
    const g = c.createGain();
    const filt = c.createBiquadFilter();
    osc.type = "sawtooth";
    osc.frequency.value = f;
    osc.detune.value = (i - 1) * 6;
    filt.type = "lowpass";
    filt.frequency.setValueAtTime(200, now);
    filt.frequency.exponentialRampToValueAtTime(1400, now + 6);
    filt.Q.value = 4;
    g.gain.setValueAtTime(0.0001, now + 1.5);
    g.gain.exponentialRampToValueAtTime(0.13, now + 5);
    g.gain.exponentialRampToValueAtTime(0.18, now + 8);
    g.gain.exponentialRampToValueAtTime(0.0001, now + 10.5);
    osc.connect(filt).connect(g).connect(bus);
    osc.start(now + 1.5);
    osc.stop(now + 11);
  });

  // 3. Rising chime cluster — pentatonic bells ascending
  const chimeNotes = [440, 523.25, 659.25, 783.99, 987.77, 1174.66];
  chimeNotes.forEach((f, i) => {
    const t = now + 4.5 + i * 0.35;
    const osc = c.createOscillator();
    const g = c.createGain();
    osc.type = "triangle";
    osc.frequency.value = f;
    envelope(g.gain, t, 0.005, 0.12, 0.2, 0.02, 1.4);
    osc.connect(g).connect(bus);
    osc.start(t);
    osc.stop(t + 1.8);

    // Bell overtone
    const o2 = c.createOscillator();
    const g2 = c.createGain();
    o2.type = "sine";
    o2.frequency.value = f * 2.76;
    envelope(g2.gain, t, 0.005, 0.04, 0.15, 0.005, 1.0);
    o2.connect(g2).connect(bus);
    o2.start(t);
    o2.stop(t + 1.5);
  });

  // 4. Gold gong hit at 7.0s — fundamental + inharmonic partials
  {
    const t = now + 7.0;
    const partials = [
      { f: 65.4, g: 0.6, dur: 4 },
      { f: 130.8, g: 0.3, dur: 3 },
      { f: 220, g: 0.18, dur: 2.5 },
      { f: 349.2, g: 0.1, dur: 2 },
      { f: 523.25, g: 0.06, dur: 1.6 },
    ];
    partials.forEach((p) => {
      const osc = c.createOscillator();
      const g = c.createGain();
      osc.type = "sine";
      osc.frequency.value = p.f;
      envelope(g.gain, t, 0.005, p.g, 0.15, 0.02, p.dur);
      osc.connect(g).connect(bus);
      osc.start(t);
      osc.stop(t + p.dur + 0.1);
    });

    // Metallic transient
    const impBuf = c.createBuffer(1, c.sampleRate * 0.3, c.sampleRate);
    const id = impBuf.getChannelData(0);
    for (let i = 0; i < id.length; i++) {
      id[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / id.length, 3);
    }
    const imp = c.createBufferSource();
    imp.buffer = impBuf;
    const impFilt = c.createBiquadFilter();
    impFilt.type = "bandpass";
    impFilt.frequency.value = 2200;
    impFilt.Q.value = 3;
    const impG = c.createGain();
    impG.gain.value = 0.35;
    imp.connect(impFilt).connect(impG).connect(bus);
    imp.start(t);
  }

  // 5. Whoosh at 9.5s — filter sweep on noise
  {
    const t = now + 9.5;
    const wBuf = c.createBuffer(1, c.sampleRate * 1.2, c.sampleRate);
    const wd = wBuf.getChannelData(0);
    for (let i = 0; i < wd.length; i++) wd[i] = (Math.random() * 2 - 1) * 0.6;
    const src = c.createBufferSource();
    src.buffer = wBuf;
    const filt = c.createBiquadFilter();
    filt.type = "bandpass";
    filt.Q.value = 2;
    filt.frequency.setValueAtTime(300, t);
    filt.frequency.exponentialRampToValueAtTime(6000, t + 0.9);
    const g = c.createGain();
    envelope(g.gain, t, 0.05, 0.35, 0.3, 0.001, 0.5);
    src.connect(filt).connect(g).connect(bus);
    src.start(t);
    src.stop(t + 1.1);
  }

  const stop = () => {
    try {
      bus.gain.cancelScheduledValues(c.currentTime);
      bus.gain.exponentialRampToValueAtTime(0.0001, c.currentTime + 0.4);
      setTimeout(() => bus.disconnect(), 500);
    } catch {}
  };
  introNodes.push({ stop });
  return stop;
}

export function stopAllIntro(): void {
  introNodes.forEach((n) => n.stop());
  introNodes = [];
}
