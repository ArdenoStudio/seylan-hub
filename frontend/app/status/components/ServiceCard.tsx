import { cn } from "@/lib/utils";
import { UptimeBar } from "./UptimeBar";

export type ServiceStatus = "up" | "degraded" | "down";

export interface Service {
  key: string;
  label: string;
  description: string;
  status: ServiceStatus;
  latency: number | null;
  httpStatus: number | null;
}

const DOT: Record<ServiceStatus, string> = {
  up: "bg-emerald-500 shadow-[0_0_0_3px_rgb(16_185_129/0.15)]",
  degraded: "bg-amber-500 shadow-[0_0_0_3px_rgb(245_158_11/0.15)]",
  down: "bg-red-500 shadow-[0_0_0_3px_rgb(239_68_68/0.15)] animate-pulse",
};

const LABEL: Record<ServiceStatus, string> = {
  up: "Operational",
  degraded: "Degraded",
  down: "Down",
};

const STATUS_TEXT: Record<ServiceStatus, string> = {
  up: "text-emerald-600 dark:text-emerald-400",
  degraded: "text-amber-600 dark:text-amber-400",
  down: "text-red-600 dark:text-red-400",
};

function uptimePct(status: ServiceStatus): string {
  if (status === "up") return "100.00%";
  if (status === "degraded") return "—";
  return "0.00%";
}

function uptimeHealth(status: ServiceStatus): "ok" | "warn" | "bad" {
  if (status === "up") return "ok";
  if (status === "degraded") return "warn";
  return "bad";
}

const TILE: Record<"ok" | "warn" | "bad", string> = {
  ok: "bg-neutral-50 dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100",
  warn: "bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 ring-1 ring-amber-500/20",
  bad: "bg-red-50 dark:bg-red-950/40 text-red-700 dark:text-red-300 ring-1 ring-red-500/20",
};

function Stat({ label, status }: { label: string; status: ServiceStatus }) {
  const health = uptimeHealth(status);
  const value = uptimePct(status);
  return (
    <div className={cn("rounded-lg py-2 text-center", TILE[health])}>
      <div className="text-[10px] uppercase tracking-wider opacity-70">{label}</div>
      <div className="text-sm font-semibold font-mono tabular-nums">{value}</div>
    </div>
  );
}

export function ServiceCard({ service }: { service: Service }) {
  return (
    <article className="rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950 p-5 transition-colors hover:border-neutral-300 dark:hover:border-neutral-700">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <h3 className="font-medium text-neutral-900 dark:text-neutral-100">{service.label}</h3>
          <p className="text-xs text-neutral-500 mt-0.5 font-mono truncate">{service.description}</p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <span
            aria-hidden="true"
            className={cn("h-2.5 w-2.5 rounded-full", DOT[service.status])}
          />
          <span className={cn("text-sm font-medium", STATUS_TEXT[service.status])}>
            {LABEL[service.status]}
          </span>
        </div>
      </div>

      <div className="mt-5">
        <UptimeBar name={service.label} currentStatus={service.status} />
      </div>

      <div className="mt-5 grid grid-cols-4 gap-2 sm:gap-3">
        <Stat label="24H" status={service.status} />
        <Stat label="7D" status={service.status} />
        <Stat label="30D" status={service.status} />
        <Stat label="1Y" status={service.status} />
      </div>

      {service.latency !== null && (
        <p className="mt-3 text-xs text-neutral-500">
          Response time (24h):{" "}
          <span className="font-mono tabular-nums">{service.latency}ms</span>
        </p>
      )}
    </article>
  );
}
