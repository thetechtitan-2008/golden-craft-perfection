import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { getDay, DAYS, type TrainingDay } from "@/data/protocol";
import { AmbientBackground } from "@/components/AmbientBackground";
import { FloatingNav } from "@/components/FloatingNav";
import { ExerciseCard } from "@/components/ExerciseCard";
import { RestTimer } from "@/components/RestTimer";
import { useProgress } from "@/lib/progress";
import { ReadingProgress } from "@/components/ReadingProgress";

const PHASE_ACCENT: Record<string, string> = {
  Hypertrophy: "oklch(0.72 0.13 82)",
  Kinetic: "oklch(0.78 0.15 70)",
  Athletic: "oklch(0.82 0.15 60)",
  Potentiation: "oklch(0.88 0.14 55)",
  Recovery: "oklch(0.62 0.08 200)",
};

export const Route = createFileRoute("/day/$dayId")({
  loader: ({ params }): { day: TrainingDay } => {
    const day = getDay(params.dayId);
    if (!day) throw notFound();
    return { day };
  },
  head: ({ loaderData }) => ({
    meta: loaderData
      ? [
          { title: `Day ${loaderData.day.index} · ${loaderData.day.title} — SKP` },
          { name: "description", content: loaderData.day.subtitle },
          { property: "og:title", content: `Day ${loaderData.day.index} · ${loaderData.day.title}` },
          { property: "og:description", content: loaderData.day.narrative.slice(0, 180) },
        ]
      : [],
  }),
  component: DayPage,
  notFoundComponent: () => (
    <div className="min-h-screen flex items-center justify-center text-gold-bright">
      Day not found
    </div>
  ),
});

