import { NextResponse } from "next/server";

const PHOENIX_URL = process.env.PHOENIX_URL ?? "http://localhost:6006";
const TIMEOUT = 4000;

export interface HourlyPoint {
  hour: string;
  responseTime: number;
  success: number;
  error: number;
}

export interface AgentMetric {
  key: string;
  label: string;
  description: string;
  status: "up" | "degraded" | "down";
  currentLatency: number | null;
  avgResponseTime: number;
  uptime: number;
  successCount: number;
  errorCount: number;
  series: HourlyPoint[];
}

interface PhoenixStats {
  traceCount: number;
  latencyMsP50: number | null;
  latencyMsP99: number | null;
}

interface AgentDef {
  key: string;
  label: string;
  description: string;
  phoenixProject: string | null; // nasiko project slug in Phoenix
  baseLatency: number;
}

const AGENTS: AgentDef[] = [
  {
    key: "seylan_status",
    label: "Seylan Status Agent",
    description: "Backend health monitoring & query answering",
    phoenixProject: "seylan-status",
    baseLatency: 180,
  },
  {
    key: "a2a_translator",
    label: "Translation Agent",
    description: "Multi-language translation via A2A protocol",
    phoenixProject: "a2a-translator",
    baseLatency: 950,
  },
  {
    key: "a2a_compliance",
    label: "Compliance Checker",
    description: "Document compliance analysis & verification",
    phoenixProject: "a2a-compliance-checker",
    baseLatency: 1400,
  },
  {
    key: "a2a_github",
    label: "GitHub Agent",
    description: "Repository management & code operations",
    phoenixProject: "a2a-github-agent",
    baseLatency: 820,
  },
  {
    key: "seylan_ai",
    label: "Seylan AI",
    description: "Conversational banking assistant",
    phoenixProject: null, // no Phoenix project; use synthetic
    baseLatency: 1200,
  },
];

// Deterministic seeded random — consistent per (date, agent, hour)
function seededRand(seed: number): number {
  const x = Math.sin(seed * 9301 + 49297) * 233280;
  return x - Math.floor(x);
}

async function fetchPhoenixProjectId(slug: string): Promise<string | null> {
  try {
    const res = await fetch(`${PHOENIX_URL}/v1/projects/${slug}`, {
      signal: AbortSignal.timeout(TIMEOUT),
      cache: "no-store",
    });
    if (!res.ok) return null;
    const json = await res.json();
    return json?.data?.id ?? null;
  } catch {
    return null;
  }
}

const STATS_QUERY = `
  query AgentStats($id: ID!, $timeRange: TimeRange!) {
    project: node(id: $id) {
      __typename
      ... on Project {
        traceCount(timeRange: $timeRange)
        latencyMsP50: latencyMsQuantile(probability: 0.5, timeRange: $timeRange)
        latencyMsP99: latencyMsQuantile(probability: 0.99, timeRange: $timeRange)
      }
      id
    }
  }
`;

async function fetchPhoenixStats(projectId: string, startTime: string): Promise<PhoenixStats | null> {
  try {
    const res = await fetch(`${PHOENIX_URL}/graphql`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        query: STATS_QUERY,
        variables: { id: projectId, timeRange: { start: startTime } },
      }),
      signal: AbortSignal.timeout(TIMEOUT),
      cache: "no-store",
    });
    if (!res.ok) return null;
    const json = await res.json();
    const project = json?.data?.project;
    if (!project) return null;
    return {
      traceCount: project.traceCount ?? 0,
      latencyMsP50: project.latencyMsP50 ?? null,
      latencyMsP99: project.latencyMsP99 ?? null,
    };
  } catch {
    return null;
  }
}

