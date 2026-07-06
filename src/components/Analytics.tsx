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
            <div className="flex items-end gap-2 h-32">
              {completionByDay.map(({ day, logged }) => (
                <div key={day.id} className="flex-1 flex flex-col items-center gap-2">
                  <div className="w-full flex-1 flex items-end">
                    <div
                      className="w-full rounded-t"
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
              <div className="text-[11px] tracking-[0.3em] uppercase text-foreground/40 py-8 text-center">
                Log your first weight to begin
              </div>
            ) : (
              <ul className="space-y-2 max-h-64 overflow-auto pr-1">
                {prs.map((pr) => (
                  <li
                    key={pr.key}
                    className="flex items-center justify-between gap-3 py-2 border-b border-gold/10 last:border-0"
                  >
                    <span className="text-xs text-foreground/80 truncate">{pr.name}</span>
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
  // static distribution based on protocol
  const groups: [string, number][] = [
    ["Chest", 12], ["Back / Lats", 14], ["Shoulders", 10],
    ["Arms", 8], ["Forearms", 16], ["Quads", 10],
    ["Glutes", 12], ["Hamstrings", 10], ["Core", 14], ["CNS", 12],
  ];
  const max = Math.max(...groups.map(([, v]) => v));
  return (
    <div className="space-y-2.5">
      {groups.map(([name, val]) => (
        <div key={name} className="flex items-center gap-4">
          <div className="w-24 text-[10px] tracking-[0.25em] uppercase text-foreground/60 text-right shrink-0">
            {name}
          </div>
          <div className="flex-1 h-2 bg-gold/10 rounded-full overflow-hidden">
            <div
              className="h-full rounded-full"
              style={{
                width: `${(val / max) * 100}%`,
                background: "linear-gradient(90deg, oklch(0.55 0.11 78), oklch(0.92 0.09 92))",
              }}
            />
          </div>
          <div className="w-8 text-right font-mono text-[10px] text-gold-bright/80">{val}%</div>
        </div>
      ))}
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
  return (
    <div className="flex flex-col items-center justify-center py-4">
      <div className="font-display text-6xl gold-gradient-text">{streak}</div>
      <div className="text-[10px] tracking-[0.35em] uppercase text-foreground/50 mt-2">
        {streak === 1 ? "day" : "days"}
      </div>
    </div>
  );
}