function DayPage() {
  const { day } = Route.useLoaderData() as { day: TrainingDay };
  const { markDayComplete, state, resetDay } = useProgress();
  const prevDay = DAYS[day.index - 2];
  const nextDay = DAYS[day.index];

  const exercises = day.exercises ?? [];
  const doneCount = exercises.filter(
    (e) => state.exercises[`${day.id}::${e.name}`]?.completed
  ).length;
  const total = exercises.length;
  const allDone = total > 0 && doneCount === total;

  return (
    <div className="relative min-h-screen">
      <AmbientBackground />
      <FloatingNav />
      <ReadingProgress />



      <main className="relative z-10 pt-32 pb-24 px-6">
        <div className="max-w-5xl mx-auto">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-[10px] tracking-[0.4em] uppercase text-gold-bright/60 hover:text-gold-bright transition-colors mb-8"
          >
            ← Return to Microcycle
          </Link>

          <div className="text-center mb-16">
            {/* Phase indicator with accent color */}
            <div className="flex items-center justify-center gap-4 mb-6">
              <span className="w-12 h-px bg-gradient-to-r from-transparent to-gold-bright/60" />
              <span
                className="text-[9px] tracking-[0.5em] uppercase font-mono px-3 py-1 rounded-sm border"
                style={{
                  color: PHASE_ACCENT[day.phase],
                  borderColor: `color-mix(in oklch, ${PHASE_ACCENT[day.phase]} 40%, transparent)`,
                }}
              >
                Day {day.index.toString().padStart(2, "0")} · {day.phase}
              </span>
              <span className="w-12 h-px bg-gradient-to-l from-transparent to-gold-bright/60" />
            </div>

            <h1 className="font-display text-4xl md:text-6xl gold-gradient-text leading-tight mb-4">
              {day.title}
            </h1>
            <p className="text-[11px] tracking-[0.35em] uppercase text-foreground/50">
              {day.subtitle}
            </p>

            {/* Hero narrative panel */}
            <div className="mt-8 max-w-3xl mx-auto glass-panel rounded-xl p-6 md:p-8 relative overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gold-bright/30 to-transparent" />
              <p className="font-serif italic text-base md:text-lg leading-[1.75] text-foreground/80">
                {day.narrative}
              </p>
              <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gold-bright/20 to-transparent" />
            </div>
            {/* Muscle group chips with exercise count */}
            <div className="mt-6 flex flex-wrap justify-center items-center gap-2">
              {total > 0 && (
                <span className="text-[9px] tracking-[0.25em] uppercase text-gold-bright/60 mr-2">
                  {total} {total === 1 ? 'exercise' : 'exercises'}
                </span>
              )}
              {day.muscleGroups.map((m) => (
                <span
                  key={m}
                  className="text-[9px] tracking-[0.3em] uppercase px-3 py-1.5 rounded-full border border-gold/25 text-foreground/70 hover:border-gold/40 hover:text-foreground/90 transition-colors"
                >
                  {m}
                </span>
              ))}
            </div>
          </div>

          {total > 0 && (
            <div className="mb-10 flex flex-wrap items-center justify-between gap-4 glass-panel rounded-xl p-4 px-6">
              <div className="flex items-center gap-4">
                <div className="font-mono text-sm text-gold-bright">
                  {doneCount.toString().padStart(2, "0")} <span className="text-foreground/40">/</span> {total.toString().padStart(2, "0")}
                </div>
                <div className="w-40 h-1 bg-gold/10 rounded-full overflow-hidden">
                  <div
                    className="h-full transition-all duration-500"
                    style={{
                      width: `${(doneCount / total) * 100}%`,
                      background: "linear-gradient(90deg, oklch(0.92 0.09 92), oklch(0.55 0.11 78))",
                    }}
                  />
                </div>
                <div className="text-[10px] tracking-[0.35em] uppercase text-foreground/50">
                  Session Progress
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => resetDay(day.id, exercises.map((e) => e.name))}
                  className="pusher-btn rounded-md px-4 py-2 text-[9px] tracking-[0.35em] uppercase text-gold-bright hover:text-white transition-colors"
                >
                  Reset
                </button>
                <button
                  onClick={() => markDayComplete(day.id)}
                  disabled={!allDone}
                  className="pusher-btn rounded-md px-4 py-2 text-[9px] tracking-[0.35em] uppercase text-gold-bright hover:text-white transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  Log Session
                </button>
              </div>
            </div>
          )}

          {/* grouped by category */}
          {(["warmup", "main", "cooldown"] as const).map((cat) => {
            const items = exercises.filter((e) => e.category === cat);
            if (items.length === 0) return null;
            const labels = {
              warmup: "Dynamic Warm-Up",
              main: "The Training Block",
              cooldown: "Systemic Cool-Down",
            };
            return (
              <div key={cat} className="mb-14">
                <div className="flex items-center gap-4 mb-6">
                  <div className="gold-hairline flex-1" />
                  <h2 className="font-display text-lg text-gold-bright tracking-[0.15em]">
                    {labels[cat]}
                  </h2>
                  <div className="gold-hairline flex-1" />
                </div>
                <div className="space-y-3">
                  {items.map((ex, i) => (
                    <ExerciseCard key={ex.name} dayId={day.id} ex={ex} index={i} />
                  ))}
                </div>
              </div>
            );
          })}

          {day.recovery && (
            <div className="mb-12">
              <div className="flex items-center gap-4 mb-8">
                <div className="gold-hairline flex-1" />
                <div className="flex items-center gap-3">
                  <svg viewBox="0 0 24 24" className="w-5 h-5 text-gold-bright/70" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z" />
                    <path d="M12 6v6l4 2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  <h2 className="font-display text-lg text-gold-bright tracking-[0.2em]">
                    Recovery · Hydration · Parasympathetic
                  </h2>
                </div>
                <div className="gold-hairline flex-1" />
              </div>
              <div className="space-y-4">
                {day.recovery.map((r, idx) => (
                  <div
                    key={r.name}
                    className="glass-panel rounded-xl p-6 relative overflow-hidden group hover:-translate-y-0.5 transition-transform duration-500"
                    data-reveal
                    data-reveal-delay={`${idx * 80}ms`}
                  >
                    {/* Recovery icon indicator */}
                    <div className="absolute top-6 right-6 w-10 h-10 rounded-full border border-gold/20 flex items-center justify-center">
                      <span className="text-[10px] font-mono text-gold/60">
                        {idx + 1}
                      </span>
                    </div>

                    <div className="flex flex-wrap items-baseline justify-between gap-3 mb-4 pr-12">
                      <h3 className="font-display text-lg text-gold-bright">{r.name}</h3>
                      <div className="flex gap-4 text-[10px] tracking-[0.3em] uppercase text-foreground/60">
                        <span>
                          <span className="text-gold-bright/70 mr-1">Volume</span>
                          {r.volume}
                        </span>
                        <span>
                          <span className="text-gold-bright/70 mr-1">Duration</span>
                          {r.duration}
                        </span>
                      </div>
                    </div>

                    <div className="text-sm text-foreground/80 mb-4 leading-relaxed">
                      {r.execution}
                    </div>

                    <div className="gold-hairline my-4" />

                    <p className="text-xs text-foreground/60 leading-relaxed italic">
                      {r.reasoning}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Day navigation */}
          <div className="mt-20 flex items-center justify-between gap-4">
            {prevDay ? (
              <Link
                to="/day/$dayId"
                params={{ dayId: prevDay.id }}
                className="glass-panel rounded-xl p-5 flex-1 max-w-xs group hover:-translate-y-0.5 transition-all duration-500 hover:shadow-[0_20px_50px_-20px_rgba(212,175,55,0.25)]"
              >
                <div className="text-[9px] tracking-[0.4em] uppercase text-gold-bright/60 mb-2">
                  ← Previous
                </div>
                <div className="font-display text-base text-gold-bright">
                  Day {prevDay.index}
                </div>
                <div className="text-[10px] tracking-[0.25em] uppercase text-foreground/50 mt-1">
                  {prevDay.focus}
                </div>
              </Link>
            ) : <div className="flex-1 max-w-xs" />}
            {nextDay && (
              <Link
                to="/day/$dayId"
                params={{ dayId: nextDay.id }}
                className="glass-panel rounded-xl p-5 flex-1 max-w-xs text-right group hover:-translate-y-0.5 transition-all duration-500 hover:shadow-[0_20px_50px_-20px_rgba(212,175,55,0.25)] ml-auto"
              >
                <div className="text-[9px] tracking-[0.4em] uppercase text-gold-bright/60 mb-2">
                  Next →
                </div>
                <div className="font-display text-base text-gold-bright">
                  Day {nextDay.index}
                </div>
                <div className="text-[10px] tracking-[0.25em] uppercase text-foreground/50 mt-1">
                  {nextDay.focus}
                </div>
              </Link>
            )}
          </div>
        </div>
      </main>

      <RestTimer />
    </div>
  );
}
