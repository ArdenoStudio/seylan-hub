"use client";

import { useEffect, useRef, useState } from "react";
import { StatusBanner, type SiteStatus } from "./components/StatusBanner";
import { ServiceCard, type Service } from "./components/ServiceCard";

interface StatusData {
  overall: "operational" | "degraded" | "outage";
  services: Service[];
  checkedAt: string;
}

const REFRESH_INTERVAL = 30;

function overallToSiteStatus(overall: StatusData["overall"]): SiteStatus {
  if (overall === "operational") return "up";
  if (overall === "degraded") return "degraded";
  return "down";
}

export default function StatusPage() {
  const [data, setData] = useState<StatusData | null>(null);
  const [loading, setLoading] = useState(true);
  const [countdown, setCountdown] = useState(REFRESH_INTERVAL);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  async function fetchStatus() {
    try {
      const res = await fetch("/api/status", { cache: "no-store" });
      const json = await res.json();
      setData(json);
    } catch {
      // keep stale data
    } finally {
      setLoading(false);
      setCountdown(REFRESH_INTERVAL);
    }
  }

  useEffect(() => {
    fetchStatus();
    timerRef.current = setInterval(() => {
      setCountdown((c) => {
        if (c <= 1) { fetchStatus(); return REFRESH_INTERVAL; }
        return c - 1;
      });
    }, 1000);
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, []);

  const status = data ? overallToSiteStatus(data.overall) : "up";
  const affectedNames = data?.services
    .filter((s) => s.status === "down" || s.status === "degraded")
    .map((s) => s.label) ?? [];

  const lastUpdate = data
    ? new Date(data.checkedAt).toLocaleString(undefined, {
        dateStyle: "medium",
        timeStyle: "short",
      })
    : null;

  return (
    <main className="min-h-screen">
      <div className="mx-auto max-w-3xl px-5 sm:px-8 py-12 sm:py-16">

        {/* Header */}
        <header className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-2.5">
            <div className="h-7 w-7 rounded-md bg-blue-600 grid place-items-center">
              <span className="text-white text-sm font-bold">S</span>
            </div>
            <span className="font-semibold tracking-tight">SeylanHub Status</span>
          </div>
          <a
            href="https://seylan-hub.vercel.app"
            className="text-sm text-neutral-500 hover:text-blue-600 transition-colors"
          >
            seylan-hub.vercel.app →
          </a>
        </header>

        {/* Status banner */}
        {loading ? (
          <div className="rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-neutral-100 dark:bg-neutral-900 h-24 animate-pulse" />
        ) : (
          <StatusBanner status={status} affectedNames={affectedNames} />
        )}

        {/* Services */}
        <section className="mt-10">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-medium text-neutral-500 uppercase tracking-wider">
              Services
            </h2>
            {lastUpdate && (
              <span className="text-xs text-neutral-500">Updated {lastUpdate}</span>
            )}
          </div>

          {loading ? (
            <div className="space-y-3">
              {Array.from({ length: 4 }).map((_, i) => (
                <div
                  key={i}
                  className="rounded-xl border border-neutral-200 dark:border-neutral-800 h-44 animate-pulse bg-neutral-100 dark:bg-neutral-900"
                />
              ))}
            </div>
          ) : (
            <div className="stagger space-y-3">
              {data?.services.map((svc) => (
                <ServiceCard key={svc.key} service={svc} />
              ))}
            </div>
          )}
        </section>

        {/* Footer */}
        <footer className="mt-16 pt-8 border-t border-neutral-200 dark:border-neutral-800 text-xs text-neutral-500 flex flex-wrap items-center justify-between gap-3">
          <span>Powered by Ardeno Studio · Checked every 5 minutes</span>
          <div className="flex items-center gap-1 tabular-nums">
            <span
              className="inline-block h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse"
              aria-hidden="true"
            />
            Auto-refresh in {String(countdown).padStart(2, "0")}s
          </div>
        </footer>
      </div>
    </main>
  );
}
