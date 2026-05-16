import { cn } from "@/lib/utils";

type DayStatus = "ok" | "partial" | "down" | "nodata";

const TILE: Record<DayStatus, string> = {
  ok: "bg-emerald-500/80 hover:bg-emerald-400",
  partial: "bg-amber-500/80 hover:bg-amber-400",
  down: "bg-red-500/80 hover:bg-red-400",
  nodata: "bg-neutral-200 dark:bg-neutral-800 hover:bg-neutral-300 dark:hover:bg-neutral-700",
};

const LABEL: Record<DayStatus, string> = {
  ok: "operational",
  partial: "partial outage",
  down: "outage",
  nodata: "no data",
};

function last90Days(): string[] {
  const days: string[] = [];
  const today = new Date();
  for (let i = 89; i >= 0; i--) {
    const d = new Date(today);
    d.setUTCDate(today.getUTCDate() - i);
    days.push(d.toISOString().slice(0, 10));
  }
  return days;
}

export function UptimeBar({
  name,
  currentStatus,
}: {
  name: string;
  currentStatus: "up" | "degraded" | "down";
}) {
  const days = last90Days();

  // We only have live data — show nodata for all days except today
  function dayStatus(index: number): DayStatus {
    if (index < 89) return "nodata"; // no historical data yet
    // today = current live status
    if (currentStatus === "up") return "ok";
    if (currentStatus === "degraded") return "partial";
    return "down";
  }

  return (
    <div className="space-y-1.5" aria-label={`90-day uptime for ${name}`}>
      <div className="flex gap-[2px] h-8" role="img">
        {days.map((day, i) => {
          const s = dayStatus(i);
          const tooltip = s === "nodata"
            ? `${day} — no data`
            : `${day} — ${LABEL[s]}`;
          return (
            <span
              key={day}
              title={tooltip}
              aria-label={tooltip}
              className={cn(
                "flex-1 rounded-[2px] transition-colors duration-150 cursor-default",
                TILE[s],
              )}
            />
          );
        })}
      </div>
      <div className="flex items-center justify-between text-[10px] text-neutral-500 tabular-nums">
        <span>90 days ago</span>
        <span>Today</span>
      </div>
    </div>
  );
}
