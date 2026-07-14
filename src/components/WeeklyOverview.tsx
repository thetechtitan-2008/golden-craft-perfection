import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { DAYS, type TrainingDay } from "@/data/protocol";
import { useProgress } from "@/lib/progress";

const PHASE_ACCENT: Record<TrainingDay["phase"], string> = {
  Hypertrophy: "oklch(0.72 0.13 82)",
  Kinetic: "oklch(0.78 0.15 70)",
  Athletic: "oklch(0.82 0.15 60)",
  Potentiation: "oklch(0.88 0.14 55)",
  Recovery: "oklch(0.62 0.08 200)",
};

/**
 * Weekly microcycle overview — seven premium instrument-panel cards laid out
 * as a horizontal spread that becomes a stack on mobile. Each card shows
 * phase, focus, muscles targeted, and completion history.
 */
export function WeeklyOverview() {
  return (
    <section id="week" className="relative py-32 px-6">
      <div className="max-w-7xl mx-auto">
        <SectionHeading
          kicker="The Microcycle"
          title="Discipline Becomes Legacy"
          description="A 6:1 architecture. Six days beneath the iron feed one day of parasympathetic restoration. Every session, a distinct movement in a single, uncompromising symphony."
        />

        <div className="mt-20 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5">
          {DAYS.map((day, i) => (
            <DayInstrumentCard key={day.id} day={day} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}

function DayInstrumentCard({ day, index }: { day: TrainingDay; index: number }) {
  const { state } = useProgress();
  const [hover, setHover] = useState(false);
  const history = state.history[day.id] ?? [];
  const totalExercises = (day.exercises?.length ?? 0) + (day.recovery?.length ?? 0);
  const completedThisSession = day.exercises
    ? day.exercises.filter((e) => state.exercises[`${day.id}::${e.name}`]?.completed).length
    : 0;
  const pct = totalExercises > 0 ? completedThisSession / totalExercises : 0;

  const accent = PHASE_ACCENT[day.phase];

  return (
    <Link
      to="/day/$dayId"
      params={{ dayId: day.id }}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      data-reveal
      data-reveal-delay={`${index * 90}ms`}
      className="group relative glass-panel rounded-2xl p-6 pt-7 min-h-[300px] flex flex-col overflow-hidden transition-transform duration-500 hover:-translate-y-1"
    >

      {/* corner ornaments */}
      <CornerOrnaments />

      {/* progress ring */}
      <div className="absolute top-5 right-5">
        <ProgressRing progress={pct} accent={accent} />
      </div>

      <div className="flex items-center gap-3 mb-4">
        <span
          className="text-[9px] tracking-[0.5em] uppercase font-mono px-2 py-1 rounded-sm border"
          style={{ color: accent, borderColor: `color-mix(in oklch, ${accent} 40%, transparent)` }}
        >
          Day {day.index.toString().padStart(2, "0")}
        </span>
        <span className="text-[9px] tracking-[0.35em] uppercase text-foreground/40">
          {day.phase}
        </span>
      </div>

      <h3 className="font-display text-2xl md:text-3xl leading-tight text-gold-bright mb-2">
        {day.title}
      </h3>
      <p className="text-xs md:text-sm tracking-[0.2em] uppercase text-foreground/60 mb-6">
        {day.subtitle}
      </p>

      <div className="flex flex-wrap gap-1.5 mb-6">
        {day.muscleGroups.map((m) => (
          <span
            key={m}
            className="text-[9px] tracking-[0.2em] uppercase px-2 py-0.5 rounded-full border border-gold/20 text-foreground/60"
          >
            {m}
          </span>
        ))}
      </div>

      <div className="mt-auto flex items-center justify-between text-[10px] tracking-[0.3em] uppercase">
        <span className="text-foreground/40">
          {history.length} sessions logged
        </span>
        <span className="text-gold-bright/70 group-hover:text-gold-bright transition-colors">
          Enter →
        </span>
      </div>

      {/* animated accent line */}
      <div
        className="absolute bottom-0 left-0 h-px transition-all duration-500"
        style={{
          width: hover ? "100%" : "24%",
          background: `linear-gradient(90deg, transparent, ${accent} 40%, ${accent} 60%, transparent)`,
        }}
      />
    </Link>
  );
}

function ProgressRing({ progress, accent }: { progress: number; accent: string }) {
  const R = 16;
  const C = 2 * Math.PI * R;
  return (
    <svg viewBox="0 0 40 40" className="w-10 h-10 progress-ring">
      <circle cx="20" cy="20" r={R} stroke="oklch(0.72 0.13 82 / 0.12)" strokeWidth="2" fill="none" />
      <circle
        cx="20" cy="20" r={R}
        stroke={accent}
        strokeWidth="2"
        fill="none"
        strokeLinecap="round"
        strokeDasharray={C}
        strokeDashoffset={C * (1 - progress)}
      />
      <text
        x="20" y="21"
        textAnchor="middle"
        dominantBaseline="middle"
        fontSize="8"
        fontFamily="'JetBrains Mono', monospace"
        fill={accent}
        transform="rotate(90 20 20)"
      >
        {Math.round(progress * 100)}
      </text>
    </svg>
  );
}

function CornerOrnaments() {
  return (
    <>
      {[
        "top-2 left-2 rotate-0",
        "top-2 right-2 rotate-90",
        "bottom-2 right-2 rotate-180",
        "bottom-2 left-2 -rotate-90",
      ].map((cls) => (
        <svg
          key={cls}
          viewBox="0 0 20 20"
          className={`absolute w-3 h-3 ${cls} text-gold-bright/40`}
          aria-hidden
        >
          <path d="M0 8 L0 0 L8 0" stroke="currentColor" strokeWidth="1" fill="none" />
        </svg>
      ))}
    </>
  );
}

export function SectionHeading({
  kicker, title, description,
}: { kicker: string; title: string; description?: string }) {
  return (
    <div className="text-center max-w-3xl mx-auto">
      <div className="flex items-center justify-center gap-4 mb-6">
        <span className="w-12 h-px bg-gradient-to-r from-transparent to-gold-bright/60" />
        <span className="text-[10px] tracking-[0.5em] uppercase text-gold-bright/70">
          {kicker}
        </span>
        <span className="w-12 h-px bg-gradient-to-l from-transparent to-gold-bright/60" />
      </div>
      <h2 className="font-display text-4xl md:text-6xl gold-gradient-text leading-tight">
        {title}
      </h2>
      {description && (
        <p className="mt-6 text-sm md:text-base text-foreground/60 leading-relaxed">
          {description}
        </p>
      )}
    </div>
  );
}