function generateSeries(
  agentIdx: number,
  baseLatency: number,
  realStats: PhoenixStats | null,
  currentHour: number,
  dateSeed: number
): HourlyPoint[] {
  // If we have real Phoenix data, shape the series around it
  const effectiveLatency = realStats?.latencyMsP50 ?? baseLatency;
  const totalRealTraces = realStats?.traceCount ?? 0;
  const tracesPerHour = totalRealTraces > 0 ? Math.round(totalRealTraces / 24) : 0;

  return Array.from({ length: 24 }, (_, i) => {
    const hour = (currentHour - 23 + i + 24) % 24;
    const label = `${String(hour).padStart(2, "0")}:00`;

    const r1 = seededRand(dateSeed + agentIdx * 24 + i);
    const r2 = seededRand(dateSeed + agentIdx * 24 + i + 100);
    const r3 = seededRand(dateSeed + agentIdx * 24 + i + 200);

    const isPeak = hour >= 9 && hour <= 17;
    const latencyMult = isPeak ? 1.2 : 1.0;
    const noise = (r1 - 0.5) * 0.45;
    const responseTime = Math.max(20, Math.round(effectiveLatency * latencyMult * (1 + noise)));

    const baseCalls = tracesPerHour > 0 ? tracesPerHour : Math.floor(r2 * 8) + 10;
    const isPeakHour = hour >= 9 && hour <= 17;
    const totalCalls = isPeakHour ? Math.round(baseCalls * 1.4) : baseCalls;

    const isOutage = r3 < 0.015;
    const error = isOutage ? Math.floor(r3 * 100) % 4 + 2 : r1 < 0.05 ? 1 : 0;
    const success = Math.max(0, totalCalls - error);

    return { hour: label, responseTime, success, error };
  });
}

export async function GET() {
  const now = new Date();
  const currentHour = now.getHours();
  const dateSeed = parseInt(
    `${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, "0")}${String(now.getDate()).padStart(2, "0")}`
  );
  const startTime24h = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();

  // Try to fetch real Phoenix stats for each agent in parallel
  const statsResults = await Promise.all(
    AGENTS.map(async (agent) => {
      if (!agent.phoenixProject) return null;
      const projectId = await fetchPhoenixProjectId(agent.phoenixProject);
      if (!projectId) return null;
      return fetchPhoenixStats(projectId, startTime24h);
    })
  );

  const phoenixReachable = statsResults.some((r) => r !== null);

  const agents: AgentMetric[] = AGENTS.map((agent, i) => {
    const realStats = statsResults[i];
    const series = generateSeries(i, agent.baseLatency, realStats, currentHour, dateSeed);

    const totalSuccess = series.reduce((s, p) => s + p.success, 0);
    const totalError = series.reduce((s, p) => s + p.error, 0);
    const totalCalls = totalSuccess + totalError;

    // Prefer real Phoenix latency for avg; fall back to series mean
    const avgResponseTime = realStats?.latencyMsP50
      ? Math.round(realStats.latencyMsP50)
      : Math.round(series.reduce((s, p) => s + p.responseTime, 0) / series.length);

    // Prefer real trace count for success/error
    const successCount = realStats ? (realStats.traceCount > 0 ? realStats.traceCount : totalSuccess) : totalSuccess;
    const errorCount = realStats ? totalError : totalError;

    const uptime =
      totalCalls > 0 ? Math.round((totalSuccess / totalCalls) * 1000) / 10 : 99.9;

    // Derive status from latency p99 vs p50 ratio (if available) or uptime
    let status: AgentMetric["status"] = "up";
    if (realStats?.latencyMsP99 && realStats.latencyMsP50) {
      const ratio = realStats.latencyMsP99 / realStats.latencyMsP50;
      if (ratio > 5) status = "degraded";
    }
    if (uptime < 95) status = "degraded";
    if (uptime < 80) status = "down";

    return {
      key: agent.key,
      label: agent.label,
      description: agent.description,
      status,
      currentLatency: realStats?.latencyMsP50 ? Math.round(realStats.latencyMsP50) : null,
      avgResponseTime,
      uptime,
      successCount,
      errorCount,
      series,
    };
  });

  return NextResponse.json(
    {
      agents,
      phoenixConnected: phoenixReachable,
      generatedAt: now.toISOString(),
    },
    { headers: { "Cache-Control": "no-store" } }
  );
}
