import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { getDay, DAYS, type TrainingDay } from "@/data/protocol";
import { AmbientBackground } from "@/components/AmbientBackground";
import { FloatingNav } from "@/components/FloatingNav";
import { ExerciseCard } from "@/components/ExerciseCard";
import { RestTimer } from "@/components/RestTimer";
import { useProgress } from "@/lib/progress";
import { ReadingProgress } from "@/components/ReadingProgress";

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
            <div className="font-mono text-[10px] tracking-[0.5em] uppercase text-gold-bright/70 mb-6">
              Day {day.index.toString().padStart(2, "0")} · {day.phase}
            </div>
            <h1 className="font-display text-4xl md:text-6xl gold-gradient-text leading-tight mb-4">
              {day.title}
            </h1>
            <p className="text-[11px] tracking-[0.35em] uppercase text-foreground/50">
              {day.subtitle}
            </p>
            <div className="mt-8 max-w-3xl mx-auto glass-panel rounded-xl p-6">
              <p className="font-serif italic text-base md:text-lg leading-relaxed text-foreground/80">
                {day.narrative}
              </p>
            </div>
            <div className="mt-6 flex flex-wrap justify-center gap-2">
              {day.muscleGroups.map((m) => (
                <span
                  key={m}
                  className="text-[9px] tracking-[0.3em] uppercase px-3 py-1 rounded-full border border-gold/25 text-foreground/70"
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
            <div>
              <div className="flex items-center gap-4 mb-6">
                <div className="gold-hairline flex-1" />
                <h2 className="font-display text-lg text-gold-bright tracking-[0.15em]">
                  Recovery · Hydration · Parasympathetic
                </h2>
                <div className="gold-hairline flex-1" />
              </div>
              <div className="space-y-4">
                {day.recovery.map((r) => (
                  <div key={r.name} className="glass-panel rounded-xl p-6">
                    <div className="flex flex-wrap items-baseline justify-between gap-3 mb-4">
                      <h3 className="font-display text-lg text-gold-bright">{r.name}</h3>
                      <div className="flex gap-3 text-[10px] tracking-[0.3em] uppercase text-foreground/60">
                        <span><span className="text-gold-bright/70">Volume</span> {r.volume}</span>
                        <span><span className="text-gold-bright/70">Duration</span> {r.duration}</span>
                      </div>
                    </div>
                    <div className="text-sm text-foreground/80 mb-3">{r.execution}</div>
                    <div className="gold-hairline my-3" />
                    <p className="text-xs text-foreground/60 leading-relaxed">{r.reasoning}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="mt-20 flex items-center justify-between gap-4">
            {prevDay ? (
              <Link
                to="/day/$dayId"
                params={{ dayId: prevDay.id }}
                className="glass-panel rounded-xl p-5 flex-1 max-w-xs group hover:-translate-y-0.5 transition-transform"
              >
                <div className="text-[9px] tracking-[0.4em] uppercase text-foreground/50">
                  ← Previous
                </div>
                <div className="font-display text-sm text-gold-bright mt-2">
                  Day {prevDay.index} · {prevDay.focus}
                </div>
              </Link>
            ) : <div />}
            {nextDay && (
              <Link
                to="/day/$dayId"
                params={{ dayId: nextDay.id }}
                className="glass-panel rounded-xl p-5 flex-1 max-w-xs text-right group hover:-translate-y-0.5 transition-transform ml-auto"
              >
                <div className="text-[9px] tracking-[0.4em] uppercase text-foreground/50">
                  Next →
                </div>
                <div className="font-display text-sm text-gold-bright mt-2">
                  Day {nextDay.index} · {nextDay.focus}
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
