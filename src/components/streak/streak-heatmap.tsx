import { cn } from "@/lib/utils";

/**
 * GitHub-style heatmap of the last `weeks` weeks. Each square is a day:
 * trained (ember), a missed planned day (faint red), today's pending planned
 * day (ember ring), a future planned day (outline), or a rest day (muted).
 */
function fmt(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}
function add(d: Date, n: number): Date {
  const x = new Date(d);
  x.setDate(x.getDate() + n);
  return x;
}

type Kind = "trained" | "missed" | "pending" | "planned" | "rest";

export function StreakHeatmap({
  trainedDates,
  trainingDays,
  today,
  weeks = 18,
}: {
  trainedDates: string[];
  trainingDays: number[];
  today: string;
  weeks?: number;
}) {
  const trained = new Set(trainedDates);
  const planned = new Set(trainingDays);

  const [ty, tm, td] = today.split("-").map(Number);
  const todayDate = new Date(ty, tm - 1, td);

  // Start at the Monday of the earliest visible week.
  const rough = add(todayDate, -(weeks - 1) * 7);
  const start = add(rough, -((rough.getDay() + 6) % 7));

  const columns: { date: string; kind: Kind; dow: number }[][] = [];
  for (let w = 0; w < weeks; w++) {
    const col: { date: string; kind: Kind; dow: number }[] = [];
    for (let dow = 0; dow < 7; dow++) {
      const cur = add(start, w * 7 + dow);
      const ds = fmt(cur);
      const realDow = cur.getDay();
      const isPlanned = planned.has(realDow);
      const isFuture = ds > today;
      let kind: Kind = "rest";
      if (trained.has(ds)) kind = "trained";
      else if (isPlanned && ds === today) kind = "pending";
      else if (isPlanned && isFuture) kind = "planned";
      else if (isPlanned) kind = "missed";
      col.push({ date: ds, kind, dow: realDow });
    }
    columns.push(col);
  }

  return (
    <div className="space-y-3">
      <div className="flex gap-1 overflow-x-auto pb-1">
        {columns.map((col, i) => (
          <div key={i} className="flex flex-col gap-1">
            {col.map((cell) => (
              <Cell key={cell.date} kind={cell.kind} date={cell.date} />
            ))}
          </div>
        ))}
      </div>
      <div className="text-ash-500 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs">
        <Legend kind="trained" label="Trained" />
        <Legend kind="missed" label="Missed planned" />
        <Legend kind="pending" label="Today (pending)" />
        <Legend kind="rest" label="Rest day" />
      </div>
    </div>
  );
}

const CELL: Record<Kind, string> = {
  trained: "bg-ember",
  missed: "bg-red-500/25",
  pending: "bg-forge-800 ring-1 ring-ember ring-inset",
  planned: "bg-forge-800",
  rest: "bg-forge-850",
};

function Cell({ kind, date }: { kind: Kind; date: string }) {
  return (
    <span
      className={cn("size-3.5 rounded-[3px]", CELL[kind])}
      title={`${date}${kind === "trained" ? " — trained 💪" : kind === "missed" ? " — missed" : ""}`}
    />
  );
}

function Legend({ kind, label }: { kind: Kind; label: string }) {
  return (
    <span className="inline-flex items-center gap-1.5">
      <span className={cn("size-3 rounded-[3px]", CELL[kind])} /> {label}
    </span>
  );
}
