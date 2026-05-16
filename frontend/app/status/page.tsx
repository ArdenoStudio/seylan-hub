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

const OVERALL_META: Record<Overall, { label: string; color: string; bg: string; glow: string }> = {
  operational: {
    label: "All Systems Operational",
    color: "#4ade80",
    bg: "rgba(74,222,128,0.08)",
    glow: "0 0 40px rgba(74,222,128,0.25)",
  },
  degraded: {
    label: "Partial Degradation",
    color: "#fbbf24",
    bg: "rgba(251,191,36,0.08)",
    glow: "0 0 40px rgba(251,191,36,0.25)",
  },
  outage: {
    label: "Service Disruption",
    color: "#f87171",
    bg: "rgba(248,113,113,0.08)",
    glow: "0 0 40px rgba(248,113,113,0.25)",
  },
};

const SERVICE_ICONS: Record<string, string> = {
  api: "◈",
  wallet: "◎",
  loans: "◐",
  mock: "◇",
};

function StatusDot({ status }: { status: ServiceStatus }) {
  const colors: Record<ServiceStatus, string> = {
    up: "#4ade80",
    degraded: "#fbbf24",
    down: "#f87171",
  };
  return (
    <span style={{ position: "relative", display: "inline-flex", alignItems: "center", justifyContent: "center", width: 12, height: 12 }}>
      {status === "up" && (
        <span style={{
          position: "absolute", width: 20, height: 20, borderRadius: "50%",
          background: colors[status], opacity: 0.2,
          animation: "ping 2s ease-in-out infinite",
        }} />
      )}
      <span style={{
        width: 10, height: 10, borderRadius: "50%",
        background: colors[status],
        boxShadow: `0 0 8px ${colors[status]}`,
        display: "block",
      }} />
    </span>
  );
}

function ServiceCard({ service, index }: { service: Service; index: number }) {
  const statusLabels: Record<ServiceStatus, string> = {
    up: "Operational",
    degraded: "Degraded",
    down: "Down",
  };
  const statusColors: Record<ServiceStatus, string> = {
    up: "#4ade80",
    degraded: "#fbbf24",
    down: "#f87171",
  };

  return (
    <div style={{
      background: "rgba(255,255,255,0.03)",
      border: "1px solid rgba(255,255,255,0.07)",
      borderRadius: 16,
      padding: "24px 28px",
      display: "flex",
      flexDirection: "column",
      gap: 16,
      position: "relative",
      overflow: "hidden",
      animation: `fadeUp 0.5s ease both`,
      animationDelay: `${index * 80}ms`,
      transition: "border-color 0.2s, background 0.2s",
    }}
      onMouseEnter={e => {
        (e.currentTarget as HTMLDivElement).style.background = "rgba(255,255,255,0.055)";
        (e.currentTarget as HTMLDivElement).style.borderColor = "rgba(201,150,60,0.3)";
      }}
      onMouseLeave={e => {
        (e.currentTarget as HTMLDivElement).style.background = "rgba(255,255,255,0.03)";
        (e.currentTarget as HTMLDivElement).style.borderColor = "rgba(255,255,255,0.07)";
      }}
    >
      {/* Subtle corner accent */}
      <div style={{
        position: "absolute", top: 0, right: 0,
        width: 60, height: 60,
        background: `radial-gradient(circle at top right, ${statusColors[service.status]}15, transparent 70%)`,
        pointerEvents: "none",
      }} />

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <span style={{
            fontSize: 22, color: "#c9963c", lineHeight: 1,
            fontFamily: "monospace",
          }}>
            {SERVICE_ICONS[service.key] ?? "○"}
          </span>
          <div>
            <div style={{ fontSize: 15, fontWeight: 600, color: "#f0ebe2", letterSpacing: "0.01em" }}>
              {service.label}
            </div>
            <div style={{ fontSize: 12, color: "#6b7280", marginTop: 2 }}>
              {service.description}
            </div>
          </div>
        </div>
        <StatusDot status={service.status} />
      </div>

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <span style={{
          fontSize: 12, fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase",
          color: statusColors[service.status],
        }}>
          {statusLabels[service.status]}
        </span>
        {service.latency !== null && (
          <span style={{
            fontSize: 12, color: "#4b5563",
            fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
          }}>
            {service.latency}ms
          </span>
        )}
      </div>

      {/* Latency bar */}
      {service.latency !== null && (
        <div style={{ height: 2, background: "rgba(255,255,255,0.06)", borderRadius: 2, overflow: "hidden" }}>
          <div style={{
            height: "100%", borderRadius: 2,
            background: statusColors[service.status],
            width: `${Math.min(100, (service.latency / 500) * 100)}%`,
            transition: "width 0.6s ease",
            opacity: 0.7,
          }} />
        </div>
      )}
    </div>
  );
}

