import { DAYS } from "@/data/protocol";
import { useProgress } from "@/lib/progress";
import { SectionHeading } from "./WeeklyOverview";

/**
 * Analytics panels: completion by day, personal records, session streak,
 * recovery indicator, muscle-group focus radar (simplified bar).
 */
export function Analytics() {
  const { state } = useProgress();

  // aggregate personal records
  const prs = Object.entries(state.exercises)
    .filter(([, l]) => l.bestWeight)
    .map(([k, l]) => ({ key: k, name: k.split("::")[1], weight: l.bestWeight! }))
    .slice(0, 6);

  // sessions in last 7 days
  const now = Date.now();
  const days7 = 7 * 24 * 60 * 60 * 1000;
  const recent = Object.values(state.history).flat().filter(
    (d) => now - new Date(d).getTime() <= days7
  );

  // Days by phase — completion this week (per day, session logged in last 7d)
  const completionByDay = DAYS.map((d) => ({
    day: d,
    logged: (state.history[d.id] ?? []).filter((ds) => now - new Date(ds).getTime() <= days7).length,
  }));

  // Recovery indicator — higher score if fewer high-intensity sessions in last 48h
  const recentHi = Object.entries(state.history).flatMap(([id, arr]) => {
    const day = DAYS.find((x) => x.id === id);
    if (!day) return [];
    if (day.phase === "Recovery") return [];
    return arr.filter((d) => now - new Date(d).getTime() <= 48 * 60 * 60 * 1000);
  }).length;
  const recovery = Math.max(0, Math.min(1, 1 - recentHi * 0.25));

  return (
    <section id="analytics" className="relative py-32 px-6">
      <div className="max-w-7xl mx-auto">
        <SectionHeading
          kicker="Precision Analytics"
          title="Signal · Not Noise"
          description="Every session logged. Every load. Every millisecond of rest. Read your body like an instrument."
        />

        <div className="mt-20 grid grid-cols-1 lg:grid-cols-3 gap-5">
          <Panel title="Weekly Sessions" kicker="Last 7 days">
            {recent.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-8 px-4">
                <div className="w-16 h-16 rounded-full border border-gold/20 flex items-center justify-center mb-4">
                  <svg viewBox="0 0 24 24" className="w-8 h-8 text-gold/40" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <circle cx="12" cy="12" r="10" />
                    <path d="M12 6v6l4 2" strokeLinecap="round" />
                  </svg>
                </div>
                <div className="text-[11px] tracking-[0.3em] uppercase text-foreground/40 text-center">
                  No sessions yet
                </div>
                <div className="mt-2 text-[10px] tracking-[0.2em] text-foreground/25 text-center">
                  Complete your first workout
                </div>
              </div>
            ) : (
              <>
                <div className="flex items-end gap-2 h-32">
                  {completionByDay.map(({ day, logged }) => (
                    <div key={day.id} className="flex-1 flex flex-col items-center gap-2">
                      <div className="w-full flex-1 flex items-end">
                        <div
                          className="w-full rounded-t transition-all duration-500"
                          style={{
                            height: `${Math.min(100, logged * 60)}%`,
                            background: logged
                              ? "linear-gradient(180deg, oklch(0.92 0.09 92), oklch(0.55 0.11 78))"
                              : "oklch(0.72 0.13 82 / 0.08)",
                          }}
                        />
                      </div>
                      <div className="text-[9px] font-mono text-foreground/50">
                        {day.index}
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-4 flex items-baseline gap-3">
                  <span className="font-display text-3xl gold-gradient-text">{recent.length}</span>
                  <span className="text-[10px] tracking-[0.35em] uppercase text-foreground/50">
                    sessions logged
                  </span>
                </div>
              </>
            )}
          </Panel>

          <Panel title="Recovery Index" kicker="Autonomic state">
            <div className="flex items-center justify-center py-4">
              <div className="relative w-40 h-40">
                <svg viewBox="0 0 100 100" className="w-full h-full progress-ring">
                  <circle cx="50" cy="50" r="42" fill="none" stroke="oklch(0.72 0.13 82 / 0.12)" strokeWidth="3" />
                  <circle
                    cx="50" cy="50" r="42"
                    fill="none"
                    stroke="url(#rec-g)"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeDasharray={2 * Math.PI * 42}
                    strokeDashoffset={2 * Math.PI * 42 * (1 - recovery)}
                  />
                  <defs>
                    <linearGradient id="rec-g" x1="0" y1="0" x2="1" y2="1">
                      <stop offset="0" stopColor="oklch(0.92 0.09 92)" />
                      <stop offset="1" stopColor="oklch(0.62 0.08 200)" />
                    </linearGradient>
                  </defs>
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="font-display text-3xl gold-gradient-text">
                    {Math.round(recovery * 100)}
                  </span>
                  <span className="text-[9px] tracking-[0.35em] uppercase text-foreground/50 mt-1">
                    Parasympathetic
                  </span>
                </div>
              </div>
            </div>
            <p className="text-[11px] text-center text-foreground/50 leading-relaxed">
              Based on cumulative high-intensity load over the last 48h.
            </p>
          </Panel>

          <Panel title="Personal Records" kicker="Peak loads">
            {prs.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-8 px-4">
                <div className="w-16 h-16 rounded-full border border-gold/20 flex items-center justify-center mb-4">
                  <svg viewBox="0 0 24 24" className="w-8 h-8 text-gold/40" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path d="M12 2 L15.09 8.26 L22 9.27 L17 14.14 L18.18 21.02 L12 17.77 L5.82 21.02 L7 14.14 L2 9.27 L8.91 8.26 Z" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
                <div className="text-[11px] tracking-[0.3em] uppercase text-foreground/40 text-center">
                  No records yet
                </div>
                <div className="mt-2 text-[10px] tracking-[0.2em] text-foreground/25 text-center">
                  Log your first weight to begin tracking
                </div>
              </div>
            ) : (
              <ul className="space-y-2 max-h-64 overflow-auto pr-1">
                {prs.map((pr, i) => (
                  <li
                    key={pr.key}
                    className="flex items-center justify-between gap-3 py-2 border-b border-gold/10 last:border-0 group hover:bg-gold/5 px-2 -mx-2 rounded transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <span className="w-5 h-5 rounded-full border border-gold/25 flex items-center justify-center text-[8px] font-mono text-gold-bright/70">
                        {i + 1}
                      </span>
                      <span className="text-xs text-foreground/80 truncate group-hover:text-foreground transition-colors">{pr.name}</span>
                    </div>
                    <span className="font-mono text-sm text-gold-bright shrink-0">{pr.weight}</span>
                  </li>
                ))}
              </ul>
            )}
          </Panel>

          <Panel title="Muscle Focus" kicker="Distribution" className="lg:col-span-2">
            <MuscleFocus />
          </Panel>

          <Panel title="Streak" kicker="Consecutive days">
            <StreakDisplay history={state.history} />
          </Panel>
        </div>
      </div>
    </section>
  );
}

function Panel({
  title, kicker, children, className = "",
}: { title: string; kicker: string; children: React.ReactNode; className?: string }) {
  return (
    <div className={`glass-panel rounded-2xl p-6 relative overflow-hidden ${className}`}>
      <div className="flex items-baseline justify-between mb-5">
        <h3 className="font-display text-lg text-gold-bright">{title}</h3>
        <span className="text-[9px] tracking-[0.35em] uppercase text-foreground/40">{kicker}</span>
      </div>
      {children}
    </div>
  );
}

function MuscleFocus() {
  const { state } = useProgress();

  // Compute actual muscle focus based on completed exercises
  const now = Date.now();
  const days30 = 30 * 24 * 60 * 60 * 1000;

  const muscleCounts: Record<string, number> = {};

  // Count completed exercises by their muscle groups in the last 30 days
  Object.entries(state.history).forEach(([dayId, timestamps]) => {
    const recentTimes = timestamps.filter((t) => now - new Date(t).getTime() <= days30);
    if (recentTimes.length === 0) return;

    const day = DAYS.find((d) => d.id === dayId);
    if (!day || !day.exercises) return;

    // For each completed exercise on this day, add to muscle counts
    day.exercises.forEach((ex) => {
      const log = state.exercises[`${dayId}::${ex.name}`];
      if (log?.completed) {
        day.muscleGroups.forEach((mg) => {
          muscleCounts[mg] = (muscleCounts[mg] || 0) + recentTimes.length;
        });
      }
    });
  });

  // Static baseline for when no data exists
  const staticGroups: [string, number][] = [
    ["Chest", 12], ["Back", 14], ["Shoulders", 10],
    ["Arms", 8], ["Forearms", 16], ["Quads", 10],
    ["Glutes", 12], ["Hamstrings", 10], ["Core", 14], ["CNS", 12],
  ];

  // Use actual data if available, otherwise fall back to protocol distribution
  const hasData = Object.keys(muscleCounts).length > 0;

  const groups: [string, number][] = hasData
    ? Object.entries(muscleCounts)
        .map(([name, count]) => [name, count] as [string, number])
        .sort((a, b) => b[1] - a[1])
    : staticGroups;

  const max = Math.max(...groups.map(([, v]) => v), 1);

  return (
    <div className="space-y-2.5">
      {groups.slice(0, 10).map(([name, val]) => (
        <div key={name} className="flex items-center gap-4 group">
          <div className="w-24 text-[10px] tracking-[0.25em] uppercase text-foreground/60 text-right shrink-0 group-hover:text-foreground/80 transition-colors">
            {name}
          </div>
          <div className="flex-1 h-2 bg-gold/10 rounded-full overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-700"
              style={{
                width: `${(val / max) * 100}%`,
                background: "linear-gradient(90deg, oklch(0.55 0.11 78), oklch(0.92 0.09 92))",
              }}
            />
          </div>
          <div className="w-8 text-right font-mono text-[10px] text-gold-bright/80">
            {hasData ? val : `${val}%`}
          </div>
        </div>
      ))}
      {hasData && (
        <div className="pt-3 text-[9px] tracking-[0.3em] uppercase text-foreground/40 text-center">
          Last 30 days · {Object.values(muscleCounts).reduce((a, b) => a + b, 0)} total activations
        </div>
      )}
    </div>
  );
}

function StreakDisplay({ history }: { history: Record<string, string[]> }) {
  const allDates = new Set(Object.values(history).flat());
  let streak = 0;
  const cur = new Date();
  for (let i = 0; i < 90; i++) {
    const d = new Date(cur.getTime() - i * 86400000).toISOString().slice(0, 10);
    if (allDates.has(d)) streak++;
    else if (i > 0) break;
  }

  const hasStreak = streak > 0;

  return (
    <div className="flex flex-col items-center justify-center py-4">
      {hasStreak ? (
        <>
          <div className="font-display text-6xl gold-gradient-text">{streak}</div>
          <div className="text-[10px] tracking-[0.35em] uppercase text-foreground/50 mt-2">
            {streak === 1 ? "day" : "days"}
          </div>
        </>
      ) : (
        <>
          <div className="w-14 h-14 rounded-full border border-gold/20 flex items-center justify-center mb-2">
            <svg viewBox="0 0 24 24" className="w-7 h-7 text-gold/40" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          <div className="text-[11px] tracking-[0.3em] uppercase text-foreground/40 text-center">
            Start your streak
          </div>
          <div className="mt-1 text-[10px] tracking-[0.2em] text-foreground/25 text-center">
            Train today
          </div>
        </>
      )}
    </div>
  );
}
