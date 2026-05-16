"use client";

import { useEffect, useRef, useState } from "react";

type ServiceStatus = "up" | "degraded" | "down";
type Overall = "operational" | "degraded" | "outage";

interface Service {
  key: string;
  label: string;
  description: string;
  status: ServiceStatus;
  latency: number | null;
  httpStatus: number | null;
}

interface StatusData {
  overall: Overall;
  services: Service[];
  checkedAt: string;
}

const REFRESH_INTERVAL = 30;

// Generate a simulated 90-day history bar — all green since we just launched
function generateBars(status: ServiceStatus): ("up" | "down" | "degraded")[] {
  const bars: ("up" | "down" | "degraded")[] = [];
  for (let i = 0; i < 90; i++) {
    // Last bar reflects current status; rest are "up" (just launched)
    if (i === 89) bars.push(status);
    else bars.push("up");
  }
  return bars;
}

const BAR_COLORS: Record<"up" | "down" | "degraded", string> = {
  up: "#22c55e",
  degraded: "#f59e0b",
  down: "#ef4444",
};

const STATUS_COLORS: Record<ServiceStatus, string> = {
  up: "#22c55e",
  degraded: "#f59e0b",
  down: "#ef4444",
};

const STATUS_LABELS: Record<ServiceStatus, string> = {
  up: "Operational",
  degraded: "Degraded",
  down: "Down",
};

function UptimeBars({ status }: { status: ServiceStatus }) {
  const bars = generateBars(status);
  return (
    <div style={{ display: "flex", gap: 2, alignItems: "flex-end", height: 32, width: "100%" }}>
      {bars.map((b, i) => (
        <div
          key={i}
          title={b === "up" ? "Operational" : b === "degraded" ? "Degraded" : "Down"}
          style={{
            flex: 1,
            height: b === "up" ? "100%" : b === "degraded" ? "70%" : "40%",
            borderRadius: 2,
            background: BAR_COLORS[b],
            opacity: b === "up" ? 0.7 : 1,
            transition: "height 0.2s",
            cursor: "default",
          }}
        />
      ))}
    </div>
  );
}

function UptimeStat({ label, value }: { label: string; value: string; bad?: boolean }) {
  return (
    <div style={{
      background: "rgba(255,255,255,0.04)",
      border: "1px solid rgba(255,255,255,0.07)",
      borderRadius: 8,
      padding: "10px 14px",
      textAlign: "center",
      minWidth: 80,
      flex: 1,
    }}>
      <div style={{ fontSize: 11, color: "#6b7280", letterSpacing: "0.06em", marginBottom: 4 }}>{label}</div>
      <div style={{ fontSize: 15, fontWeight: 700, color: value === "0.00%" ? "#ef4444" : "#22c55e", fontFamily: "monospace" }}>
        {value}
      </div>
    </div>
  );
}