function CountdownRing({ seconds, total }: { seconds: number; total: number }) {
  const r = 10;
  const circ = 2 * Math.PI * r;
  const progress = (seconds / total) * circ;
  return (
    <svg width={28} height={28} style={{ transform: "rotate(-90deg)" }}>
      <circle cx={14} cy={14} r={r} fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth={2} />
      <circle
        cx={14} cy={14} r={r} fill="none"
        stroke="#c9963c" strokeWidth={2}
        strokeDasharray={circ}
        strokeDashoffset={circ - progress}
        strokeLinecap="round"
        style={{ transition: "stroke-dashoffset 1s linear" }}
      />
    </svg>
  );
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

  const meta = data ? OVERALL_META[data.overall] : null;

  const formatTime = (iso: string) => {
    const d = new Date(iso);
    return d.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", second: "2-digit" });
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;500;600&family=JetBrains+Mono:wght@400;500&display=swap');

        * { box-sizing: border-box; margin: 0; padding: 0; }

        @keyframes ping {
          0%, 100% { transform: scale(1); opacity: 0.2; }
          50% { transform: scale(1.8); opacity: 0; }
        }
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(16px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes shimmer {
          0% { background-position: -200% center; }
          100% { background-position: 200% center; }
        }

        .skeleton {
          background: linear-gradient(90deg, rgba(255,255,255,0.04) 25%, rgba(255,255,255,0.08) 50%, rgba(255,255,255,0.04) 75%);
          background-size: 200% auto;
          animation: shimmer 1.5s infinite;
          border-radius: 8px;
        }
      `}</style>

      <div style={{
        minHeight: "100vh",
        background: "#060b14",
        color: "#e8e4dc",
        fontFamily: "'DM Sans', sans-serif",
        position: "relative",
        overflow: "hidden",
      }}>
        {/* Background grid */}
        <div style={{
          position: "fixed", inset: 0, pointerEvents: "none", zIndex: 0,
          backgroundImage: `
            linear-gradient(rgba(201,150,60,0.03) 1px, transparent 1px),
            linear-gradient(90deg, rgba(201,150,60,0.03) 1px, transparent 1px)
          `,
          backgroundSize: "60px 60px",
        }} />

        {/* Ambient glow */}
        <div style={{
          position: "fixed", top: "-20%", left: "50%", transform: "translateX(-50%)",
          width: 600, height: 400, borderRadius: "50%",
          background: "radial-gradient(ellipse, rgba(201,150,60,0.06) 0%, transparent 70%)",
          pointerEvents: "none", zIndex: 0,
        }} />

        <div style={{
          position: "relative", zIndex: 1,
          maxWidth: 780, margin: "0 auto",
          padding: "64px 24px 80px",
          animation: "fadeIn 0.6s ease",
        }}>

          {/* Header */}
          <div style={{ marginBottom: 52, textAlign: "center" }}>
            <div style={{
              display: "inline-flex", alignItems: "center", gap: 8,
              background: "rgba(201,150,60,0.1)", border: "1px solid rgba(201,150,60,0.2)",
              borderRadius: 100, padding: "4px 14px", marginBottom: 24,
            }}>
              <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#c9963c", display: "block" }} />
              <span style={{ fontSize: 11, letterSpacing: "0.14em", textTransform: "uppercase", color: "#c9963c", fontWeight: 600 }}>
                Live Status
              </span>
            </div>

            <h1 style={{
              fontFamily: "'Playfair Display', Georgia, serif",
              fontSize: "clamp(36px, 6vw, 56px)",
              fontWeight: 500, letterSpacing: "-0.02em",
              color: "#f0ebe2", lineHeight: 1.1,
              marginBottom: 12,
            }}>
              SeylanHub
              <span style={{ color: "#c9963c" }}> Status</span>
            </h1>

            <p style={{ fontSize: 15, color: "#6b7280", maxWidth: 380, margin: "0 auto", lineHeight: 1.6 }}>
              Real-time health monitoring for all SeylanHub backend services.
            </p>
          </div>

          {/* Overall status banner */}
          {loading ? (
            <div className="skeleton" style={{ height: 80, marginBottom: 32, borderRadius: 16 }} />
          ) : meta && data ? (
            <div style={{
              background: meta.bg,
              border: `1px solid ${meta.color}30`,
              borderRadius: 16, padding: "20px 28px",
              display: "flex", alignItems: "center", justifyContent: "space-between",
              marginBottom: 32,
              boxShadow: meta.glow,
              animation: "fadeUp 0.4s ease",
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                <span style={{ position: "relative", display: "inline-flex" }}>
                  <span style={{
                    position: "absolute", width: 20, height: 20, borderRadius: "50%",
                    background: meta.color, opacity: 0.25,
                    animation: "ping 2s ease-in-out infinite",
                  }} />
                  <span style={{
                    width: 14, height: 14, borderRadius: "50%",
                    background: meta.color, display: "block",
                    boxShadow: `0 0 10px ${meta.color}`,
                  }} />
                </span>
                <div>
                  <div style={{
                    fontSize: 16, fontWeight: 600, color: meta.color, letterSpacing: "0.01em",
                  }}>
                    {meta.label}
                  </div>
                  <div style={{ fontSize: 12, color: "#6b7280", marginTop: 2 }}>
                    Last checked at {formatTime(data.checkedAt)}
                  </div>
                </div>
              </div>

              <div style={{ display: "flex", alignItems: "center", gap: 10, color: "#4b5563", fontSize: 12 }}>
                <CountdownRing seconds={countdown} total={REFRESH_INTERVAL} />
                <span style={{ fontFamily: "'JetBrains Mono', monospace" }}>
                  {String(countdown).padStart(2, "0")}s
                </span>
              </div>
            </div>
          ) : null}

          {/* Service grid */}
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))",
            gap: 16,
            marginBottom: 48,
          }}>
            {loading
              ? Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="skeleton" style={{ height: 140, borderRadius: 16 }} />
                ))
              : data?.services.map((svc, i) => (
                  <ServiceCard key={svc.key} service={svc} index={i} />
                ))}
          </div>

          {/* Footer */}
          <div style={{
            borderTop: "1px solid rgba(255,255,255,0.06)",
            paddingTop: 28,
            display: "flex", justifyContent: "space-between", alignItems: "center",
            flexWrap: "wrap", gap: 12,
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <span style={{
                fontFamily: "'Playfair Display', serif",
                fontSize: 14, color: "#c9963c", fontWeight: 500,
              }}>
                SeylanHub
              </span>
              <span style={{ color: "#374151", fontSize: 14 }}>·</span>
              <span style={{ fontSize: 12, color: "#4b5563" }}>Ardeno Studio</span>
            </div>
            <span style={{
              fontSize: 11, color: "#374151", letterSpacing: "0.06em",
              fontFamily: "'JetBrains Mono', monospace",
            }}>
              AUTO-REFRESH · 30s
            </span>
          </div>
        </div>
      </div>
    </>
  );
}
