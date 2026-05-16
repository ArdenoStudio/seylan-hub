import { CheckCircle2, AlertTriangle, XCircle } from "lucide-react";
import { cn } from "@/lib/utils";

export type SiteStatus = "up" | "degraded" | "down";

const STYLES: Record<SiteStatus, string> = {
  up: "from-emerald-500/15 to-emerald-500/5 border-emerald-500/30 text-emerald-700 dark:text-emerald-300",
  degraded: "from-amber-500/15 to-amber-500/5 border-amber-500/30 text-amber-700 dark:text-amber-300",
  down: "from-red-500/15 to-red-500/5 border-red-500/30 text-red-700 dark:text-red-300",
};

const ICONS: Record<SiteStatus, React.ReactNode> = {
  up: <CheckCircle2 className="h-7 w-7" aria-hidden="true" />,
  degraded: <AlertTriangle className="h-7 w-7" aria-hidden="true" />,
  down: <XCircle className="h-7 w-7" aria-hidden="true" />,
};

function bannerCopy(
  status: SiteStatus,
  affectedNames: string[],
): { title: string; sub: string } {
  const names = affectedNames.join(", ");
  switch (status) {
    case "up":
      return {
        title: "All systems operational",
        sub: "Every SeylanHub endpoint is responding normally.",
      };
    case "degraded":
      return {
        title: affectedNames.length === 1 ? `${names} is degraded` : "Partial degradation",
        sub: affectedNames.length > 0
          ? `${names} ${affectedNames.length > 1 ? "are" : "is"} responding slower than expected.`
          : "One or more services are slower than expected.",
      };
    case "down":
      return {
        title: affectedNames.length === 1 ? `${names} is down` : `${affectedNames.length} services are down`,
        sub: affectedNames.length > 0
          ? `Affected: ${names}. We're investigating.`
          : "We're investigating an outage on one or more services.",
      };
  }
}

export function StatusBanner({
  status,
  affectedNames,
}: {
  status: SiteStatus;
  affectedNames: string[];
}) {
  const copy = bannerCopy(status, affectedNames);
  return (
    <div
      role="status"
      className={cn(
        "rounded-2xl border bg-gradient-to-br p-6 sm:p-8 flex items-center gap-4",
        STYLES[status],
      )}
    >
      <div className="shrink-0">{ICONS[status]}</div>
      <div>
        <h1 className="text-xl sm:text-2xl font-semibold tracking-tight">{copy.title}</h1>
        <p className="text-sm opacity-80 mt-0.5">{copy.sub}</p>
      </div>
    </div>
  );
}