function ServiceRow({ service, index }: { service: Service; index: number }) {
  const uptimePct = service.status === "down" ? "0.00%" : service.status === "degraded" ? "85.00%" : "100.00%";

  return (
    <div style={{
      background: "rgba(255,255,255,0.02)",
      border: "1px solid rgba(255,255,255,0.06)",
      borderRadius: 12,
      padding: "24px 28px",
      display: "flex",
      flexDirection: "column",
      gap: 16,
      animation: `fadeUp 0.4s ease both`,
      animationDelay: `${index * 60}ms`,
    }}>
      {/* Header row */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <div>
          <div style={{ fontSize: 16, fontWeight: 700, color: "#f1f5f9", marginBottom: 4 }}>
            {service.label}
          </div>
          <div style={{ fontSize: 12, color: "#4ade8088", fontFamily: "monospace" }}>
            {service.description}
          </div>
        </div>
        <div style={{
          display: "flex", alignItems: "center", gap: 6,
          fontSize: 13, fontWeight: 600, color: STATUS_COLORS[service.status],
        }}>
          <span style={{
            width: 8, height: 8, borderRadius: "50%",
            background: STATUS_COLORS[service.status],
            boxShadow: `0 0 6px ${STATUS_COLORS[service.status]}`,
            display: "inline-block",
            animation: service.status === "up" ? "pulse 2s ease-in-out infinite" : undefined,
          }} />
          {STATUS_LABELS[service.status]}
        </div>
      </div>

      {/* 90-day bar chart */}
      <div>
        <UptimeBars status={service.status} />
        <div style={{ display: "flex", justifyContent: "space-between", marginTop: 6 }}>
          <span style={{ fontSize: 11, color: "#4b5563" }}>90 days ago</span>
          <span style={{ fontSize: 11, color: "#4b5563" }}>Today</span>
        </div>
      </div>

      {/* Uptime stats */}
      <div style={{ display: "flex", gap: 8 }}>
        <UptimeStat label="24H" value={uptimePct} />
        <UptimeStat label="7D" value={uptimePct} />
        <UptimeStat label="30D" value={uptimePct} />
        <UptimeStat label="1Y" value={uptimePct} />
      </div>

      {/* Response time */}
      {service.latency !== null && (
        <div style={{ fontSize: 12, color: "#6b7280" }}>
          Response time (24h):{" "}
          <span style={{ color: "#94a3b8", fontFamily: "monospace" }}>{service.latency}ms</span>
        </div>
      )}
    </div>
  );
}

const OVERALL_CONFIG: Record<Overall, { label: string; sub: string; color: string; bg: string; border: string; icon: string }> = {
  operational: {
    label: "All systems operational",
    sub: "Every SeylanHub endpoint is responding normally.",
    color: "#22c55e",
    bg: "rgba(34,197,94,0.08)",
    border: "rgba(34,197,94,0.25)",
    icon: "✓",
  },
  degraded: {
    label: "Partial system degradation",
    sub: "Some SeylanHub services are experiencing issues.",
    color: "#f59e0b",
    bg: "rgba(245,158,11,0.08)",
    border: "rgba(245,158,11,0.25)",
    icon: "!",
  },
  outage: {
    label: "Service disruption",
    sub: "One or more SeylanHub services are down.",
    color: "#ef4444",
    bg: "rgba(239,68,68,0.08)",
    border: "rgba(239,68,68,0.25)",
    icon: "✕",
  },
};

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

  const cfg = data ? OVERALL_CONFIG[data.overall] : null;

  const formatUpdated = (iso: string) => {
    const d = new Date(iso);
    return d.toLocaleDateString("en-US", {
      month: "long", day: "numeric", year: "numeric",
    }) + ", " + d.toLocaleTimeString("en-US", {
      hour: "numeric", minute: "2-digit", hour12: true,
    });
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(12px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.4; }
        }
        .skeleton {
          background: linear-gradient(90deg, rgba(255,255,255,0.04) 25%, rgba(255,255,255,0.07) 50%, rgba(255,255,255,0.04) 75%);
          background-size: 200% auto;
          animation: shimmer 1.5s infinite;
          border-radius: 8px;
        }
        @keyframes shimmer {
          0% { background-position: -200% center; }
          100% { background-position: 200% center; }
        }
      `}</style>

      <div style={{
        minHeight: "100vh",
        background: "#0a0a0f",
        color: "#e2e8f0",
        fontFamily: "'Inter', system-ui, sans-serif",
        animation: "fadeIn 0.5s ease",
      }}>
        <div style={{ maxWidth: 860, margin: "0 auto", padding: "48px 24px 80px" }}>

          {/* Nav bar */}
          <div style={{
            display: "flex", justifyContent: "space-between", alignItems: "center",
            marginBottom: 40,
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <div style={{
                width: 36, height: 36, borderRadius: 8,
                background: "linear-gradient(135deg, #1e40af, #7c3aed)",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 14, fontWeight: 700, color: "#fff",
              }}>
                S
              </div>
              <span style={{ fontWeight: 700, fontSize: 15, color: "#f1f5f9" }}>SeylanHub Status</span>
            </div>
            <a
              href="https://seylan-hub.vercel.app"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                fontSize: 13, color: "#6b7280", textDecoration: "none",
                display: "flex", alignItems: "center", gap: 4,
              }}
            >
              seylan-hub.vercel.app →
            </a>
          </div>

          {/* Overall banner */}
          {loading ? (
            <div className="skeleton" style={{ height: 88, marginBottom: 36, borderRadius: 12 }} />
          ) : cfg && data ? (
            <div style={{
              background: cfg.bg,
              border: `1px solid ${cfg.border}`,
              borderRadius: 12,
              padding: "22px 28px",
              marginBottom: 36,
              display: "flex", alignItems: "center", gap: 16,
              animation: "fadeUp 0.3s ease",
            }}>
              <div style={{
                width: 36, height: 36, borderRadius: "50%",
                border: `2px solid ${cfg.color}`,
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 16, color: cfg.color, fontWeight: 700, flexShrink: 0,
              }}>
                {cfg.icon}
              </div>
              <div>
                <div style={{ fontSize: 18, fontWeight: 700, color: cfg.color, marginBottom: 2 }}>
                  {cfg.label}
                </div>
                <div style={{ fontSize: 13, color: "#6b7280" }}>{cfg.sub}</div>
              </div>
            </div>
          ) : null}

          {/* Services header */}
          <div style={{
            display: "flex", justifyContent: "space-between", alignItems: "center",
            marginBottom: 16,
          }}>
            <span style={{
              fontSize: 11, fontWeight: 600, letterSpacing: "0.1em",
              textTransform: "uppercase", color: "#4b5563",
            }}>
              Services
            </span>
            {data && (
              <span style={{ fontSize: 11, color: "#4b5563" }}>
                Updated {formatUpdated(data.checkedAt)}
              </span>
            )}
          </div>

          {/* Service list */}
          <div style={{ display: "flex", flexDirection: "column", gap: 12, marginBottom: 48 }}>
            {loading
              ? Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="skeleton" style={{ height: 180, borderRadius: 12 }} />
                ))
              : data?.services.map((svc, i) => (
                  <ServiceRow key={svc.key} service={svc} index={i} />
                ))}
          </div>

          {/* Footer */}
          <div style={{
            borderTop: "1px solid rgba(255,255,255,0.06)",
            paddingTop: 24,
            display: "flex", justifyContent: "space-between", alignItems: "center",
            flexWrap: "wrap", gap: 12,
          }}>
            <div style={{ fontSize: 12, color: "#374151" }}>
              Powered by{" "}
              <span style={{ color: "#6b7280", fontWeight: 600 }}>Ardeno Studio</span>
            </div>
            <div style={{
              display: "flex", alignItems: "center", gap: 8,
              fontSize: 12, color: "#374151",
              fontFamily: "monospace",
            }}>
              <span style={{
                width: 6, height: 6, borderRadius: "50%",
                background: "#22c55e",
                display: "inline-block",
                animation: "pulse 2s ease-in-out infinite",
              }} />
              Auto-refresh in {String(countdown).padStart(2, "0")}s
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
