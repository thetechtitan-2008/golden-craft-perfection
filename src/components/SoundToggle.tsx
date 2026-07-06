import { useEffect, useState } from "react";
import { isSoundEnabled, setSoundEnabled, unlockAudio, playClick } from "@/lib/sound";

export function SoundToggle() {
  const [on, setOn] = useState(true);

  useEffect(() => {
    setOn(isSoundEnabled());
  }, []);

  const toggle = () => {
    const next = !on;
    unlockAudio();
    setSoundEnabled(next);
    setOn(next);
    if (next) playClick(0.8);
  };

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={on ? "Mute sound" : "Enable sound"}
      aria-pressed={on}
      className="w-9 h-9 rounded-full flex items-center justify-center text-gold-bright/80 hover:text-gold-bright transition-colors"
      title={on ? "Sound on" : "Sound off"}
    >
      <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
        <path d="M11 5 L6 9 H3 v6 h3 l5 4 Z" fill="currentColor" fillOpacity="0.15" />
        {on ? (
          <>
            <path d="M15.5 8.5 Q18 12 15.5 15.5" />
            <path d="M18 6 Q22 12 18 18" opacity="0.7" />
          </>
        ) : (
          <path d="M15 9 L21 15 M21 9 L15 15" />
        )}
      </svg>
    </button>
  );
}
