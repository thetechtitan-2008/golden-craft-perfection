import { useState } from "react";
import type { Exercise } from "@/data/protocol";
import { useProgress } from "@/lib/progress";
import { RestTimerAPI } from "./RestTimer";

const CATEGORY_LABEL: Record<Exercise["category"], string> = {
  warmup: "Dynamic Warm-Up",
  main: "Main Block",
  cooldown: "Systemic Cool-Down",
};

const CATEGORY_ACCENT: Record<Exercise["category"], string> = {
  warmup: "oklch(0.75 0.14 90)",
  main: "oklch(0.72 0.13 82)",
  cooldown: "oklch(0.62 0.08 200)",
};

function parseRestSeconds(rest: string): number | null {
  // pick the first number followed by 's' (or bare) in the rest string
  const m = rest.match(/(\d+)\s*s/i);
  if (m) return parseInt(m[1], 10);
  const m2 = rest.match(/(\d+)\s*min/i);
  if (m2) return parseInt(m2[1], 10) * 60;
  return null;
}

export function ExerciseCard({
  dayId, ex, index,
}: { dayId: string; ex: Exercise; index: number }) {
  const [open, setOpen] = useState(false);
  const { getExercise, setExercise } = useProgress();
  const log = getExercise(dayId, ex.name);
  const restSec = parseRestSeconds(ex.rest);
  const accent = CATEGORY_ACCENT[ex.category];

  return (
    <div
      className={`glass-panel rounded-xl overflow-hidden transition-all duration-500 rise ${
        log?.completed ? "ring-1 ring-gold/40" : ""
      }`}
      style={{ animationDelay: `${index * 40}ms` }}
    >
      <button
        onClick={() => setOpen((o) => !o)}
        className="w-full p-5 md:p-6 flex items-center gap-5 text-left group"
      >
        {/* status disc */}
        <div className="relative shrink-0">
          <div
            className={`w-11 h-11 rounded-full border flex items-center justify-center transition-all ${
              log?.completed
                ? "border-gold-bright bg-gold-bright/15"
                : "border-gold-bright/30"
            }`}
          >
            {log?.completed ? (
              <svg viewBox="0 0 24 24" className="w-5 h-5 text-gold-bright" fill="none">
                <path d="M5 13l4 4L19 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            ) : (
              <span
                className="font-mono text-xs"
                style={{ color: accent }}
              >
                {(index + 1).toString().padStart(2, "0")}
              </span>
            )}
          </div>
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1.5">
            <span
              className="text-[8px] tracking-[0.35em] uppercase font-mono px-1.5 py-0.5 rounded-sm border"
              style={{ color: accent, borderColor: `color-mix(in oklch, ${accent} 35%, transparent)` }}
            >
              {CATEGORY_LABEL[ex.category]}
            </span>
            {log?.bestWeight && (
              <span className="text-[9px] tracking-[0.3em] uppercase text-gold-bright/80">
                PR · {log.bestWeight}
              </span>
            )}
          </div>
          <div className="font-display text-base md:text-lg text-gold-bright leading-tight">
            {ex.name}
          </div>
          <div className="mt-1.5 flex flex-wrap gap-x-4 gap-y-1 text-[10px] tracking-[0.25em] uppercase text-foreground/50">
            <span><span className="text-foreground/70">Sets</span> {ex.sets}</span>
            <span><span className="text-foreground/70">Reps</span> {ex.reps}</span>
            <span><span className="text-foreground/70">Rest</span> {ex.rest}</span>
          </div>
        </div>

        <svg
          viewBox="0 0 24 24"
          className={`w-4 h-4 text-gold-bright/60 shrink-0 transition-transform duration-500 ${
            open ? "rotate-180" : ""
          }`}
          fill="none"
        >
          <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      <div
        className={`grid transition-all duration-500 ease-out ${
          open ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
        }`}
      >
        <div className="overflow-hidden">
          <div className="px-5 md:px-6 pb-6 pt-1 grid md:grid-cols-[1fr,260px] gap-6">
            <div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-5">
                <Spec label="Tempo" value={ex.tempo} accent={accent} />
                <Spec label="RPE / %1RM" value={ex.rpe} accent={accent} />
                <Spec label="Rest" value={ex.rest} accent={accent} />
                <Spec label="Sets" value={ex.sets} accent={accent} />
              </div>
              <div className="gold-hairline mb-4" />
              <div className="text-[10px] tracking-[0.35em] uppercase text-gold-bright/60 mb-2">
                Biomechanical Reasoning
              </div>
              <p className="text-sm text-foreground/75 leading-relaxed">
                {ex.reasoning}
              </p>
            </div>

            <div className="space-y-3">
              <div className="glass-panel rounded-lg p-4">
                <label className="text-[9px] tracking-[0.35em] uppercase text-gold-bright/70 block mb-2">
                  Load (kg / lb)
                </label>
                <input
                  type="text"
                  inputMode="decimal"
                  defaultValue={log?.weight ?? ""}
                  onBlur={(e) => setExercise(dayId, ex.name, { weight: e.target.value })}
                  placeholder="—"
                  className="w-full bg-transparent border-b border-gold-bright/25 focus:border-gold-bright outline-none text-lg font-mono text-gold-bright py-1"
                />
                {log?.bestWeight && (
                  <div className="mt-2 text-[9px] tracking-[0.3em] uppercase text-gold-bright/60">
                    Personal Record · {log.bestWeight}
                  </div>
                )}
              </div>

              <div className="glass-panel rounded-lg p-4">
                <label className="text-[9px] tracking-[0.35em] uppercase text-gold-bright/70 block mb-2">
                  Notes
                </label>
                <textarea
                  defaultValue={log?.notes ?? ""}
                  onBlur={(e) => setExercise(dayId, ex.name, { notes: e.target.value })}
                  rows={2}
                  placeholder="Form cues, feel…"
                  className="w-full bg-transparent border-b border-gold-bright/25 focus:border-gold-bright outline-none text-xs text-foreground/80 py-1 resize-none"
                />
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => setExercise(dayId, ex.name, { completed: !log?.completed })}
                  className="pusher-btn flex-1 rounded-md px-3 py-2.5 text-[9px] tracking-[0.35em] uppercase text-gold-bright hover:text-white transition-colors"
                >
                  {log?.completed ? "Undo" : "Complete"}
                </button>
                {restSec && (
                  <button
                    onClick={() => RestTimerAPI.start(restSec, ex.name)}
                    className="pusher-btn flex-1 rounded-md px-3 py-2.5 text-[9px] tracking-[0.35em] uppercase text-gold-bright hover:text-white transition-colors"
                    title={`Start ${restSec}s rest`}
                  >
                    Rest · {restSec}s
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Spec({ label, value, accent }: { label: string; value: string; accent: string }) {
  return (
    <div className="glass-panel rounded-lg p-3">
      <div className="text-[8px] tracking-[0.35em] uppercase text-foreground/50 mb-1">
        {label}
      </div>
      <div className="font-mono text-sm" style={{ color: accent }}>
        {value}
      </div>
    </div>
  );
}
